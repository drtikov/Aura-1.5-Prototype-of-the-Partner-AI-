
import { AuraState, Action } from '../../types';

export const ramanujanEngineReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'RAMANUJAN/GENERATE': {
            const { conjecture } = args;
            return {
                ramanujanEngineState: {
                    ...state.ramanujanEngineState,
                    status: 'idle', // Reset to idle after generation
                    proposedConjectures: [conjecture, ...state.ramanujanEngineState.proposedConjectures].slice(0, 10),
                    log: [...state.ramanujanEngineState.log, { timestamp: Date.now(), message: `New conjecture generated: ${conjecture.id}` }].slice(-20)
                }
            };
        }
        case 'RAMANUJAN/SET_STATUS': {
             return {
                ramanujanEngineState: {
                    ...state.ramanujanEngineState,
                    status: args.status
                }
            };
        }

        default:
            return {};
    }
};
