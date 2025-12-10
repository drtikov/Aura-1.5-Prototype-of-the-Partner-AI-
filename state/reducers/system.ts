
// state/reducers/system.ts
// FIX: Replaced the incorrect 'CognitiveTask' with the correct 'KernelTask' type.
import { AuraState, Action, AGISDecision, MetacognitiveLink, KernelTask, ModificationLogEntry, KernelPatchProposal, UnifiedProposal } from '../../types.ts';

export const systemReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SYSTEM/API_KEY_INVALIDATED':
            return {
                systemState: {
                    ...state.systemState,
                    isApiKeyInvalidated: true,
                }
            };
        case 'SYSTEM/CLEAR_API_KEY_INVALIDATED':
            return {
                systemState: {
                    ...state.systemState,
                    isApiKeyInvalidated: false,
                }
            };
        
        case 'SYSTEM/ADD_META_LINK': {
            const newLink: MetacognitiveLink = {
                id: `meta_${self.crypto.randomUUID()}`,
                source: args.source,
                target: args.target,
                correlation: args.correlation,
                observationCount: args.observationCount,
                lastUpdated: Date.now(),
            };
            return {
                metacognitiveCausalModel: {
                    ...state.metacognitiveCausalModel,
                    [`${newLink.source.key}_${newLink.target.key}`]: newLink
                }
            };
        }

        case 'SYSTEM/UPDATE_RESOURCE_MONITOR': {
            return {
                resourceMonitor: {
                    ...state.resourceMonitor,
                    ...args,
                }
            };
        }
        
        default:
            return {};
    }
};
