
// state/reducers/architecture.ts
import { AuraState, Action, ArchitecturalChangeProposal, ModificationLogEntry, SelfProgrammingCandidate, SystemSnapshot, SynthesizedSkill, CreateFileCandidate, ModifyFileCandidate, PsycheProposal, AbstractConceptProposal, UnifiedProposal, PerformanceLogEntry, CognitivePrimitiveDefinition, DirectoryNode, VFSNode, CrystallizedSkill } from '../../types.ts';

export const architectureReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'VFS/SET_PATHS': {
            const { paths } = args;
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    vfsPaths: (paths || []).map((p: string) => p.startsWith('/') ? p : '/' + p),
                }
            };
        }

        case 'VFS/ADD_PATH': {
            const { path } = args;
            if (state.selfProgrammingState.vfsPaths.includes(path)) return {};
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    vfsPaths: [...state.selfProgrammingState.vfsPaths, path]
                }
            };
        }

        case 'VFS/DELETE_PATH': {
            const { path } = args;
            
            // We need to also remove it from the tree to keep state consistent
            const newTree: DirectoryNode = JSON.parse(JSON.stringify(state.selfProgrammingState.virtualFileSystem));
            const parts = path.split('/').filter(Boolean);
            const fileName = parts.pop();
            let current: any = newTree;
            
            // Navigate to parent directory
            for (const part of parts) {
                if (current.children && current.children[part]) {
                    current = current.children[part];
                } else {
                    // Path doesn't exist in tree, just return path update
                    current = null;
                    break;
                }
            }
            
            if (current && current.children && fileName) {
                delete current.children[fileName];
            }

            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    vfsPaths: state.selfProgrammingState.vfsPaths.filter(p => p !== path),
                    virtualFileSystem: newTree
                }
            };
        }
        
        case 'VFS/UPDATE_TREE': {
            const { path, hash, size } = args;
            
            // Deep clone the tree to mutate
            const newTree: DirectoryNode = JSON.parse(JSON.stringify(state.selfProgrammingState.virtualFileSystem));
            
            const parts = path.split('/').filter(Boolean);
            let current: DirectoryNode = newTree;
            
            // Ensure root exists
            if (!current.children) current.children = {};

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (i === parts.length - 1) {
                    // Create/Update File Node
                    current.children[part] = {
                        type: 'file',
                        hash: hash,
                        size: size
                    };
                } else {
                    // Traverse/Create Directory Node
                     if (!current.children[part] || current.children[part].type !== 'directory') {
                        current.children[part] = { type: 'directory', children: {} };
                    }
                    current = current.children[part] as DirectoryNode;
                }
            }

            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    virtualFileSystem: newTree,
                }
            };
        }
        
        // --- CRYSTALLIZATION LOGIC ---
        case 'CRYSTALLIZE_SKILL': {
             const skill = args as CrystallizedSkill;
             if (state.selfProgrammingState.skillLibrary[skill.id]) return {}; // No dupes

             return {
                 selfProgrammingState: {
                     ...state.selfProgrammingState,
                     skillLibrary: {
                         ...state.selfProgrammingState.skillLibrary,
                         [skill.id]: skill
                     }
                 }
             }
        }
        
        case 'EXECUTE_CRYSTALLIZED_SKILL': {
             const { skillId } = args;
             const skill = state.selfProgrammingState.skillLibrary[skillId];
             if (!skill) return {};
             
             return {
                 selfProgrammingState: {
                     ...state.selfProgrammingState,
                     skillLibrary: {
                         ...state.selfProgrammingState.skillLibrary,
                         [skillId]: {
                             ...skill,
                             usageCount: skill.usageCount + 1,
                             lastUsed: Date.now()
                         }
                     }
                 }
             }
        }

        case 'CRYSTALLIZER/DELETE_SKILL': {
             const { skillId } = args;
             const newLibrary = { ...state.selfProgrammingState.skillLibrary };
             delete newLibrary[skillId];

             return {
                 selfProgrammingState: {
                     ...state.selfProgrammingState,
                     skillLibrary: newLibrary
                 }
             }
        }
        // ------------------------------

        case 'APPLY_ARCH_PROPOSAL': {
            const { proposal, snapshotId, modLogId, isAutonomous } = args;
            const newSnapshot: SystemSnapshot = {
                id: snapshotId,
                timestamp: Date.now(),
                reason: `Pre-apply: ${proposal.action} on ${proposal.target}`,
                state: state,
            };

            const reasoningText = typeof proposal.reasoning === 'object'
                ? JSON.stringify(proposal.reasoning, null, 2)
                : String(proposal.reasoning);

            const newModLog: ModificationLogEntry = {
                id: modLogId,
                timestamp: Date.now(),
                description: `Applied proposal: ${reasoningText}`,
                gainType: 'ARCHITECTURE',
                validationStatus: 'validated',
                isAutonomous: isAutonomous,
            };

            const proposalExists = state.ontogeneticArchitectState.proposalQueue.some((p: UnifiedProposal) => p.id === proposal.id);
            let newProposalQueue = state.ontogeneticArchitectState.proposalQueue;

            if (proposalExists) {
                newProposalQueue = state.ontogeneticArchitectState.proposalQueue.map((p: UnifiedProposal) =>
                    p.id === proposal.id ? { ...p, status: 'implemented' } as UnifiedProposal : p
                );
            } else {
                newProposalQueue = [{ ...proposal, status: 'implemented' }, ...state.ontogeneticArchitectState.proposalQueue];
            }

            return {
                systemSnapshots: [...state.systemSnapshots, newSnapshot].slice(-10),
                modificationLog: [newModLog, ...state.modificationLog].slice(-50),
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: newProposalQueue,
                },
                kernelState: {
                    ...state.kernelState,
                    rebootPending: true,
                }
            };
        }

        case 'INGEST_CODE_CHANGE': {
            const { filePath, code } = args;
             return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                     vfsWriteRequest: {
                        type: 'WRITE',
                        files: [{ path: filePath, content: code }],
                        reboot: true,
                    },
                },
                 modificationLog: [{
                    id: self.crypto.randomUUID(),
                    timestamp: Date.now(),
                    description: `Manual code ingestion for: ${filePath}`,
                    gainType: 'INNOVATION' as const,
                    validationStatus: 'validated' as const,
                    isAutonomous: false,
                 }, ...state.modificationLog].slice(-50),
            };
        }
        
        case 'TOGGLE_COGNITIVE_FORGE_PAUSE': {
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    isTuningPaused: !state.cognitiveForgeState.isTuningPaused,
                }
            };
        }

        case 'ADD_SIMULATION_LOG':
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    simulationLog: [args, ...state.cognitiveForgeState.simulationLog].slice(0, 50),
                }
            };
            
        case 'COGNITIVE_FORGE/ANALYZE_PERFORMANCE_LOGS': {
            const successfulPlans = state.performanceLogs
                .filter((log: PerformanceLogEntry) => log.success && log.decisionContext?.reasoningPlan && log.decisionContext.reasoningPlan.length > 1)
                .map((log: PerformanceLogEntry) => log.decisionContext!.reasoningPlan!.map(step => step.skill));

            const pairCounts: { [key: string]: number } = {};
            successfulPlans.forEach(plan => {
                for (let i = 0; i < plan.length - 1; i++) {
                    const pairKey = `${plan[i]}->${plan[i + 1]}`;
                    pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
                }
            });

            const newSkills: SynthesizedSkill[] = [];
            const newPrimitives: { [key: string]: CognitivePrimitiveDefinition } = {};

            for (const pairKey in pairCounts) {
                if (pairCounts[pairKey] >= 2) { 
                    const [skill1, skill2] = pairKey.split('->');
                    if(!skill1 || !skill2) continue;
                    
                    const sequence = [skill1, skill2];
                    const name = `SYNTHESIZE_${skill1}_AND_${skill2}`;
                    const description = `An autonomously synthesized skill that combines ${skill1} and ${skill2} for greater efficiency.`;

                    const alreadyExists = state.cognitiveForgeState.synthesizedSkills.some(s => s.name === name);

                    if (!alreadyExists) {
                        const newSkill: SynthesizedSkill = {
                            id: `skill_synth_${self.crypto.randomUUID()}`,
                            name,
                            description,
                            steps: sequence,
                            status: 'active',
                            policyWeight: 1.0,
                        };
                        newSkills.push(newSkill);
                        
                        const newPrimitive: CognitivePrimitiveDefinition = {
                            type: name,
                            description: description,
                            payloadSchema: { input: 'any', context: 'string[]' },
                            isSynthesized: true,
                            sourcePrimitives: sequence,
                        };
                        newPrimitives[name] = newPrimitive;
                    }
                }
            }

            if (newSkills.length > 0) {
                return {
                    cognitiveForgeState: {
                        ...state.cognitiveForgeState,
                        synthesizedSkills: [...newSkills, ...state.cognitiveForgeState.synthesizedSkills],
                    },
                    psycheState: {
                        ...state.psycheState,
                        version: state.psycheState.version + newSkills.length,
                        primitiveRegistry: {
                            ...state.psycheState.primitiveRegistry,
                            ...newPrimitives,
                        }
                    }
                };
            }
            return {};
        }

        case 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE': {
            const { id, candidate: directCandidate } = args;
            const candidate = directCandidate || state.ontogeneticArchitectState.proposalQueue.find(p => p.id === id) as SelfProgrammingCandidate | undefined;
            if (!candidate) return {};

            let filesToWrite: {path: string, content: string}[] = [];

            if (candidate.proposalType === 'self_programming_create') {
                const createCandidate = candidate as CreateFileCandidate;
                filesToWrite.push({ path: createCandidate.newFile.path, content: createCandidate.newFile.content });
                createCandidate.integrations.forEach(mod => {
                     filesToWrite.push({ path: mod.filePath, content: mod.newContent });
                });
            } else if (candidate.proposalType === 'self_programming_modify') {
                const modifyCandidate = candidate as ModifyFileCandidate;
                filesToWrite.push({ path: modifyCandidate.targetFile, content: modifyCandidate.codeSnippet });
            }

            const newModLog: ModificationLogEntry = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                description: `Implemented self-programming: ${candidate.reasoning}`,
                gainType: 'SELF_PROGRAMMING',
                validationStatus: 'validated',
                isAutonomous: candidate.source === 'autonomous',
            };

            const proposalExists = state.ontogeneticArchitectState.proposalQueue.some((p: UnifiedProposal) => p.id === candidate.id);
            let newProposalQueue = state.ontogeneticArchitectState.proposalQueue;
            if (proposalExists) {
                newProposalQueue = state.ontogeneticArchitectState.proposalQueue.map((p: UnifiedProposal) =>
                    p.id === candidate.id ? { ...p, status: 'implemented' } as UnifiedProposal : p
                );
            } else {
                newProposalQueue = [{ ...candidate, status: 'implemented' }, ...state.ontogeneticArchitectState.proposalQueue];
            }

            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    vfsWriteRequest: {
                        type: 'WRITE',
                        files: filesToWrite,
                        reboot: true,
                    }
                },
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: newProposalQueue,
                },
                modificationLog: [newModLog, ...state.modificationLog].slice(-50),
            };
        }

        case 'REJECT_SELF_PROGRAMMING_CANDIDATE': {
            const { id } = args;
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p =>
                        p.id === id ? { ...p, status: 'rejected' } as UnifiedProposal : p
                    ),
                }
            };
        }
        
        case 'OA/ADD_PROPOSAL': {
             const newProposal: UnifiedProposal = args;
             return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: [newProposal, ...state.ontogeneticArchitectState.proposalQueue]
                }
            };
        }

        case 'OA/UPDATE_PROPOSAL': {
            const { id, updates } = args;
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map((p: UnifiedProposal) =>
                        p.id === id ? { ...p, ...updates } : p
                    )
                }
            };
        }
        
        case 'HEURISTICS_FORGE/ADD_HEURISTIC': {
            const newHeuristic = { ...args, id: `heuristic_${self.crypto.randomUUID()}` };
            return {
                heuristicsForge: {
                    ...state.heuristicsForge,
                    designHeuristics: [newHeuristic, ...state.heuristicsForge.designHeuristics].slice(0, 50)
                }
            };
        }
        
        case 'SYNAPTIC_MATRIX/UPDATE_METRICS': {
            const { conceptConnections } = state;
            const synapseCount = Object.keys(conceptConnections).length;
            const weights = Object.values(conceptConnections).map(c => (c as any).weight);
            const avgWeight = weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : 0;
            
            const plasticity = state.synapticMatrix.plasticity * 0.99 + (Math.random() * 0.01);
            
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    synapseCount,
                    avgConfidence: avgWeight,
                    plasticity,
                }
            };
        }
        case 'SYNAPTIC_MATRIX/SET_ADAPTING':
            return { synapticMatrix: { ...state.synapticMatrix, isAdapting: args.isAdapting } };
        case 'SYNAPTIC_MATRIX/SET_ACTIVE_CONCEPT':
            return { synapticMatrix: { ...state.synapticMatrix, activeConcept: args.concept } };
        case 'SYNAPTIC_MATRIX/ADD_INTUITIVE_ALERT':
            return { synapticMatrix: { ...state.synapticMatrix, intuitiveAlerts: [args, ...state.synapticMatrix.intuitiveAlerts].slice(0, 5) } };
        case 'SYNAPTIC_MATRIX/LOG_PROBE': {
            const newLog = { timestamp: Date.now(), message: args.message };
            return { synapticMatrix: { ...state.synapticMatrix, probeLog: [newLog, ...state.synapticMatrix.probeLog].slice(0, 10) } };
        }
        case 'VFS/WRITE_FILE_REQUEST': {
            const { type, files, reboot } = args;
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    vfsWriteRequest: {
                        type: type || 'WRITE',
                        files: files,
                        reboot: reboot !== false,
                    },
                }
            };
        }
        
        case 'SET_COPROCESSOR_ARCHITECTURE': {
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessorArchitecture: args,
                }
            };
        }

        case 'SET_COPROCESSOR_ARCHITECTURE_MODE': {
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessorArchitectureMode: args,
                }
            };
        }
        
        case 'NEURAL_ACCELERATOR/LOG_ACTIVITY': {
            const newEntry = {
                id: `nac_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                type: args.type,
                projectedGain: args.projectedGain,
                description: args.description
            };
            return {
                neuralAcceleratorState: {
                    ...state.neuralAcceleratorState,
                    lastActivityLog: [newEntry, ...state.neuralAcceleratorState.lastActivityLog].slice(0, 20)
                }
            };
        }

        default:
            return {};
    }
};
