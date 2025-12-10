
// state/reducers/neuralSurrogate.ts
import { AuraState, Action } from '../../types.ts';

export const neuralSurrogateReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SURROGATE/UPDATE_STATE':
            return {
                neuralSurrogateState: {
                    ...state.neuralSurrogateState,
                    ...args,
                    // If metrics are passed, update logs
                    lossHistory: args.loss ? [...state.neuralSurrogateState.lossHistory, args.loss].slice(-50) : state.neuralSurrogateState.lossHistory
                }
            };
        case 'SURROGATE/SET_CIRCUIT':
             return {
                 neuralSurrogateState: {
                     ...state.neuralSurrogateState,
                     lastCircuit: args.circuit
                 }
             };
        default:
            return {};
    }
};
