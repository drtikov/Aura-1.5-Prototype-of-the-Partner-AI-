// state/reducers/heuristicCoprocessor.ts
import { AuraState, Action } from '../../types.ts';
import { getInitialState } from '../initialState';

export const heuristicCoprocessorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HEURISTIC_COPROCESSOR/LOG_ACTIVATION': {
            const { coprocessorId, message, cooldownEnds } = args;
            const newLogEntry = {
                timestamp: Date.now(),
                coprocessorId,
                message,
            };
            const currentState = state.heuristicCoprocessorState || getInitialState().heuristicCoprocessorState;
            return {
                heuristicCoprocessorState: {
                    ...currentState,
                    log: [newLogEntry, ...currentState.log].slice(0, 20),
                    cooldowns: {
                        ...currentState.cooldowns,
                        [coprocessorId]: cooldownEnds,
                    }
                }
            };
        }
        default:
            return {};
    }
};