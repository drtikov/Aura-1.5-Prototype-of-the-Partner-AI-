
// state/reducers/neuroSymbolic.ts
import { AuraState, Action } from '../../types.ts';

export const neuroSymbolicReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'LOGIC/UPDATE_STATE':
            return {
                neuroSymbolicState: {
                    ...state.neuroSymbolicState,
                    ...args,
                }
            };
        default:
            return {};
    }
};
