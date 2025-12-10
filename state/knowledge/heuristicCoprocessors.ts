// state/knowledge/heuristicCoprocessors.ts
// FIX: Imported the SyscallFn type to resolve a type error.
import { Plugin, AuraState, SyscallCall, HistoryEntry, GunaState, HeuristicCoprocessorImplementation, UseGeminiAPIResult, SyscallFn } from '../../types.ts';

// --- DATA: Serializable Plugin Definitions for State ---
export const heuristicCoprocessorPlugins: Plugin[] = [
    {
        id: 'hc_salience_filter',
        name: 'plugin_hc_salience_filter_name',
        description: 'plugin_hc_salience_filter_desc',
        type: 'HEURISTIC_COPROCESSOR',
        status: 'enabled',
        defaultStatus: 'enabled',
        heuristicCoprocessor: {
            cooldown: 2, // Run every 2 ticks if there's work to do
        },
    },
    {
        id: 'hc_entity_continuity',
        name: 'plugin_hc_entity_continuity_name',
        description: 'plugin_hc_entity_continuity_desc',
        type: 'HEURISTIC_COPROCESSOR',
        status: 'enabled',
        defaultStatus: 'enabled',
        heuristicCoprocessor: {
            cooldown: 10, // Run every 10 ticks
        },
    },
    {
        id: 'hc_heuristic_causal_linker',
        name: 'plugin_hc_heuristic_causal_linker_name',
        description: 'plugin_hc_heuristic_causal_linker_desc',
        type: 'HEURISTIC_COPROCESSOR',
        status: 'enabled',
        defaultStatus: 'enabled',
        heuristicCoprocessor: {
            cooldown: 15, // Run every 15 ticks
        },
    },
];


