
// state/reducers/mycelial.ts
import { AuraState, Action } from '../../types.ts';
import { getInitialState } from '../initialState';

export const mycelialReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;
    const currentState = state.mycelialState || getInitialState().mycelialState;

    switch (call) {
        case 'MYCELIAL/SAVE_MODULE': {
            const { moduleId, modelJSON, accuracy, lastPrediction, name, description } = args;
            const existingModule = currentState.modules[moduleId];

            return {
                mycelialState: {
                    ...currentState,
                    modules: {
                        ...currentState.modules,
                        [moduleId]: {
                            ...(existingModule || {}), // Preserve existing data if any
                            name: name || existingModule?.name || moduleId,
                            description: description || existingModule?.description || "Autonomously crystallized knowledge cluster.",
                            isInitialized: true,
                            modelJSON: modelJSON || existingModule?.modelJSON,
                            accuracy: accuracy ?? existingModule?.accuracy ?? 0.5,
                            lastPrediction: lastPrediction ?? Date.now(),
                        }
                    }
                }
            };
        }

        case 'MYCELIAL/LOG_UPDATE': {
            const newLogEntry = {
                timestamp: Date.now(),
                message: args.message,
            };
            return {
                mycelialState: {
                    ...currentState,
                    log: [newLogEntry, ...currentState.log].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};
