
// state/reducers/memory.ts
import { AuraState, Action, MDNASpace, ConceptConnections, KnowledgeFact, Episode, CommandLogEntry } from '../../types.ts';
import { createRandomVector, cosineSimilarity } from '../../utils.ts';
import { MDNA_DIMENSIONS, HEBBIAN_LEARNING_RATE, CONNECTION_DECAY_RATE, PRUNING_THRESHOLD } from '../../constants.ts';
import { ECAN } from '../../core/ecan.ts'; // Import ECAN logic

export const memoryReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'MEMORY/ECAN_TICK': {
            // 1. Apply Rent to Knowledge Graph
            let newKnowledgeGraph = state.knowledgeGraph.map(fact => ECAN.applyRent(fact));
            
            // 2. Apply Rent to Episodic Memory
            let newEpisodes = state.episodicMemoryState.episodes.map(ep => ECAN.applyRent(ep));

            // 3. (Optional) Forgetting Logic
            // In a strict implementation, we would remove items. 
            // For now, let's keep them but they will just have 0 STI (low attention).
            // If we wanted to actually delete:
            // newKnowledgeGraph = newKnowledgeGraph.filter(f => !ECAN.shouldForget(f));
            
            return {
                knowledgeGraph: newKnowledgeGraph,
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: newEpisodes,
                }
            };
        }

        case 'HOMEOSTASIS/REGULATE': {
            const { reason } = args;
            const newLog: CommandLogEntry = { id: self.crypto.randomUUID(), timestamp: Date.now(), text: `Homeostatic regulation triggered: ${reason}. Pruning memory.`, type: 'info' };

            const factsToKeep = state.knowledgeGraph
                .sort((a, b) => b.strength - a.strength)
                .slice(0, Math.floor(state.knowledgeGraph.length * 0.9)); // Keep 90%

            const episodesToKeep = state.episodicMemoryState.episodes
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, Math.floor(state.episodicMemoryState.episodes.length * 0.9)); // Keep 90%

            return {
                commandLog: [newLog, ...state.commandLog].slice(0, 50),
                workingMemory: [], // Clear working memory
                knowledgeGraph: factsToKeep,
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: episodesToKeep,
                }
            };
        }

        case 'MEMORY/SYNAPTIC_PROBE': {
            const concepts = Object.keys(state.mdnaSpace);
            if (concepts.length < 10) return {}; // Not enough concepts to make interesting connections

            const MAX_ATTEMPTS = 10;
            for (let i = 0; i < MAX_ATTEMPTS; i++) {
                const indexA = Math.floor(Math.random() * concepts.length);
                let indexB = Math.floor(Math.random() * concepts.length);
                if (indexA === indexB) continue;

                const conceptA = concepts[indexA];
                const conceptB = concepts[indexB];
                
                const linkKey = [conceptA, conceptB].sort().join('--');
                if (state.conceptConnections[linkKey]) continue; // Link already exists

                const vectorA = state.mdnaSpace[conceptA];
                const vectorB = state.mdnaSpace[conceptB];
                
                if (vectorA && vectorB) {
                    const similarity = cosineSimilarity(vectorA, vectorB);
                    if (similarity < 0.2) { // Only connect distant concepts
                        const newConnection = { weight: 0.01 }; // Very weak initial connection
                        
                        return {
                            conceptConnections: {
                                ...state.conceptConnections,
                                [linkKey]: newConnection,
                            },
                        };
                    }
                }
            }
            return {}; // Failed to find a suitable pair after several attempts
        }
        
        // --- Variant J: Neuro-Dynamic Memory ---
        case 'MEMORY/REINFORCE': {
            const { memoryType, memoryId } = args;
            // Access Boost via ECAN
            
            if (memoryType === 'fact') {
                return {
                    knowledgeGraph: state.knowledgeGraph.map(fact => 
                        fact.id === memoryId 
                        ? ECAN.boostAttention({ ...fact, lastAccessed: Date.now() })
                        : fact
                    )
                };
            }
            if (memoryType === 'episode') {
                return {
                    episodicMemoryState: {
                        ...state.episodicMemoryState,
                        episodes: state.episodicMemoryState.episodes.map(ep => 
                            ep.id === memoryId 
                            ? ECAN.boostAttention({ ...ep, lastAccessed: Date.now() })
                            : ep
                        )
                    }
                };
            }
            return {};
        }

        case 'MEMORY/DECAY': {
            // Legacy decay (replaced mostly by ECAN_TICK, but kept for compatibility if called directly)
            const { memoryIdsToDecay } = args;
            const decayFactor = 0.99; 

            const decayedKg = state.knowledgeGraph.map(fact => 
                memoryIdsToDecay.kg.includes(fact.id) 
                ? { ...fact, strength: fact.strength * decayFactor } 
                : fact
            );

            const decayedEpisodes = state.episodicMemoryState.episodes.map(ep => 
                memoryIdsToDecay.episodes.includes(ep.id) 
                ? { ...ep, strength: ep.strength * decayFactor } 
                : ep
            );

            return {
                knowledgeGraph: decayedKg,
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: decayedEpisodes,
                }
            };
        }

        // --- Variant L: Hierarchical Chronicler ---
        case 'CHRONICLE/UPDATE': {
            return {
                chronicleState: {
                    ...state.chronicleState,
                    ...args,
                    lastChronicleUpdate: Date.now(),
                }
            };
        }

        // --- Original Memory Reducer Logic ---
        case 'MEMORY/INITIALIZE_MDNA_SPACE': {
            const concepts = new Set<string>();
            state.knowledgeGraph.forEach(fact => {
                concepts.add(fact.subject);
                concepts.add(fact.object);
            });

            const newMdnaSpace: MDNASpace = {};
            concepts.forEach(concept => {
                newMdnaSpace[concept] = createRandomVector(MDNA_DIMENSIONS);
            });

            return { mdnaSpace: newMdnaSpace };
        }

        case 'MEMORY/ADD_CONCEPT_VECTOR': {
            const { name, vector } = args;
            if (state.mdnaSpace[name]) return {}; // Avoid overwriting
            return {
                mdnaSpace: {
                    ...state.mdnaSpace,
                    [name]: vector,
                }
            };
        }

        case 'MEMORY/HEBBIAN_LEARN': {
            const activatedConcepts = [...new Set(args.concepts as string[])]; // Deduplicate
            if (activatedConcepts.length < 2) return {};

            const newConnections: ConceptConnections = { ...state.conceptConnections };
            let newMdnaSpace: MDNASpace = { ...state.mdnaSpace };
            
            // Ensure all concepts exist in mdnaSpace
            activatedConcepts.forEach(concept => {
                if (!newMdnaSpace[concept]) {
                    newMdnaSpace[concept] = createRandomVector(MDNA_DIMENSIONS);
                }
            });

            // Strengthen connections between co-activated concepts
            for (let i = 0; i < activatedConcepts.length; i++) {
                for (let j = i + 1; j < activatedConcepts.length; j++) {
                    const conceptA = activatedConcepts[i];
                    const conceptB = activatedConcepts[j];

                    const key = [conceptA, conceptB].sort().join('--');
                    const connection = newConnections[key] || { weight: 0 };
                    
                    const newWeight = connection.weight + HEBBIAN_LEARNING_RATE * (1 - connection.weight);
                    newConnections[key] = { ...connection, weight: Math.min(1, newWeight) };
                }
            }
            
            // NOTE: Ideally we would also find facts related to these concepts and boost their LTI here via ECAN.
            // But for now, we stick to the concept vector space update.
            
            return { conceptConnections: newConnections, mdnaSpace: newMdnaSpace };
        }

        case 'ADD_FACT': {
            // Initialize with ECAN attention values
            const attention = ECAN.initialize();
            const newFact: KnowledgeFact = { 
                ...args, 
                id: self.crypto.randomUUID(), 
                strength: 1.0, 
                lastAccessed: Date.now(),
                ...attention 
            };
            let newMdnaSpace = { ...state.mdnaSpace };
            if (!newMdnaSpace[newFact.subject]) {
                newMdnaSpace[newFact.subject] = createRandomVector(MDNA_DIMENSIONS);
            }
            if (!newMdnaSpace[newFact.object]) {
                newMdnaSpace[newFact.object] = createRandomVector(MDNA_DIMENSIONS);
            }
            return { 
                knowledgeGraph: [...state.knowledgeGraph, newFact],
                mdnaSpace: newMdnaSpace
            };
        }
        case 'ADD_FACTS_BATCH': {
            let newMdnaSpace = { ...state.mdnaSpace };
            const attention = ECAN.initialize();
            const newFacts = args.map((fact: any) => {
                 if (!newMdnaSpace[fact.subject]) {
                    newMdnaSpace[fact.subject] = createRandomVector(MDNA_DIMENSIONS);
                }
                if (!newMdnaSpace[fact.object]) {
                    newMdnaSpace[fact.object] = createRandomVector(MDNA_DIMENSIONS);
                }
                return {
                    ...fact,
                    id: self.crypto.randomUUID(),
                    source: 'llm_extraction',
                    strength: 1.0, 
                    lastAccessed: Date.now(),
                    ...attention
                }
            });
            return { 
                knowledgeGraph: [...state.knowledgeGraph, ...newFacts],
                mdnaSpace: newMdnaSpace
            };
        }
        case 'DELETE_FACT':
            return {
                knowledgeGraph: state.knowledgeGraph.filter(fact => fact.id !== args),
            };
        case 'ADD_TO_WORKING_MEMORY':
            return {
                workingMemory: [...state.workingMemory, args].slice(-10),
            };
        case 'REMOVE_FROM_WORKING_MEMORY':
            return {
                workingMemory: state.workingMemory.filter(item => item !== args),
            };
        case 'CLEAR_WORKING_MEMORY':
            return { workingMemory: [] };

        case 'ADD_EPISODE': {
            const attention = ECAN.initialize();
            const newEpisode: Episode = { 
                ...args, 
                id: `ep_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                strength: args.salience || 0.5, // Use salience as initial strength
                lastAccessed: Date.now(),
                ...attention
            };
            return {
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: [...state.episodicMemoryState.episodes, newEpisode].slice(-50) // Keep last 50 episodes
                }
            };
        }
        
        case 'MEMORY/STRENGTHEN_HYPHA_CONNECTION': {
            const { source, target } = args;
            const existingConnection = state.memoryNexus.hyphaeConnections.find(
                (h: any) => (h.source === source && h.target === target) || (h.source === target && h.target === source)
            );

            if (existingConnection) {
                const newWeight = existingConnection.weight * 0.9 + 0.1; // Reinforce existing path
                return {
                    memoryNexus: {
                        ...state.memoryNexus,
                        hyphaeConnections: state.memoryNexus.hyphaeConnections.map((h: any) =>
                            h.id === existingConnection.id ? { ...h, weight: Math.min(1, newWeight) } : h
                        ),
                    }
                };
            } else {
                const newConnection = {
                    id: `${source}-${target}-${self.crypto.randomUUID()}`,
                    source,
                    target,
                    weight: 0.1, // Initial connection strength
                };
                return {
                    memoryNexus: {
                        ...state.memoryNexus,
                        hyphaeConnections: [...state.memoryNexus.hyphaeConnections, newConnection],
                    }
                };
            }
        }

        case 'MEMORY/ADD_CRYSTALLIZED_FACT': {
             const attention = ECAN.initialize();
            const newFact: KnowledgeFact = { 
                ...args, 
                id: self.crypto.randomUUID(), 
                source: 'emergent_synthesis', 
                strength: 1.0, 
                lastAccessed: Date.now(),
                ...attention
            };
            return { knowledgeGraph: [...state.knowledgeGraph, newFact] };
        }
        
        case 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL': {
            const { facts } = args;
            if (!facts || !Array.isArray(facts)) return {};
            
            let newMdnaSpace = { ...state.mdnaSpace };
             const attention = ECAN.initialize();
            const newFacts = facts.map((fact: any) => {
                 if (!newMdnaSpace[fact.subject]) {
                    newMdnaSpace[fact.subject] = createRandomVector(MDNA_DIMENSIONS);
                }
                if (!newMdnaSpace[fact.object]) {
                    newMdnaSpace[fact.object] = createRandomVector(MDNA_DIMENSIONS);
                }
                return {
                    ...fact,
                    id: self.crypto.randomUUID(),
                    source: 'symbiotic_metamorphosis',
                    strength: 1.0,
                    lastAccessed: Date.now(),
                    ...attention
                }
            });
            
            return { 
                knowledgeGraph: [...state.knowledgeGraph, ...newFacts],
                mdnaSpace: newMdnaSpace
            };
        }

        case 'MEMORY/PRUNE_EPISODES': {
            const { ids } = args;
            const idsToPrune = new Set(ids);
            return {
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: state.episodicMemoryState.episodes.filter(e => !idsToPrune.has(e.id))
                }
            };
        }

        case 'MEMORY/MARK_EPISODE_PROCESSED': {
            const { episodeId } = args;
            return {
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: state.episodicMemoryState.episodes.map(e =>
                        e.id === episodeId ? { ...e, isConnectionProcessed: true } : e
                    ),
                }
            };
        }

        case 'MEMORY/UPDATE_EMBEDDING': {
            const { id, type, embedding } = args;
            
            if (type === 'fact') {
                return {
                    knowledgeGraph: state.knowledgeGraph.map(f => 
                        f.id === id ? { ...f, embedding } : f
                    )
                };
            } else if (type === 'episode') {
                return {
                     episodicMemoryState: {
                        ...state.episodicMemoryState,
                        episodes: state.episodicMemoryState.episodes.map(e => 
                            e.id === id ? { ...e, embedding } : e
                        )
                    }
                }
            }
            return {};
        }

        default:
            return {};
    }
};