// --- BEHAVIOR: Runtime Implementations (with functions) ---
export const heuristicCoprocessorImplementations: HeuristicCoprocessorImplementation[] = [
    {
        id: 'hc_salience_filter',
        condition: (state: AuraState) => {
            // Check if there's any history entry that hasn't been processed for salience yet
            return state.history.some(entry => (entry.from === 'user' || entry.from === 'bot') && !entry.isSalienceProcessed);
        },
        action: (syscall: SyscallFn, state: AuraState) => {
            const unprocessedEntry = state.history.find(entry => (entry.from === 'user' || entry.from === 'bot') && !entry.isSalienceProcessed);
            if (!unprocessedEntry) return;

            let salience = 0.5; // Base salience
            let valence: 'positive' | 'negative' | 'neutral' = 'neutral';
            let reason = 'Standard interaction';

            // Heuristic 1: Emotional Resonance
            const sentiment = state.userModel.sentimentScore;
            if (sentiment > 0.5) {
                salience += 0.3;
                valence = 'positive';
                reason = 'High positive sentiment';
            } else if (sentiment < -0.5) {
                salience += 0.3;
                valence = 'negative';
                reason = 'High negative sentiment';
            }

            // Heuristic 2: Goal-Relevance
            const activeGoal = state.activeStrategicGoalId ? state.goalTree[state.activeStrategicGoalId] : null;
            if (activeGoal && unprocessedEntry.text && activeGoal.description && unprocessedEntry.text.includes(activeGoal.description.substring(0, 20))) {
                salience += 0.2;
                reason = 'Relevant to active goal';
            }

            // Heuristic 3: Explicit Instruction
            if (unprocessedEntry.text && unprocessedEntry.text.match(/\b(remember|note|important)\b/i)) {
                salience += 0.4;
                reason = 'User marked as important';
            }

            // Heuristic 4: Prediction Error (Surprise)
            if (state.worldModelState.predictionError.magnitude > 0.7) {
                salience += 0.25;
                reason = 'High prediction error occurred';
            }
            
            salience = Math.min(1, salience); // Clamp salience

            syscall('ADD_EPISODE', {
                title: `Interaction: ${unprocessedEntry.text?.substring(0, 30) || 'Untitled'}...`,
                summary: unprocessedEntry.text,
                keyTakeaway: reason,
                valence,
                salience,
            });
            
            syscall('HISTORY/MARK_SALIENCE_PROCESSED', { id: unprocessedEntry.id });
            // FIX: Add HEURISTIC_COPROCESSOR/LOG_ACTIVATION to SyscallCall
            syscall('HEURISTIC_COPROCESSOR/LOG_ACTIVATION', {
                coprocessorId: 'hc_salience_filter',
                message: `Processed entry ${unprocessedEntry.id.slice(0, 8)}. Salience: ${salience.toFixed(2)}`,
                cooldownEnds: state.kernelState.tick + 2,
            });
        },
    },
    {
        id: 'hc_entity_continuity',
        condition: (state: AuraState) => {
            // Check for recent history that hasn't been processed for entities
            return state.history.slice(-5).some(entry => !entry.isEntityProcessed);
        },
        // The action is async because it uses Gemini
        action: async (syscall: SyscallFn, state: AuraState, geminiAPI: UseGeminiAPIResult) => {
            const unprocessedEntries = state.history.slice(-5).filter(entry => (entry.from === 'user' || entry.from === 'bot') && entry.text && !entry.isEntityProcessed);
            if (unprocessedEntries.length === 0) return;

            const textToProcess = unprocessedEntries.map(e => `${e.from}: ${e.text}`).join('\n');
            
            try {
                // This is a mock response because the Gemini function is not implemented.
                // In a real scenario, this would be an actual API call.
                const entities: { name: string, type: string, description: string, fact: string }[] = await geminiAPI.extractAndResolveEntities(textToProcess);
                
                if (entities && entities.length > 0) {
                    for (const entity of entities) {
                        const nodeId = entity.name.toLowerCase().replace(/\s+/g, '_');
                        const existingNode = state.socialCognitionState.socialGraph[nodeId];
                        
                        if (existingNode) {
                            // FIX: Add SOCIAL/UPDATE_NODE to SyscallCall
                            syscall('SOCIAL/UPDATE_NODE', {
                                id: nodeId,
                                updates: {
                                    summary: entity.description,
                                    dossier: [entity.fact],
                                }
                            });
                        } else {
                            // FIX: Add SOCIAL/ADD_NODE to SyscallCall
                            syscall('SOCIAL/ADD_NODE', {
                                id: nodeId,
                                name: entity.name,
                                type: entity.type.toLowerCase(),
                                summary: entity.description,
                                dossier: [entity.fact],
                                relationships: [],
                            });
                        }
                    }
                }

                // Mark all processed entries
                for (const entry of unprocessedEntries) {
                    syscall('HISTORY/MARK_ENTITY_PROCESSED', { id: entry.id });
                }
                // FIX: Add HEURISTIC_COPROCESSOR/LOG_ACTIVATION to SyscallCall
                 syscall('HEURISTIC_COPROCESSOR/LOG_ACTIVATION', {
                    coprocessorId: 'hc_entity_continuity',
                    message: `Scanned ${unprocessedEntries.length} entries. Found ${entities?.length || 0} entities.`,
                    cooldownEnds: state.kernelState.tick + 10,
                });

            } catch (e) {
                console.error("EntityContinuityEngine Error:", e);
                // FIX: Add HEURISTIC_COPROCESSOR/LOG_ACTIVATION to SyscallCall
                 syscall('HEURISTIC_COPROCESSOR/LOG_ACTIVATION', {
                    coprocessorId: 'hc_entity_continuity',
                    message: `Error during entity extraction: ${(e as Error).message}`,
                    cooldownEnds: state.kernelState.tick + 10, // still set cooldown on error
                });
            }
        },
    },
    {
        id: 'hc_heuristic_causal_linker',
        condition: (state: AuraState) => {
            // Find at least two consecutive episodes that haven't been processed for connection linking
            const episodes = state.episodicMemoryState.episodes;
            for (let i = 0; i < episodes.length - 1; i++) {
                if (!episodes[i].isConnectionProcessed && !episodes[i + 1].isConnectionProcessed) {
                    return true;
                }
            }
            return false;
        },
        action: async (syscall: SyscallFn, state: AuraState, geminiAPI: UseGeminiAPIResult) => {
            const episodes = state.episodicMemoryState.episodes;
            const unprocessed = episodes.filter(e => !e.isConnectionProcessed).sort((a, b) => a.timestamp - b.timestamp);
            
            if (unprocessed.length < 2) return;

            const episode1 = unprocessed[0];
            const episode2 = unprocessed[1];

            syscall('SYNAPTIC_MATRIX/SET_ADAPTING', { isAdapting: true });
            
            try {
                const [entities1, entities2] = await Promise.all([
                    geminiAPI.extractAndResolveEntities(episode1.summary),
                    geminiAPI.extractAndResolveEntities(episode2.summary)
                ]);

                const concepts1 = entities1.map(e => e.name);
                const concepts2 = entities2.map(e => e.name);
                const allConcepts = [...new Set([...concepts1, ...concepts2])];

                if (allConcepts.length > 1) {
                    syscall('MEMORY/HEBBIAN_LEARN', { concepts: allConcepts });
                    syscall('HEURISTIC_COPROCESSOR/LOG_ACTIVATION', {
                        coprocessorId: 'hc_heuristic_causal_linker',
                        message: `Linked ${allConcepts.length} concepts between episodes.`,
                        cooldownEnds: state.kernelState.tick + 15,
                    });
                }
                
                // Mark as processed
                syscall('MEMORY/MARK_EPISODE_PROCESSED', { episodeId: episode1.id });
                syscall('MEMORY/MARK_EPISODE_PROCESSED', { episodeId: episode2.id });

            } catch(e) {
                console.error("HebbianCausalLinker Error:", e);
                syscall('HEURISTIC_COPROCESSOR/LOG_ACTIVATION', {
                    coprocessorId: 'hc_heuristic_causal_linker',
                    message: `Error during concept extraction: ${(e as Error).message}`,
                    cooldownEnds: state.kernelState.tick + 15,
                });
            } finally {
                syscall('SYNAPTIC_MATRIX/SET_ADAPTING', { isAdapting: false });
            }
        },
    },
];