
// state/reducers/recursiveConsensus.ts
import { AuraState, Action, ConsensusTurn } from '../../types';

export const recursiveConsensusReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'CONSENSUS/START': {
            return {
                recursiveConsensusState: {
                    status: 'proposing',
                    goal: args.goal,
                    iterations: 0,
                    convergenceScore: 0,
                    dialogue: [],
                    finalOutcome: null,
                    currentPlan: null,
                }
            };
        }

        case 'CONSENSUS/ADD_TURN': {
            const turn: ConsensusTurn = {
                speaker: args.speaker,
                content: args.content,
                timestamp: Date.now(),
            };
            
            return {
                recursiveConsensusState: {
                    ...state.recursiveConsensusState,
                    dialogue: [...state.recursiveConsensusState.dialogue, turn],
                }
            };
        }

        case 'CONSENSUS/UPDATE': {
             return {
                recursiveConsensusState: {
                    ...state.recursiveConsensusState,
                    ...args
                }
            };
        }

        case 'CONSENSUS/SET_STATUS': {
             return {
                recursiveConsensusState: {
                    ...state.recursiveConsensusState,
                    status: args.status
                }
            };
        }
        
        case 'CONSENSUS/RESET': {
            return {
                recursiveConsensusState: {
                    status: 'idle',
                    goal: null,
                    iterations: 0,
                    convergenceScore: 0,
                    dialogue: [],
                    finalOutcome: null,
                    currentPlan: null,
                }
            };
        }

        default:
            return {};
    }
};
