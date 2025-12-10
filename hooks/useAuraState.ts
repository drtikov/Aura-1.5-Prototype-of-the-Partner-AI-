
// hooks/useAuraState.ts
import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { getInitialState } from '../state/initialState.ts';
import { auraReducer } from '../state/reducer.ts'; // Corrected import path
import { CURRENT_STATE_VERSION } from '../constants.ts';
import { migrateState } from '../state/migrations.ts';
import { HAL } from '../core/hal.ts';
import { AuraState, DirectoryNode, Plugin } from '../types.ts';
import { INITIAL_VFS_SEED } from '../core/vfs.ts';
import { plugins } from '../state/plugins.ts';

// Custom hook to manage Aura's state, including persistence via the HAL
export const useAuraState = () => {
    const [state, dispatch] = useReducer(auraReducer, getInitialState());
    const [memoryStatus, setMemoryStatus] = useState<'initializing' | 'ready' | 'saving' | 'error'>('initializing');
    const isInitialized = useRef(false);

    const stateRef = useRef(state);
    const memoryStatusRef = useRef(memoryStatus);
    
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        memoryStatusRef.current = memoryStatus;
    }, [memoryStatus]);

    const saveStateToMemory = useCallback(async () => {
        setMemoryStatus('saving');
        try {
            // Create a shallow copy first
            const stateToSave = { ...stateRef.current };
            
            // 1. Sanitize Plugin Registry
            // IndexedDB cannot store functions (knowledgeLoader). We must strip them.
            if (stateToSave.pluginState && stateToSave.pluginState.registry) {
                stateToSave.pluginState = {
                    ...stateToSave.pluginState,
                    registry: stateToSave.pluginState.registry.map(p => {
                        // Destructure to exclude knowledgeLoader
                        const { knowledgeLoader, ...rest } = p;
                        return rest as Plugin;
                    })
                };
            }

            // 2. Sanitize Modal Request
            // Modal payloads often contain callback functions (onConfirm, etc.) which break structured cloning.
            if (stateToSave.modalRequest) {
                stateToSave.modalRequest = null;
            }
            
            const rebootIsPending = stateToSave.kernelState?.rebootPending;
            if (rebootIsPending) {
                stateToSave.kernelState = { ...stateToSave.kernelState, rebootPending: false };
            }
            
            // Note: The virtualFileSystem in the state is the Tree structure.
            // Content blobs are saved separately via VFS/WRITE_FILE_REQUEST flow.
            await HAL.Memristor.saveState(stateToSave);
            setMemoryStatus('ready');
            
            if (rebootIsPending) {
                console.log("Reboot triggered by save...");
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to save state to Memristor:", error);
            setMemoryStatus('error');
        }
    }, []);

    useEffect(() => {
        const initializeState = async () => {
            if (isInitialized.current) return;
            isInitialized.current = true;

            try {
                // Step 1: Load the main application state
                let loadedState = await HAL.Memristor.loadState();
                
                let finalInitialState = getInitialState();

                if (loadedState) {
                    if (!loadedState.version || loadedState.version < CURRENT_STATE_VERSION) {
                        loadedState = migrateState(loadedState);
                    }
                    finalInitialState = { ...finalInitialState, ...loadedState };
                    
                    // Step 1.5: Re-hydrate Plugin Loaders
                    // Since we stripped knowledgeLoader functions during save, we must restore them
                    // from the static 'plugins' definition for any plugin that exists in both.
                    if (finalInitialState.pluginState && finalInitialState.pluginState.registry) {
                        const staticPluginsMap = new Map(plugins.map(p => [p.id, p]));
                        
                        finalInitialState.pluginState.registry = finalInitialState.pluginState.registry.map(p => {
                            const staticP = staticPluginsMap.get(p.id);
                            // If the static definition has a loader, re-attach it
                            if (staticP && staticP.knowledgeLoader) {
                                return { ...p, knowledgeLoader: staticP.knowledgeLoader };
                            }
                            return p;
                        });
                    }
                }

                // Step 2: Handle VFS Migration/Initialization
                const vfs = finalInitialState.selfProgrammingState.virtualFileSystem;
                let newTree: DirectoryNode;
                let paths: string[] = [];

                // Case A: Legacy Flat Map found in loaded state or Initial Seed needed
                const needsMigration = !vfs || (typeof vfs === 'object' && !('type' in vfs));
                
                if (needsMigration) {
                    console.log("Migrating VFS to Git-like Structure...");
                    
                    // Use legacy VFS if present, otherwise use seed
                    const legacyVFS = await HAL.Memristor.loadVFS();
                    
                    const sourceVFS = (legacyVFS && Object.keys(legacyVFS).length > 0) 
                        ? legacyVFS 
                        : INITIAL_VFS_SEED;

                    const { tree, blobs } = await HAL.VFS.hydrate(sourceVFS);
                    
                    // Persist all blobs
                    for (const [hash, content] of Object.entries(blobs)) {
                        await HAL.Memristor.saveBlob(hash, content);
                    }
                    
                    newTree = tree;
                    paths = Object.keys(sourceVFS);
                    
                } else {
                     // Case B: Already in Tree format
                     newTree = vfs as DirectoryNode;
                     paths = finalInitialState.selfProgrammingState.vfsPaths;
                }

                // Step 3: Merge final state
                finalInitialState.selfProgrammingState = {
                    ...finalInitialState.selfProgrammingState,
                    vfsPaths: paths,
                    virtualFileSystem: newTree,
                };
                
                // Step 4: CRITICAL - Clear any stuck running tasks from persisted state
                // This prevents the "Too many answers" loop where a task persists across reloads
                if (finalInitialState.kernelState) {
                    finalInitialState.kernelState = {
                        ...finalInitialState.kernelState,
                        runningTask: null
                    };
                }

                dispatch({ type: 'IMPORT_STATE', payload: finalInitialState });
                setMemoryStatus('ready');

            } catch (error) {
                console.error("Failed to initialize state from IndexedDB:", error);
                setMemoryStatus('error');
            }
        };

        initializeState();
    }, [dispatch]);

    useEffect(() => {
        const saveInterval = setInterval(() => {
            if (memoryStatusRef.current === 'ready' && !stateRef.current.kernelState.rebootPending) {
                saveStateToMemory();
            }
        }, 30000);

        return () => clearInterval(saveInterval);
    }, [saveStateToMemory]);
    
    const clearMemoryAndState = useCallback(async () => {
        await HAL.Memristor.clearDB();
        dispatch({ type: 'RESET_STATE' });
    }, [dispatch]);

    return { state, dispatch, memoryStatus, saveStateToMemory, clearMemoryAndState };
};
