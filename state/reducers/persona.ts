
// state/reducers/persona.ts
import { AuraState, Action } from '../../types';

export const personaReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') return {};
    const { call, args } = action.payload;

    switch (call) {
        case 'PERSONA/ADD_JOURNAL_ENTRY': {
            const { personaId, entry } = args;
            if (!entry || !personaId) return {};

            const currentJournal = state.personalityState.personaJournals[personaId] || [];
            const newJournal = [entry, ...currentJournal].slice(0, 10);

            return {
                personalityState: {
                    ...state.personalityState,
                    personaJournals: {
                        ...state.personalityState.personaJournals,
                        [personaId]: newJournal,
                    }
                }
            };
        }
        
        case 'PERSONA/UPDATE_INSTRUCTION': {
             const { personaId, newInstruction } = args;
             const currentPersona = state.personalityState.personas[personaId] || { activation: 0 };
             
             return {
                 personalityState: {
                     ...state.personalityState,
                     personas: {
                         ...state.personalityState.personas,
                         [personaId]: {
                             ...currentPersona,
                             currentSystemInstruction: newInstruction,
                             version: (currentPersona.version || 1) + 1
                         }
                     }
                 }
             }
        }

        default:
            return {};
    }
};