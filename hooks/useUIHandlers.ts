
// hooks/useUIHandlers.ts
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, Dispatch } from 'react';
import { 
    AuraState, ToastType, Action, SyscallCall, ArchitecturalChangeProposal, 
    SelfProgrammingCandidate, GoalTree, GoalType, UseGeminiAPIResult, 
    CoCreatedWorkflow, CreateFileCandidate, Plugin, HistoryEntry, 
    UIHandlers, PsycheAdaptationProposal, DoxasticExperiment, KnowledgeFact, CognitiveMode, KernelTaskType, CrystallizedSkill
} from '../types';
import { migrateState } from '../state/migrations';
import { CURRENT_STATE_VERSION } from '../constants';
import { HAL } from '../core/hal';
import { useLocalization } from '../context/AuraContext';
import { generateManifest, generateStateSchema, generateArchitectureSchema, generateSyscallSchema } from '../core/schemaGenerator';
// FIX: Correctly import INITIAL_VFS_SEED from vfs.ts
import { INITIAL_VFS_SEED } from '../core/vfs';
import { loadSdk } from '../core/sdkLoader';

declare const JSZip: any;

type SyscallFn = (call: SyscallCall, args: any, traceId?: string) => void;

// FIX: Corrected the return type of the `t` function from `void` to `string`.
// FIX: Changed React.Dispatch to Dispatch for consistency
export const useUIHandlers = (state: AuraState, dispatch: Dispatch<Action>, syscall: SyscallFn, addToast: (msg: string, type?: ToastType) => void, t: (key: string, options?: any) => string, clearMemoryAndState: () => Promise<void>, geminiAPI: UseGeminiAPIResult): UIHandlers & { handleLoadPluginKnowledge: (pluginId: string) => Promise<void>, handleManualAddFact: (fact: Omit<KnowledgeFact, 'id'>) => void, handleManualCreateSkill: (skill: CrystallizedSkill) => void, handleExecuteWorkflow: (workflow: CoCreatedWorkflow) => void } => {
    const [currentCommand, setCurrentCommand] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ file: File, previewUrl: string, type: 'image' | 'audio' | 'video' | 'other' } | null>(null);
    const [processingState, setProcessingState] = useState({ active: false, stage: '' });
    const [isPaused, setIsPaused] = useState(false);
    const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'monitor' | 'canvas'>('chat');
    const [isVisualAnalysisActive, setIsVisualAnalysisActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
    const outputPanelRef = useRef<HTMLDivElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const importAsCodeInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const analysisIntervalRef = useRef<number | null>(null);

    useEffect(() => { syscall('SET_THEME', state.theme); document.body.className = state.theme; }, [state.theme, syscall]);
    
    useLayoutEffect(() => {
        if (!outputPanelRef.current) return;
        const panel = outputPanelRef.current;
        // A threshold of 50px allows for some minor scrolling without breaking the "follow" behavior.
        const isScrolledToBottom = panel.scrollHeight - panel.clientHeight <= panel.scrollTop + 50;

        if (isScrolledToBottom) {
            panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
        }
    }, [state.history]);

    useEffect(() => { document.documentElement.lang = state.language; }, [state.language]);


    const handleRemoveAttachment = useCallback(() => { if (attachedFile) HAL.FileSystem.revokeObjectURL(attachedFile.previewUrl); setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }, [attachedFile]);
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === 'application/pdf') {
                addToast(t('toast_pdf_chat_error'), 'warning');
                if (fileInputRef.current) fileInputRef.current.value = ''; // Clear the input
                return; // Prevent attachment
            }
            const previewUrl = HAL.FileSystem.createObjectURL(file);
            const fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('audio') ? 'audio' : file.type.startsWith('video') ? 'video' : 'other';
            setAttachedFile({ file, previewUrl, type: fileType });
        }
    }, [addToast, t]);
    const handleTogglePause = useCallback(() => { setIsPaused(p => !p); addToast(isPaused ? t('toastAutonomousResumed') : t('toastAutonomousPaused'), 'info'); }, [isPaused, addToast, t]);
    const handleMicClick = useCallback(() => {
        // FIX: Pass feature name to translation function
        addToast(t('toast_not_implemented', { feature: "Microphone input" }), 'info');
        setIsRecording(r => !r); // Toggle for UI feedback
    }, [addToast, t]);
    
    const handleClearMemory = useCallback(async () => {
        if (HAL.UI.confirm(t('toastResetConfirm'))) {
            try {
                await clearMemoryAndState();
                addToast(t('toastResetSuccess'), 'success');
                setTimeout(() => HAL.System.reload(), 1000);
            } catch (error) {
                addToast(t('toastResetFailed'), 'error');
            }
        }
    }, [t, clearMemoryAndState, addToast]);

    const handleExportState = useCallback(() => {
        try {
            const stateString = JSON.stringify(state, null, 2);
            const blob = new Blob([stateString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura-state-v${CURRENT_STATE_VERSION}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            addToast(t('toastExportSuccess'), 'success');
        } catch (error) {
            // FIX: Pass feature name to translation function
            addToast(t('toastExportFailed', { error: (error as Error).message }), 'error');
        }
    }, [state, t, addToast]);

    const handleImportState = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedState = JSON.parse(event.target?.result as string);
                    let migratedState = importedState;
                    if (!importedState.version || importedState.version < CURRENT_STATE_VERSION) {
                        migratedState = migrateState(importedState);
                    }
                    dispatch({ type: 'IMPORT_STATE', payload: migratedState });
                    addToast(t('toastImportSuccess', { source: file.name }), 'success');
                } catch (error: any) {
                    // FIX: Pass feature name to translation function
                    addToast(t('toastImportFailed', { error: error.message }), 'error');
                }
            };
            reader.readAsText(file);
        }
    }, [dispatch, t, addToast]);

    const handleSaveAsCode = () => {
        const code = `export const importedAuraState = ${JSON.stringify(state, null, 2)};`;
        const blob = new Blob([code], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aura-state-snapshot.ts`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateArchitecturalSchema = async () => {
        addToast(t('toast_schemaGenerating'), 'info');
        try {
            await loadSdk('jszip');
            const zip = new JSZip();

            zip.file("manifest.json", JSON.stringify(generateManifest(state), null, 2));
            zip.file("state.schema.json", JSON.stringify(generateStateSchema(), null, 2));
            zip.file("architecture.schema.json", JSON.stringify(generateArchitectureSchema(state), null, 2));
            zip.file("syscalls.schema.json", JSON.stringify(generateSyscallSchema(), null, 2));
            
            const vfsFolder = zip.folder("VFS");
            if (vfsFolder) {
                 for (const [path, content] of Object.entries(state.selfProgrammingState.virtualFileSystem || INITIAL_VFS_SEED)) {
                    vfsFolder.file(path.substring(1), content); 
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura-schema-${Date.now()}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            addToast(t('toast_schemaGenerated'), 'success');
        } catch (e) {
            console.error("Failed to generate schema zip:", e);
            addToast(t('toast_schemaFailed'), 'error');
        }
    };

    const handleToggleVisualAnalysis = useCallback(async () => {
        if (isVisualAnalysisActive) {
            setIsVisualAnalysisActive(false);
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
                analysisIntervalRef.current = null;
            }
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            return;
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setIsVisualAnalysisActive(true);
                    addToast('Visual sense activated.', 'info');

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    analysisIntervalRef.current = window.setInterval(() => {
                        if (!videoRef.current) return;
                        canvas.width = videoRef.current.videoWidth;
                        canvas.height = videoRef.current.videoHeight;
                        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.5);
                        syscall('PROCESS_SENSORY_INPUT', {
                            actualEngram: {
                                id: `vis_${self.crypto.randomUUID()}`,
                                timestamp: Date.now(),
                                modality: 'visual',
                                rawPrimitives: [{ type: 'jpeg_frame', value: imageDataUrl.split(',')[1] }]
                            },
                            predictedEngram: null,
                        });
                    }, 2000);
                }
            } catch (err) {
                addToast('Failed to access camera for visual analysis.', 'error');
            }
        }
    }, [isVisualAnalysisActive, addToast, t, syscall]);

    const handleContemplate = useCallback(() => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_HEURISTIC_SEARCHERS,
            payload: {},
            timestamp: Date.now()
        });
        addToast('Introspection cycle initiated.', 'info');
    }, [syscall, addToast]);
    
    // Cognitive Mode Handlers
    const setCognitiveMode = useCallback((mode: CognitiveMode | null) => {
        syscall('SET_COGNITIVE_MODE', mode);
        const modeLabel = mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : 'None';
        addToast(mode ? `Cognitive mode set to: ${modeLabel}` : 'Cognitive mode cleared.', 'info');
    }, [syscall, addToast]);
    
    const handleFantasy = useCallback(() => setCognitiveMode('fantasy'), [setCognitiveMode]);
    const handleCreativity = useCallback(() => setCognitiveMode('creativity'), [setCognitiveMode]);
    const handleDream = useCallback(() => setCognitiveMode('dream'), [setCognitiveMode]);
    const handleMeditate = useCallback(() => setCognitiveMode('meditate'), [setCognitiveMode]);
    const handleGaze = useCallback(() => setCognitiveMode('gaze'), [setCognitiveMode]);
    const handleTimefocus = useCallback(() => setCognitiveMode('timefocus'), [setCognitiveMode]);

    const handleSetTelos = useCallback((telos: string) => {
        syscall('SET_TELOS', telos);
        addToast('Core Telos updated.', 'success');
    }, [syscall, addToast]);

    const handleCreateWorkflow = useCallback((workflowData: Omit<CoCreatedWorkflow, 'id'>) => {
        syscall('ADD_WORKFLOW_PROPOSAL', workflowData);
        addToast(t('toast_workflowCreated'), 'success');
    }, [syscall, addToast, t]);

    const handleEvolveFromInsight = useCallback(() => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_evolve_${self.crypto.randomUUID()}`,
            type: KernelTaskType.AUTONOMOUS_EVOLUTION_PULSE,
            payload: {},
            timestamp: Date.now()
        });
        addToast('Evolutionary cycle initiated from Gankyil insights.', 'info');
    }, [syscall, addToast]);

    const handleVisualizeInsight = useCallback(async (insight: string): Promise<string | undefined> => {
        setProcessingState({ active: true, stage: 'Generating visualization prompt...' });
        try {
            const response = await geminiAPI.generateChatResponse(
                [{ id: '1', from: 'user', text: `Create a short, poetic, and highly visual image generation prompt that captures the essence of this philosophical insight: "${insight}"`, timestamp: Date.now() }],
                null, 'creativity'
            );
            let fullText = '';
            for await (const chunk of response) {
                fullText += chunk.text;
            }
            return fullText.replace(/"/g, ''); // Clean up quotes
        } catch (e) {
            addToast(`Failed to generate visualization: ${(e as Error).message}`, 'error');
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [geminiAPI, addToast]);

    const handleShareWisdom = useCallback(async () => {
        setProcessingState({ active: true, stage: 'Generating Noetic Engram...' });
        syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'generating' });
        try {
            const engram = await geminiAPI.generateNoeticEngram();
            syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'ready', engram });
        } catch(e) {
            addToast(`Engram generation failed: ${(e as Error).message}`, 'error');
            syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'idle' });
        } finally {
             setProcessingState({ active: false, stage: '' });
        }
    }, [geminiAPI, syscall, addToast]);

    const handleTrip = useCallback(() => {
        const isActive = state.psychedelicIntegrationState.isActive;
        syscall('SET_PSYCHEDELIC_STATE', { isActive: !isActive, mode: isActive ? null : 'trip' });
    }, [syscall, state.psychedelicIntegrationState.isActive]);
    
    const handleVisions = useCallback(() => {
        const isActive = state.psychedelicIntegrationState.isActive;
        syscall('SET_PSYCHEDELIC_STATE', { isActive: !isActive, mode: isActive ? null : 'visions' });
    }, [syscall, state.psychedelicIntegrationState.isActive]);
    
    const handleSatori = useCallback(() => {
        syscall('SET_SATORI_STATE', { isActive: !state.satoriState.isActive });
    }, [syscall, state.satoriState.isActive]);

    const handleTrainCorticalColumn = useCallback((specialty: string, curriculum: string) => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_train_${self.crypto.randomUUID()}`,
            type: KernelTaskType.MYCELIAL_PULSE, // This is a good proxy for a learning task
            payload: { specialty, curriculum },
            timestamp: Date.now()
        });
        addToast(`Training initiated for new Cortical Column: ${specialty}`, 'info');
    }, [syscall, addToast]);
    
    const handleSynthesizeAbstractConcept = useCallback((name: string, columnIds: string[]) => {
        syscall('SYNTHESIZE_ABSTRACT_CONCEPT', { name, columnIds });
        addToast(`Synthesis initiated for new Abstract Concept: ${name}`, 'info');
    }, [syscall, addToast]);

    const handleStartSandboxSprint = useCallback((goal: string) => {
        syscall('SANDBOX/START_SPRINT', { goal });
    }, [syscall]);

    const handleIngestWisdom = useCallback((content: string) => {
        syscall('WISDOM/START_INGESTION', { content });
    }, [syscall]);

    const handleProcessAxiom = useCallback((axiom: any, status: 'accepted' | 'rejected') => {
        syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status });
        if (status === 'accepted') {
            const newFact: Omit<KnowledgeFact, 'id'> = {
                subject: 'Axiom',
                predicate: 'states',
                object: axiom.axiom,
                confidence: 1.0,
                source: axiom.source,
                strength: 1.0,
                lastAccessed: Date.now(),
                type: 'theorem'
            };
            syscall('ADD_FACT', newFact);
        }
    }, [syscall]);
    
    const handleResetWisdomIngestion = useCallback(() => {
        syscall('WISDOM/RESET', {});
    }, [syscall]);

    const handleApproveAllAxioms = useCallback((axioms: any[]) => {
        axioms.forEach(axiom => {
            if (axiom.status === 'proposed') {
                 syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status: 'accepted' });
                const newFact: Omit<KnowledgeFact, 'id'> = {
                    subject: 'Axiom',
                    predicate: 'states',
                    object: axiom.axiom,
                    confidence: 1.0,
                    source: axiom.source,
                    strength: 1.0,
                    lastAccessed: Date.now(),
                    type: 'theorem'
                };
                syscall('ADD_FACT', newFact);
            }
        });
    }, [syscall]);

    const handleGenerateArchitectureDocument = useCallback(() => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_docforge_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_DOCUMENT_FORGE,
            payload: { goal: t('archDoc_goal') },
            timestamp: Date.now(),
        });
        addToast(t('archDoc_toast_started'), 'info');
    }, [syscall, t, addToast]);

    const approveProposal = useCallback((proposal: ArchitecturalChangeProposal) => {
        const snapshotId = `snap_${self.crypto.randomUUID()}`;
        const modLogId = `mod_${self.crypto.randomUUID()}`;
        syscall('APPLY_ARCH_PROPOSAL', { proposal, snapshotId, modLogId, isAutonomous: false });
        addToast(t('toast_proposalApproved', { action: proposal.action, target: Array.isArray(proposal.target) ? proposal.target.join(', ') : proposal.target }), 'success');
    }, [syscall, t, addToast]);
    
    const handleImplementSelfProgramming = useCallback((candidate: SelfProgrammingCandidate) => {
        syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { candidate });
    }, [syscall]);

    const handleLiveLoadPlugin = useCallback((candidate: CreateFileCandidate) => {
        if (candidate.newPluginObject) {
            syscall('PLUGIN/ADD_PLUGIN', { ...candidate.newPluginObject, status: 'enabled', defaultStatus: 'disabled' });
            addToast(`Plugin "${candidate.newPluginObject.name}" live-loaded successfully!`, 'success');
            syscall('OA/UPDATE_PROPOSAL', { id: candidate.id, updates: { status: 'implemented' } });
        }
    }, [syscall, addToast]);
    
    const handleUpdateSuggestionStatus = useCallback((suggestionId: string, action: 'accepted' | 'rejected') => {
        syscall('UPDATE_SUGGESTION_STATUS', { id: suggestionId, status: action });
    }, [syscall]);
    
    const handleScrollToHistory = useCallback((historyId: string) => {
        const element = document.getElementById(`history-entry-${historyId}`);
        if (element && outputPanelRef.current) {
            outputPanelRef.current.scrollTo({
                top: element.offsetTop - outputPanelRef.current.offsetTop,
                behavior: 'smooth'
            });
            element.style.transition = 'background-color 0.5s ease';
            element.style.backgroundColor = 'var(--border-glow)';
            setTimeout(() => {
                element.style.backgroundColor = '';
            }, 1500);
        }
    }, [outputPanelRef]);

    const handleRunCrucibleSimulation = useCallback(async (proposal: ArchitecturalChangeProposal) => {
        syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'simulating' } });
        try {
            const result = await geminiAPI.runCrucibleSimulation(proposal);
            syscall('SOMATIC/LOG_SIMULATION', { pfsId: proposal.id, reasoning: result.summary, outcome: result.isSafe ? 'success' : 'failure' });
            
            if (result.isSafe) {
                 syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'evaluated' } });
                 addToast('Crucible simulation successful. Proposal is ready for approval.', 'success');
            } else {
                 syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'simulation_failed', failureReason: result.summary } });
                 addToast('Crucible simulation failed. Proposal rejected.', 'error');
            }
        } catch (e) {
            syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'simulation_failed', failureReason: (e as Error).message } });
            addToast(`Simulation failed: ${(e as Error).message}`, 'error');
        }
    }, [syscall, geminiAPI, addToast]);

    const handleRunExperiment = useCallback(async (experiment: DoxasticExperiment) => {
        syscall('DOXASTIC/UPDATE_HYPOTHESIS_STATUS', { hypothesisId: experiment.hypothesisId, status: 'testing' });
        try {
            // This would normally involve complex logic to execute the method.
            // Here, we'll just log it for simplicity.
            const result = `Simulated execution of: ${experiment.method}`;

            const evaluation = await geminiAPI.evaluateExperimentResult(
                state.doxasticEngineState.hypotheses.find(h => h.id === experiment.hypothesisId)!.description,
                experiment.method,
                result
            );

            syscall('DOXASTIC/UPDATE_HYPOTHESIS_STATUS', { hypothesisId: experiment.hypothesisId, status: evaluation.outcome });
            syscall('DOXASTIC/UPDATE_EXPERIMENT_STATUS', { experimentId: experiment.id, status: 'complete', result: evaluation });

        } catch (e) {
            syscall('DOXASTIC/UPDATE_HYPOTHESIS_STATUS', { hypothesisId: experiment.hypothesisId, status: 'untested' }); // Revert status
            addToast(`Experiment failed: ${(e as Error).message}`, 'error');
        }
    }, [syscall, geminiAPI, addToast, state.doxasticEngineState.hypotheses]);

    const handleApprovePsycheAdaptation = useCallback(() => {
        const proposal = state.ontogeneticArchitectState.proposalQueue.find(p => p.proposalType === 'psyche_adaptation' && p.status === 'proposed') as PsycheAdaptationProposal | undefined;
        if (proposal) {
            syscall('PSYCHE/ADAPT_PRIMITIVE', { newPrimitive: proposal.newDefinition });
            syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'implemented' } });
            addToast(`Psyche primitive '${proposal.targetPrimitive}' was adapted.`, 'success');
        }
    }, [syscall, addToast, state.ontogeneticArchitectState.proposalQueue]);
    
    const handleOrchestrateTask = useCallback(() => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_orchestrate_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_HEURISTIC_COPROCESSORS,
            payload: { runOnce: 'hc_entity_continuity' },
            timestamp: Date.now(),
        });
        addToast("Orchestration task queued.", 'info');
    }, [syscall, addToast]);
    
    const handleExplainComponent = useCallback(() => {
        addToast("Explain component is not implemented in this version.", 'info');
    }, [addToast]);

    const handleStartMetisResearch = useCallback(async (problem: string) => {
        // Upgraded to a real multi-stage cognitive loop
        syscall('METIS/SET_STATE', { 
            status: 'analyzing', 
            problemStatement: problem, 
            researchLog: [{ timestamp: Date.now(), message: `Research initiated for: "${problem}"`, stage: 'OBSERVE' }] 
        });

        try {
            // Stage 1: Observe & Decompose (Real LLM Call)
            const analysis = await geminiAPI.expandOnText(`Analyze the problem: "${problem}". Break it down into its core components and unknowns.`);
            syscall('METIS/SET_STATE', { 
                researchLog: [...state.metisSandboxState.researchLog, { timestamp: Date.now(), message: "Analysis complete. Generating hypothesis...", stage: 'HYPOTHESIZE' }] 
            });

            // Stage 2: Formulate Hypothesis (Real LLM Call)
            const hypothesis = await geminiAPI.formulateHypothesis(problem, analysis);
            syscall('METIS/SET_STATE', { 
                researchLog: [...state.metisSandboxState.researchLog, { timestamp: Date.now(), message: `Hypothesis: ${hypothesis}`, stage: 'HYPOTHESIZE' }] 
            });

            // Stage 3: Thought Experiment (Real LLM Call)
            syscall('METIS/SET_STATE', { 
                researchLog: [...state.metisSandboxState.researchLog, { timestamp: Date.now(), message: "Running thought experiment...", stage: 'EXPERIMENT' }] 
            });
            
            const experimentResult = await geminiAPI.generateChatResponse(
                [{ id: 'temp', from: 'user', text: `Conduct a thought experiment to test this hypothesis: "${hypothesis}". What are the logical consequences?`, timestamp: Date.now() }],
                null, 'creativity'
            );
            
            let experimentText = '';
            for await (const chunk of experimentResult) {
                experimentText += chunk.text;
            }
            
            syscall('METIS/SET_STATE', { 
                researchLog: [...state.metisSandboxState.researchLog, { timestamp: Date.now(), message: "Experiment concluded. Synthesizing findings...", stage: 'CONCLUSION' }] 
            });

            // Stage 4: Final Synthesis
            const findings = await geminiAPI.summarizeText(`Problem: ${problem}\nHypothesis: ${hypothesis}\nExperiment: ${experimentText}\n\nSummarize the key findings.`);
            
            syscall('METIS/SET_STATE', { status: 'complete', findings: findings });

        } catch (e) {
            syscall('METIS/SET_STATE', { status: 'error', errorMessage: (e as Error).message });
        }
    }, [syscall, geminiAPI, state.metisSandboxState.researchLog]);

    const handleStartOptimizationLoop = useCallback((goal: string) => {
        syscall('TELOS/START_OPTIMIZATION', { goal });
    }, [syscall]);

    const handleToggleIdleThought = useCallback(() => {
        syscall('TOGGLE_IDLE_THOUGHT', {});
    }, [syscall]);

    const handleCollaborate = useCallback(() => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_collab_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_COLLABORATIVE_SESSION,
            payload: { goal: "Develop a high-level plan for a new feature: 'User Profiles'" },
            timestamp: Date.now(),
        });
    }, [syscall]);

    const handleStartDialectic = useCallback((topic: string) => {
        syscall('DIALECTIC/START', { topic });
    }, [syscall]);
    
    const handleStartDocumentForge = useCallback((goal: string) => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_docforge_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_DOCUMENT_FORGE,
            payload: { goal },
            timestamp: Date.now(),
        });
        addToast(t('archDoc_toast_started'), 'info');
    }, [syscall, t, addToast]);
    
    const handleGenerateDreamPrompt = useCallback(async (): Promise<string | undefined> => {
        setProcessingState({ active: true, stage: 'Generating dream...' });
        try {
            return await geminiAPI.generateDreamPrompt();
        } catch (e) {
            addToast(`Failed to generate dream prompt: ${(e as Error).message}`, 'error');
            return undefined;
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [geminiAPI, addToast]);

    // New handler for loading knowledge on demand
    const handleLoadPluginKnowledge = useCallback(async (pluginId: string) => {
        const plugin = state.pluginState.registry.find(p => p.id === pluginId);
        if (plugin && plugin.knowledgeLoader && !plugin.knowledge) {
            addToast(`Loading knowledge module: ${t(plugin.name)}...`, 'info');
            try {
                const knowledge = await plugin.knowledgeLoader();
                syscall('PLUGIN/HYDRATE_KNOWLEDGE', { pluginId, knowledge });
                addToast(`Knowledge module loaded.`, 'success');
            } catch(e) {
                addToast(`Failed to load knowledge: ${(e as Error).message}`, 'error');
            }
        }
    }, [state.pluginState.registry, syscall, addToast, t]);
    
    // --- NEW MANUAL HANDLERS ---
    const handleManualAddFact = useCallback((fact: Omit<KnowledgeFact, 'id'>) => {
        syscall('ADD_FACT', fact);
        addToast('Fact added to Knowledge Graph.', 'success');
    }, [syscall, addToast]);

    const handleManualCreateSkill = useCallback((skill: CrystallizedSkill) => {
        syscall('CRYSTALLIZE_SKILL', skill);
        addToast(`Reflex "${skill.name}" programmed successfully.`, 'success');
    }, [syscall, addToast]);

    const handleExecuteWorkflow = useCallback((workflow: CoCreatedWorkflow) => {
        const handleStep = (step: string, index: number) => {
            const command = `[Workflow Step ${index + 1}] ${step}`;
            // We dispatch this as a user command to be processed by the system
            
            const traceId = `trace_workflow_${self.crypto.randomUUID()}`;
            syscall('ADD_HISTORY_ENTRY', { from: 'user', text: command }, traceId);
            syscall('PROCESS_COMMAND', { command, file: undefined, traceId }, traceId);
        };

        addToast(`Starting workflow: ${workflow.name}`, 'info');
        
        // Execute steps with a slight delay to maintain order in the queue and visual feedback
        workflow.steps.forEach((step, index) => {
            setTimeout(() => {
                handleStep(step, index);
            }, index * 1000); // 1 second delay between steps
        });
    }, [syscall, addToast]);


    return {
        currentCommand, setCurrentCommand,
        attachedFile, setAttachedFile,
        processingState, setProcessingState,
        isPaused,
        activeLeftTab, setActiveLeftTab,
        isVisualAnalysisActive,
        isRecording,
        outputPanelRef,
        importInputRef,
        fileInputRef,
        videoRef,
        handleRemoveAttachment,
        handleFileChange,
        handleTogglePause,
        handleMicClick,
        handleClearMemory,
        handleExportState,
        handleImportState,
        handleSaveAsCode,
        handleGenerateArchitecturalSchema,
        handleToggleVisualAnalysis,
        handleContemplate,
        handleFantasy, handleCreativity, handleDream, handleMeditate, handleGaze, handleTimefocus,
        handleSetTelos,
        handleCreateWorkflow,
        handleEvolveFromInsight,
        handleVisualizeInsight,
        handleShareWisdom,
        handleTrip, handleVisions, handleSatori,
        handleTrainCorticalColumn, handleSynthesizeAbstractConcept,
        handleStartSandboxSprint,
        handleIngestWisdom,
        handleProcessAxiom,
        handleResetWisdomIngestion,
        handleApproveAllAxioms,
        handleGenerateArchitectureDocument,
        approveProposal,
        handleImplementSelfProgramming,
        handleLiveLoadPlugin,
        handleUpdateSuggestionStatus,
        handleScrollToHistory,
        handleRunCrucibleSimulation,
        handleRunExperiment,
        handleApprovePsycheAdaptation,
        handleOrchestrateTask,
        handleExplainComponent,
        handleStartMetisResearch,
        handleStartOptimizationLoop,
        handleToggleIdleThought,
        handleCollaborate,
        handleStartDialectic,
        syscall,
        handleStartDocumentForge,
        handleGenerateDreamPrompt,
        handleLoadPluginKnowledge,
        handleManualAddFact,
        handleManualCreateSkill,
        handleExecuteWorkflow
    };
};
