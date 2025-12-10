
// state/reducers/pluginReducer.ts
import { AuraState, Action, Plugin } from '../../types';

export const pluginReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PLUGIN/ADD_PLUGIN': {
            const newPlugin = args as Plugin;
            // Avoid adding duplicates
            if (state.pluginState.registry.some(p => p.id === newPlugin.id)) {
                return {};
            }
            return {
                pluginState: {
                    ...state.pluginState,
                    registry: [...state.pluginState.registry, newPlugin]
                }
            };
        }
        case 'PLUGIN/REGISTER_LIBRARY': {
             return {
                pluginState: {
                    ...state.pluginState,
                    loadedLibraries: {
                        ...state.pluginState.loadedLibraries,
                        [args.id]: { id: args.id, name: args.name, status: 'loading' }
                    }
                }
            };
        }
        case 'PLUGIN/SET_LIBRARY_STATUS': {
            const { id, status } = args;
            if (!state.pluginState.loadedLibraries || !state.pluginState.loadedLibraries[id]) return {};

            return {
                 pluginState: {
                    ...state.pluginState,
                    loadedLibraries: {
                        ...state.pluginState.loadedLibraries,
                        [id]: { ...state.pluginState.loadedLibraries[id], status }
                    }
                }
            }
        }
        case 'PLUGIN/HYDRATE_KNOWLEDGE': {
            const { pluginId, knowledge } = args;
            const pluginIndex = state.pluginState.registry.findIndex(p => p.id === pluginId);
            if (pluginIndex === -1) return {};
            
            const newRegistry = [...state.pluginState.registry];
            // Update the plugin in the registry to have the loaded knowledge
            newRegistry[pluginIndex] = {
                ...newRegistry[pluginIndex],
                knowledge: knowledge,
                status: 'enabled'
            };
            
            // Add to the main knowledge graph
            const newFacts = knowledge.map((k: any) => ({ 
                ...k, 
                id: self.crypto.randomUUID(), 
                source: pluginId,
                lastAccessed: Date.now() 
            }));
            
            return {
                pluginState: { ...state.pluginState, registry: newRegistry },
                knowledgeGraph: [...state.knowledgeGraph, ...newFacts]
            };
        }
        default:
            return {};
    }
};
