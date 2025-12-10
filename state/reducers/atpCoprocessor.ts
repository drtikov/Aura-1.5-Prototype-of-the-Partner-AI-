
import { AuraState, Action, ProofAttempt } from '../../types';

export const atpCoprocessorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ATP/START_PROOF_ATTEMPT': {
            const { goal } = args;
            const newAttempt: ProofAttempt = {
                conjecture: goal,
                status: 'planning',
                plan: [],
                log: [{ timestamp: Date.now(), engine: 'System', message: 'Proof attempt initialized.' }]
            };
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'orchestrating',
                    currentGoal: goal,
                    activeProofAttempt: newAttempt
                }
            };
        }

        case 'ATP/UPDATE_STEP': {
             if (!state.atpCoprocessorState.activeProofAttempt) return {};
             const { step, logEntry } = args;
             
             const currentPlan = state.atpCoprocessorState.activeProofAttempt.plan;
             // If step exists, update it; otherwise add it
             const updatedPlan = currentPlan.some(s => s.stepNumber === step.stepNumber)
                ? currentPlan.map(s => s.stepNumber === step.stepNumber ? step : s)
                : [...currentPlan, step];

             return {
                 atpCoprocessorState: {
                     ...state.atpCoprocessorState,
                     activeProofAttempt: {
                         ...state.atpCoprocessorState.activeProofAttempt,
                         plan: updatedPlan,
                         log: logEntry ? [...state.atpCoprocessorState.activeProofAttempt.log, logEntry].slice(-20) : state.atpCoprocessorState.activeProofAttempt.log
                     }
                 }
             };
        }
        
        case 'ATP/COMPLETE_ATTEMPT': {
             if (!state.atpCoprocessorState.activeProofAttempt) return {};
             const { success } = args;
             return {
                 atpCoprocessorState: {
                     ...state.atpCoprocessorState,
                     status: 'idle',
                     activeProofAttempt: {
                         ...state.atpCoprocessorState.activeProofAttempt,
                         status: success ? 'proven' : 'failed',
                         log: [...state.atpCoprocessorState.activeProofAttempt.log, { timestamp: Date.now(), engine: 'System', message: success ? 'Proof verified.' : 'Proof failed.' }]
                     }
                 }
             };
        }

        case 'ATP/RESET':
            return {
                atpCoprocessorState: {
                    status: 'idle',
                    currentGoal: null,
                    activeProofAttempt: null,
                }
            };

        default:
            return {};
    }
};
