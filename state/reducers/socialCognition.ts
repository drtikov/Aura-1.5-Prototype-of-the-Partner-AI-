// state/reducers/socialCognition.ts
import { AuraState, Action } from '../../types.ts';
import { getInitialState } from '../initialState';

export const socialCognitionReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;
    const currentState = state.socialCognitionState || getInitialState().socialCognitionState;

    switch (call) {
        case 'SOCIAL/ADD_NODE': {
            const newNode = args;
            if (currentState.socialGraph[newNode.id]) return {};
            return {
                socialCognitionState: {
                    ...currentState,
                    socialGraph: {
                        ...currentState.socialGraph,
                        [newNode.id]: newNode,
                    }
                }
            };
        }

        case 'SOCIAL/UPDATE_NODE': {
            const { id, updates } = args;
            const nodeToUpdate = currentState.socialGraph[id];
            if (!nodeToUpdate) return {};

            // Special handling for dossier to append rather than overwrite
            const newDossier = updates.dossier 
                ? [...new Set([...nodeToUpdate.dossier, ...updates.dossier])] // Append and deduplicate
                : nodeToUpdate.dossier;

            const updatedNode = {
                ...nodeToUpdate,
                ...updates,
                dossier: newDossier,
            };

            return {
                 socialCognitionState: {
                    ...currentState,
                    socialGraph: {
                        ...currentState.socialGraph,
                        [id]: updatedNode,
                    }
                }
            }
        }

        case 'SOCIAL/ADD_RELATIONSHIP': {
            const { sourceId, relationship } = args;
            const sourceNode = currentState.socialGraph[sourceId];
            if (!sourceNode) return {};
            const updatedNode = {
                ...sourceNode,
                relationships: [...sourceNode.relationships, relationship],
            };
            return {
                socialCognitionState: {
                    ...currentState,
                    socialGraph: {
                        ...currentState.socialGraph,
                        [sourceId]: updatedNode,
                    }
                }
            };
        }
        
        case 'SOCIAL/UPDATE_CULTURAL_MODEL': {
            return {
                socialCognitionState: {
                    ...currentState,
                    culturalModel: {
                        ...currentState.culturalModel,
                        ...args,
                    }
                }
            };
        }

        default:
            return {};
    }
};