
import { AuraState, Action, MonteCarloNode } from '../../types.ts';

export const monteCarloReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'MONTE_CARLO/RESET':
            return {
                monteCarloState: {
                    status: 'idle',
                    goal: null,
                    tree: {},
                    rootId: null,
                    bestPath: [],
                }
            };
        
        case 'MONTE_CARLO/INIT_TREE':
            const { goal, rootId } = args;
            const rootNode: MonteCarloNode = {
                id: rootId,
                parentId: null,
                content: goal,
                type: 'root',
                score: 1.0,
                localRelevance: 1.0,
                llmQuality: 1.0,
                childrenIds: [],
                status: 'selected'
            };
            return {
                monteCarloState: {
                    ...state.monteCarloState,
                    status: 'planning',
                    goal: goal,
                    rootId: rootId,
                    tree: { [rootId]: rootNode },
                    bestPath: [rootId]
                }
            };

        case 'MONTE_CARLO/ADD_NODE': {
            const node = args.node as MonteCarloNode;
            const parent = state.monteCarloState.tree[node.parentId!];
            if (!parent) return {};

            return {
                monteCarloState: {
                    ...state.monteCarloState,
                    tree: {
                        ...state.monteCarloState.tree,
                        [parent.id]: {
                            ...parent,
                            childrenIds: [...parent.childrenIds, node.id]
                        },
                        [node.id]: node
                    }
                }
            };
        }

        case 'MONTE_CARLO/UPDATE_NODE': {
            const { nodeId, updates } = args;
            if (!state.monteCarloState.tree[nodeId]) return {};
            return {
                monteCarloState: {
                    ...state.monteCarloState,
                    tree: {
                        ...state.monteCarloState.tree,
                        [nodeId]: { ...state.monteCarloState.tree[nodeId], ...updates }
                    }
                }
            };
        }

        case 'MONTE_CARLO/SET_STATUS':
            return {
                monteCarloState: {
                    ...state.monteCarloState,
                    status: args.status
                }
            };
        
        case 'MONTE_CARLO/SET_BEST_PATH':
            return {
                monteCarloState: {
                    ...state.monteCarloState,
                    bestPath: args.path,
                    status: 'complete'
                }
            };

        default:
            return {};
    }
};
