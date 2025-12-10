
// hooks/useAutonomousSystem.ts
import React, { useEffect, useRef } from 'react';
import { AuraState, Action, SyscallCall, KernelTaskType, KernelTask } from '../types.ts';
import { UseGeminiAPIResult } from '../types.ts';
import { HAL } from '../core/hal.ts';

interface UseAutonomousSystemProps {
    geminiAPI: UseGeminiAPIResult;
    state: AuraState;
    dispatch: React.Dispatch<Action>;
    addToast: (msg: string, type?: any) => void;
    t: (key: string) => string;
    isPaused: boolean;
    syscall: (call: SyscallCall, args: any, traceId?: string) => void;
}

export const useAutonomousSystem = ({
    geminiAPI: api,
    state,
    isPaused,
    syscall,
}: UseAutonomousSystemProps) => {
    const currentStateRef = useRef(state);
    // Track processed task IDs to prevent double-execution/infinite loops
    const processedTaskIds = useRef<Set<string>>(new Set());
    
    useEffect(() => {
        currentStateRef.current = state;
    }, [state]);

    // --- SCHEDULER LOOP ---
    // Automatically promotes the next queued task to "Running" if the kernel is idle.
    useEffect(() => {
        if (isPaused) return;

        const { runningTask, taskQueue } = state.kernelState;

        // If we are idle and have work to do, pick the next task.
        if (!runningTask && taskQueue.length > 0) {
            const nextTask = taskQueue[0];
            // Dispatching this will update state, triggering the execution effect below.
            syscall('KERNEL/SET_RUNNING_TASK', { task: nextTask }, nextTask.traceId);
        }
    }, [state.kernelState.runningTask, state.kernelState.taskQueue, isPaused, syscall]);

    // --- EXECUTION LOOP ---
    // Reacts to a new "runningTask" appearing in the state.
    useEffect(() => {
        if (isPaused) return;
        
        const runningTask = state.kernelState.runningTask;
        
        // 1. If no task, do nothing.
        if (!runningTask) return;

        // 2. CRITICAL: If we already processed this specific task ID, do NOT run it again.
        if (processedTaskIds.current.has(runningTask.id)) {
            return; 
        }
        
        // 3. Mark as processed immediately to prevent re-entry during async operations
        processedTaskIds.current.add(runningTask.id);

        const executeTask = async () => {
             // Allow tasks to define an immediate follow-up to prevent scheduler gaps
             let immediateFollowUpTask: KernelTask | null = null;

             try {
                 switch (runningTask.type) {
                    // --- CHAT RESPONSE GENERATION ---
                    case KernelTaskType.GENERATE_CHAT_RESPONSE: {
                        const history = currentStateRef.current.history;
                        // Extract optional strategy/mode override from payload
                        const { strategy, mode, inputPrompt } = runningTask.payload || {};
                        
                        try {
                            const response = await api.generateChatResponse(history, strategy || null, mode || null, inputPrompt || null);
                            let fullText = "";
                            for await (const chunk of response) {
                                 fullText += chunk.text;
                            }
    
                            syscall('ADD_HISTORY_ENTRY', {
                                from: 'bot',
                                text: fullText,
                                timestamp: Date.now()
                            });
                        } catch (e) {
                            console.error("Chat generation error:", e);
                            syscall('ADD_HISTORY_ENTRY', {
                                from: 'system',
                                text: `Error generating response: ${(e as Error).message}`,
                                timestamp: Date.now()
                            });
                        }
                        break;
                    }
    
                    // --- POLYGLOT CODE EXECUTION ---
                    case KernelTaskType.EXECUTE_POLYGLOT_CODE: {
                        const { language, code, goal } = runningTask.payload;
                        let codeToRun = code;
    
                        if (!codeToRun) {
                            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Generating ${language} code for: "${goal}"...` });
                            try {
                                codeToRun = await api.generateCode(language, goal);
                            } catch (e) {
                                syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Failed to generate code: ${(e as Error).message}` });
                                break; // Abort
                            }
                        }
    
                        if (codeToRun) {
                            let output = '';
                            try {
                                switch(language) {
                                    case 'python': output = await HAL.Runtimes.runPython(codeToRun); break;
                                    case 'ruby': output = await HAL.Runtimes.runRuby(codeToRun); break;
                                    case 'lua': output = await HAL.Runtimes.runLua(codeToRun); break;
                                    case 'scheme': output = await HAL.Runtimes.runScheme(codeToRun); break;
                                    default: output = "Language not supported by HAL.";
                                }
                            } catch (e) {
                                output = `Runtime Error: ${(e as Error).message}`;
                            }
                            
                            // Structured logging for better UI rendering
                            syscall('ADD_HISTORY_ENTRY', { 
                                from: 'tool', 
                                toolName: 'polyglot_coprocessor',
                                args: { language, code: codeToRun, goal },
                                toolResult: { output: output || 'Execution complete (no output).' }
                            });
                        }
                        break;
                    }
    
                    // --- BRAINSTORMING ---
                    case KernelTaskType.RUN_BRAINSTORM_SESSION: {
                        const { triageResult, customPersonas } = runningTask.payload;
                        const topic = triageResult?.goal || "General Innovation";
                        
                        // Set state to brainstorming
                        syscall('BRAINSTORM/START', { topic });
                        
                        // Use default personas if none provided in payload
                        const participants = customPersonas || []; 
                        
                        try {
                            const ideas = await api.generateBrainstormIdeas(topic, participants);
                            
                            // Add ideas to state
                            for (const idea of ideas) {
                                // Ensure idea is a string to prevent [object Object]
                                const cleanIdea = typeof idea.idea === 'string' ? idea.idea : JSON.stringify(idea.idea);
                                syscall('BRAINSTORM/ADD_IDEA', { idea: { ...idea, idea: cleanIdea } });
                            }
                            
                            // Post summary to chat
                            let summaryText = `## Brainstorming Session: ${topic}\n\n`;
                            ideas.forEach((i: any) => {
                                const text = typeof i.idea === 'string' ? i.idea : JSON.stringify(i.idea);
                                summaryText += `**${i.personaName}**: ${text}\n\n`;
                            });
                            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: summaryText });
    
                            // Strategist Selection & Synthesis
                            if (ideas.length > 0) {
                                syscall('ADD_HISTORY_ENTRY', { from: 'system', text: "Strategist is evaluating concepts..." });

                                const ideasText = ideas.map((i: any) => `Persona: ${i.personaName}\nIdea: ${typeof i.idea === 'string' ? i.idea : JSON.stringify(i.idea)}`).join('\n\n');

                                const strategyPrompt = `
                                Context: A brainstorming session on "${topic}".
                                
                                Ideas generated:
                                ${ideasText}
                                
                                You are the Chief Strategist. 
                                1. Synthesize these ideas into a cohesive strategy or solution.
                                2. Select the best concepts.
                                3. Expand them into a concrete, actionable proposal or explanation.
                                
                                Output Format: Markdown.
                                `;

                                const strategyResponse = await api.generateChatResponse(
                                    [{ from: 'user', text: strategyPrompt, id: 'strat', timestamp: Date.now() }],
                                    null, null, null
                                );
                                
                                let strategyText = "";
                                for await (const chunk of strategyResponse) {
                                     strategyText += chunk.text;
                                }

                                // Update state with the "winning" idea (just the first one or synthesis for now to satisfy UI)
                                if (ideas[0]) {
                                     syscall('BRAINSTORM/SET_WINNER', { winningIdea: strategyText });
                                }
                                
                                syscall('ADD_HISTORY_ENTRY', { 
                                    from: 'bot', 
                                    text: `**Strategist's Verdict**\n\n${strategyText}` 
                                });
                            }
                            
                            syscall('BRAINSTORM/FINALIZE', {});
    
                        } catch(e) {
                             console.error(e);
                             syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Brainstorming error: ${(e as Error).message}` });
                             syscall('BRAINSTORM/RESET', {});
                        }
                        break;
                    }

                    // --- STRATEGIC DECOMPOSITION ---
                    case KernelTaskType.DECOMPOSE_STRATEGIC_GOAL: {
                        const { triageResult } = runningTask.payload;
                        const goalText = triageResult.goal;
                        
                        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Strategist: Decomposing complex goal "${goalText}"...` });
                        
                        try {
                            const steps = await api.decomposeGoal(goalText);
                            const plan = {
                                executionMode: 'sequential',
                                steps: steps
                            };
                            
                            syscall('BUILD_GOAL_TREE', { rootGoal: goalText, decomposition: plan });
                            
                            // Format plan for display
                            const planText = steps.map((s: string, i: number) => `${i+1}. ${s}`).join('\n');
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `**Strategic Plan:**\n${planText}\n\nI have initialized the Goal Tree.` });
                            
                            // Automatically start executing or discussing the first step
                            // Queue a follow-up task to analyze architecture
                            const analysisTask: KernelTask = {
                                id: `follow_up_${self.crypto.randomUUID()}`,
                                type: KernelTaskType.GENERATE_CHAT_RESPONSE,
                                payload: { 
                                    strategy: 'architectural_analysis',
                                    mode: 'creativity',
                                    inputPrompt: `The user wants to solve: "${goalText}".
                                    
                                    A strategic plan has been created:
                                    ${planText}
                                    
                                    Since this is a Grand Challenge problem (Navier-Stokes), a simple execution is impossible.
                                    Instead, perform a GAP ANALYSIS.
                                    1. Acknowledge the complexity.
                                    2. Explain specific limitations of current AI (finite precision, hallucination, lack of causal reasoning) that prevent a solution.
                                    3. Provide a concrete list of architectural improvements needed for Aura to solve this in the future (e.g. Neuro-Symbolic integration, Infinite-Precision Arithmetic, Automated Theorem Proving).`
                                },
                                timestamp: Date.now(),
                                traceId: runningTask.traceId
                            };
                            
                            // Queue it to persist in state
                            syscall('KERNEL/QUEUE_TASK', analysisTask, runningTask.traceId);

                            // CHAIN IT IMMEDIATELY so we don't drop the ball
                            immediateFollowUpTask = analysisTask;
                            
                        } catch (e) {
                             syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Decomposition failed: ${(e as Error).message}` });
                        }
                        break;
                    }
                    
                    // --- MATH VERIFICATION ---
                    case KernelTaskType.VERIFY_AND_EXECUTE_MATH: {
                        const { command } = runningTask.payload;
                        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: "ATP Coprocessor: Verifying mathematical validity..." });
                        
                        const pythonCode = await api.generateMathVerificationCode(command);
                        
                        let result = '';
                        try {
                             result = await HAL.Runtimes.runPython(pythonCode);
                        } catch(e) {
                             result = `Verification Error: ${(e as Error).message}`;
                        }
                        
                        syscall('ADD_HISTORY_ENTRY', { 
                            from: 'tool', 
                            toolName: 'Math Verification', 
                            args: { code: pythonCode },
                            toolResult: { output: result },
                            text: result 
                        });
                        
                        const explanation = await api.generateChatResponse(
                            [{ from: 'user', text: `Explain this math result to the user: ${result}`, id: 'math_expl', timestamp: Date.now() }],
                            null, null, null
                        );
                        let explText = '';
                        for await (const chunk of explanation) { explText += chunk.text; }
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: explText });
                        break;
                    }

                    // --- DOCUMENT FORGE GENERATION ---
                    case KernelTaskType.RUN_DOCUMENT_FORGE: {
                        const { goal } = runningTask.payload;
                        syscall('DOCUMENT_FORGE/START_PROJECT', { goal });
                        
                        try {
                            // 1. Generate Outline
                            syscall('DOCUMENT_FORGE/SET_STATUS', { status: 'outlining', message: 'Generating document structure...' });
                            const outline = await api.generateDocumentOutline(goal);
                            syscall('DOCUMENT_FORGE/SET_OUTLINE', { outline });

                            // 2. Generate Content per Chapter
                            for (const chapter of outline.chapters) {
                                syscall('DOCUMENT_FORGE/SET_STATUS', { 
                                    status: 'generating_content', 
                                    message: `Writing chapter: ${chapter.title}...` 
                                });
                                
                                syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { 
                                    id: chapter.id, 
                                    updates: { isGenerating: true } 
                                });

                                const content = await api.generateChapterContent(chapter.title, goal);

                                syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { 
                                    id: chapter.id, 
                                    updates: { content, isGenerating: false } 
                                });
                            }

                            // 3. Finalize
                            syscall('DOCUMENT_FORGE/FINALIZE_PROJECT', {});

                        } catch (e) {
                            console.error("Document Forge Error:", e);
                            syscall('DOCUMENT_FORGE/SET_STATUS', { status: 'error', message: (e as Error).message });
                        }
                        break;
                    }
                 }
             } catch (err) {
                 console.error("Kernel Task Error:", err);
                 syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `System Error: ${(err as Error).message}` });
             } finally {
                 // 4. CRITICAL: Clear the running task to prevent infinite loops.
                 // If we have a follow-up, set it running immediately.
                 if (immediateFollowUpTask) {
                     syscall('KERNEL/SET_RUNNING_TASK', { task: immediateFollowUpTask }, runningTask.traceId);
                 } else {
                     syscall('KERNEL/SET_RUNNING_TASK', { task: null }, runningTask.traceId);
                 }
             }
        };
        
        executeTask();
        
    }, [state.kernelState.runningTask, isPaused, api, syscall]);
};
