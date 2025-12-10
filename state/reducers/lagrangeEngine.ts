
import { AuraState, Action } from '../../types';

export const lagrangeEngineReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'LAGRANGE/SIMULATE': {
            const { equation, discretization, logEntry } = args;
            return {
                lagrangeEngineState: {
                    ...state.lagrangeEngineState,
                    status: 'running',
                    symbolicEquation: equation || state.lagrangeEngineState.symbolicEquation,
                    numericalDiscretization: discretization || state.lagrangeEngineState.numericalDiscretization,
                    simulationLog: logEntry ? [...state.lagrangeEngineState.simulationLog, logEntry].slice(-20) : state.lagrangeEngineState.simulationLog
                }
            };
        }
        
        case 'LAGRANGE/COMPLETE': {
             return {
                lagrangeEngineState: {
                    ...state.lagrangeEngineState,
                    status: 'idle',
                    simulationLog: [...state.lagrangeEngineState.simulationLog, 'Simulation cycle complete.'].slice(-20)
                }
            };
        }

        default:
            return {};
    }
};
