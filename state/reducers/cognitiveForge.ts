
// state/reducers/cognitiveForge.ts
// FIX: Removed `SynthesisCandidate` from import as it is an obsolete type.
import { AuraState, Action, SynthesizedSkill } from '../../types.ts';
import { clamp } from '../../utils.ts'; // Assuming clamp is exported from utils

export const cognitiveForgeReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ADD_SYNTHESIZED_SKILL': {
            const newSkill: SynthesizedSkill = {
                ...args,
                policyWeight: 1.0, // Initialize with a neutral weight
            };
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesizedSkills: [...state.cognitiveForgeState.synthesizedSkills, newSkill]
                }
            };
        }
        
        case 'MANUAL_REINFORCE_SKILL': {
            const { skillId, adjustment } = args;
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesizedSkills: state.cognitiveForgeState.synthesizedSkills.map(skill => {
                        if (skill.id === skillId) {
                            const newWeight = clamp(skill.policyWeight + adjustment, 0.1, 2.0);
                            return { ...skill, policyWeight: newWeight };
                        }
                        return skill;
                    })
                }
            }
        }

        default:
            return {};
    }
};
