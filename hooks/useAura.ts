
// hooks/useAura.ts
import { useMemo, useEffect, useRef, useCallback } from 'react';
import { useAuraState } from './useAuraState.ts';
import { useGeminiAPI } from './useGeminiAPI.ts';
import { useUIHandlers } from './useUIHandlers.ts';
import { useToasts } from './useToasts.ts';
import { useAutonomousSystem } from './useAutonomousSystem.ts';
import { useToolExecution } from './useToolExecution.ts';
import { HAL } from '../core/hal.ts';
// FIX: Add missing type imports
import { SyscallCall, HistoryEntry, Persona, CognitiveStrategy, KernelTaskType, TriageResult, CrystallizedSkill } from '../types.ts';
// import { useDomObserver } from './useDomObserver.ts'; // REMOVED to prevent render loops
import { useLiveSession } from './useLiveSession.ts';
import { useTranslation } from 'react-i18next';
import { personas } from '../state/personas.ts';
import { useNeuralSurrogate } from './useNeuralSurrogate.ts'; // Import

export const useAura = () => {
    const { state, dispatch, memoryStatus, clearMemoryAndState, saveStateToMemory } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();
    const { t, i18n } = useTranslation();

    // This effect syncs i18next language with app state language
    useEffect(() => {
        if (i18n.language !== state.language) {
            i18n.changeLanguage(state.language);
        }
    }, [state.language, i18n]);

    const syscall = useCallback((call: SyscallCall, args: any, traceId?: string) => {
        dispatch({ type: 'SYSCALL', payload: { call, args, traceId } });
    }, [dispatch]);

    const geminiAPI = useGeminiAPI(state, dispatch, addToast);
    
    const uiHandlers = useUIHandlers(state, dispatch, syscall, addToast, t, clearMemoryAndState, geminiAPI);

    // Integrate Neural Surrogate Hook
    useNeuralSurrogate(state, uiHandlers.currentCommand, syscall);

    useAutonomousSystem({
        geminiAPI,
        state,
        dispatch,
        addToast,
        t,
        isPaused: uiHandlers.isPaused,
        syscall,
    });
    
    /* 
       useDomObserver Removed: 
       The DOM observer was causing excessive state updates (SITUATIONAL_AWARENESS/LOG_DOM_CHANGE),
       which triggered re-renders and re-execution of autonomous system effects, leading to API rate limiting (429).
    */
    
    useToolExecution({
        syscall,
        addToast,
        toolExecutionRequest: state.toolExecutionRequest,
        state,
        geminiAPI, // Pass geminiAPI to the tool executor
    });

    const liveSession = useLiveSession(state, dispatch, addToast);

    // Effect to handle asynchronous VFS write operations to IndexedDB (Blob Store)
    useEffect(() => {
        const vfsWriteRequest = state.selfProgrammingState.vfsWriteRequest;
        if (!vfsWriteRequest) return;

        const processRequest = async () => {
            try {
                if (vfsWriteRequest.type === 'WRITE') {
                    for (const file of vfsWriteRequest.files) {
                         const content = file.content || '';
                         const hash = await HAL.VFS.computeHash(content);
                         
                         // Save content blob to IDB
                         await HAL.Memristor.saveBlob(hash, content);
                         
                         // Update Tree in State with new Hash
                         syscall('VFS/UPDATE_TREE', { path: file.path, hash, size: content.length });
                         
                         // Keep legacy path list updated
                         syscall('VFS/ADD_PATH', { path: file.path });
                    }
                } else if (vfsWriteRequest.type === 'DELETE') {
                    for (const file of vfsWriteRequest.files) {
                        // We don't delete blobs immediately (garbage collection is a future problem)
                        // Just remove from tree and path list
                        syscall('VFS/DELETE_PATH', { path: file.path }); // This needs to handle tree deletion in reducer
                    }
                }
                
                if (vfsWriteRequest.reboot) {
                    addToast('VFS Tree updated. Rebooting to apply changes.', 'success');
                    syscall('SYSTEM/REBOOT', {});
                } else {
                    addToast('VFS Blobs written and Tree updated.', 'success');
                }
            } catch (e) {
                addToast(`VFS sync failed: ${(e as Error).message}`, 'error');
            } finally {
                syscall('VFS/CLEAR_WRITE_REQUEST', {});
            }
        };

        processRequest();
    }, [state.selfProgrammingState.vfsWriteRequest, syscall, addToast]);


    const processCommand = async (command: string, file: File | undefined, traceId: string) => {
        syscall('PROCESS_USER_INPUT_INTO_PERCEPT', {
            intent: 'unknown',
            rawText: command,
            ...(file && { sensoryEngram: { modality: file.type.startsWith('image') ? 'visual' : 'auditory', rawPrimitives: [{type: 'file_attachment', value: file.name}] } })
        }, traceId);

        // Queue the Active Inference evaluation task
        syscall('KERNEL/QUEUE_TASK', {
            id: `eval_pred_${self.crypto.randomUUID()}`,
            type: KernelTaskType.EVALUATE_PREDICTION_ERROR,
            payload: {},
            timestamp: Date.now(),
            traceId
        }, traceId);
        
        // --- STERNBERG: REFLEX ARC ---
        // Check for crystallized skills (automaticity) before engaging novelty processing (LLM)
        const skills = Object.values(state.selfProgrammingState.skillLibrary) as CrystallizedSkill[];
        for (const skill of skills) {
            try {
                // SAFEGUARD: Wrap regex creation in try-catch to prevent app crashes
                if (new RegExp(skill.triggerPattern, 'i').test(command)) {
                     syscall('ADD_HISTORY_ENTRY', { 
                        from: 'system', 
                        text: `Reflex Arc Activated: Matching skill found ("${skill.name}"). Bypassing Cognitive Core.`
                    }, traceId);
                    
                    const reflexTaskId = `reflex_${self.crypto.randomUUID()}`;
                    const reflexPayload = { skillId: skill.id, input: command };

                    // Queue the execution task.
                    syscall('KERNEL/QUEUE_TASK', {
                        id: reflexTaskId,
                        type: KernelTaskType.EXECUTE_CRYSTALLIZED_SKILL,
                        payload: reflexPayload,
                        timestamp: Date.now(),
                        traceId
                    }, traceId);
                    
                    // Force scheduler for immediate reflex execution using SAME ID to prevent double execution
                     syscall('KERNEL/SET_RUNNING_TASK', { 
                        task: {
                            id: reflexTaskId,
                            type: KernelTaskType.EXECUTE_CRYSTALLIZED_SKILL,
                            payload: reflexPayload,
                            timestamp: Date.now(),
                            traceId,
                        } 
                    }, traceId);
                    return; // SHORT CIRCUIT - Do not call Gemini Triage
                }
            } catch(e) {
                console.error(`Reflex Arc Error for skill ${skill.name}:`, e);
                // Continue to next skill or fall back to LLM
            }
        }
        // -----------------------------

        const triageResult = await geminiAPI.triageUserIntent(command);
        syscall('ADD_HISTORY_ENTRY', { 
            from: 'system', 
            text: `Cognitive Triage: Classified as '${triageResult.type}'. Goal: "${triageResult.goal}". Reasoning: ${triageResult.reasoning}`
        }, traceId);

        let taskType: KernelTaskType;
        let payload: any = { command, file, triageResult };

        switch (triageResult.type) {
            case 'PYTHON_TASK':
            case 'RUBY_TASK':
            case 'LUA_TASK':
            case 'SCHEME_TASK':
                taskType = KernelTaskType.EXECUTE_POLYGLOT_CODE;
                payload = { 
                    language: triageResult.type.replace('_TASK', '').toLowerCase(), 
                    code: triageResult.code,
                    goal: triageResult.goal 
                };
                break;
            case 'VERIFIED_MATH': // New Case for Symbolic Grounding
                taskType = KernelTaskType.VERIFY_AND_EXECUTE_MATH;
                payload = { command: command };
                break;
            case 'SYMBOLIC_SOLVER':
                taskType = KernelTaskType.RUN_SYMBOLIC_SOLVER;
                break;
            case 'VISION_ANALYSIS':
                taskType = KernelTaskType.RUN_VISION_ANALYSIS;
                break;
            case 'COMPLEX_TASK':
                taskType = KernelTaskType.DECOMPOSE_STRATEGIC_GOAL;
                break;
            case 'MATHEMATICAL_PROOF':
                taskType = KernelTaskType.RUN_MATHEMATICAL_PROOF;
                break;
            case 'BRAINSTORM':
            // FIX: Corrected typo from BRAINSTORM_SCIFI_COUNCIL to BRAINSTORM_SCI_FI_COUNCIL to match the type definition.
            case 'BRAINSTORM_SCI_FI_COUNCIL':
                taskType = KernelTaskType.RUN_BRAINSTORM_SESSION;
                break;
            case 'SIMPLE_CHAT':
            default:
                taskType = KernelTaskType.GENERATE_CHAT_RESPONSE;
                break;
        }

        // CRITICAL FIX: Generate Task ID once and use for both queue and run to prevent double execution
        const mainTaskId = `task_${self.crypto.randomUUID()}`;
        const mainTask = {
            id: mainTaskId,
            type: taskType,
            payload: payload,
            timestamp: Date.now(),
            traceId,
        };

        syscall('KERNEL/QUEUE_TASK', mainTask, traceId);
        
        // IMPORTANT: Scheduler Logic to pick up the task immediately
        // Pass the exact same task object/ID so the reducer can remove it from the queue
        syscall('KERNEL/SET_RUNNING_TASK', { 
            task: mainTask 
        }, traceId);
    };

    const handleSendCommand = (command: string, file?: File) => {
        if (!command.trim() && !file) {
            return;
        }
        
        const traceId = `trace_user_${self.crypto.randomUUID()}`;
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: command, fileName: file?.name }, traceId);
        syscall('PROCESS_COMMAND', { command, file, traceId }, traceId);
        
        uiHandlers.setCurrentCommand('');
        uiHandlers.setAttachedFile(null);
    };

    useEffect(() => {
        if (state.commandToProcess) {
            const { command, file, traceId } = state.commandToProcess;
            syscall('CLEAR_COMMAND_TO_PROCESS', {}, traceId);
            processCommand(command, file, traceId);
        }
    }, [state.commandToProcess]);
    
    const handleFeedback = (id: string, feedback: 'positive' | 'negative') => {
        const traceId = `trace_feedback_${self.crypto.randomUUID()}`;
        syscall('UPDATE_HISTORY_FEEDBACK', { id, feedback }, traceId);
        syscall('USER_MODEL/LOG_TASK_SUCCESS', { success: feedback === 'positive' }, traceId);

        if (feedback === 'negative') {
            syscall('ETHICAL_GOVERNOR/LEARN_FROM_FEEDBACK', { historyId: id, feedback }, traceId);
        }
    };

    return {
        state,
        dispatch,
        syscall,
        memoryStatus,
        toasts,
        addToast,
        removeToast,
        t,
        i18n,
        language: i18n.language,
        geminiAPI,
        saveStateToMemory,
        ...uiHandlers,
        ...liveSession,
        handleSendCommand,
        handleFeedback,
    };
};
