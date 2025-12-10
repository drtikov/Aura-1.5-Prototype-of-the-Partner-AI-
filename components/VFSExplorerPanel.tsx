
// components/VFSExplorerPanel.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { AuraState, DirectoryNode, VFSNode } from '../types.ts';
import { HAL } from '../core/hal';

// --- VFS Memory Facade Logic ---

// In Variant C, reading is async because it hits IndexedDB
const memoryVfsRead = async (path: string, state: AuraState): Promise<string | null> => {
    const root = state.selfProgrammingState.virtualFileSystem;
    const node = HAL.VFS.resolve(root, path);
    
    if (!node) return `File not found: ${path}`;
    if (node.type === 'directory') return `Cannot read directory: ${path}`;
    
    // Fetch blob from IDB
    const content = await HAL.Memristor.getBlob(node.hash);
    return content || `Error: Blob not found for hash ${node.hash}`;
};

const memoryVfsLs = (path: string, state: AuraState): { name: string, type: 'file' | 'directory' }[] | null => {
    const root = state.selfProgrammingState.virtualFileSystem;
    
    let targetNode: VFSNode | null = root;
    
    if (path !== '/') {
        targetNode = HAL.VFS.resolve(root, path);
    }

    if (!targetNode || targetNode.type !== 'directory') return null;

    const directoryNode = targetNode as DirectoryNode;

    return Object.entries(directoryNode.children).map(([name, child]) => ({
        name,
        type: child.type
    }));
};


// --- Reusable File Explorer UI Component ---
interface FileExplorerProps {
    ls: (path: string, state: AuraState) => { name: string, type: 'file' | 'directory' }[] | null;
    read: (path: string, state: AuraState) => Promise<string | null>;
    state: AuraState;
    t: (key: string) => string;
    promptText: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ ls, read, state, t, promptText }) => {
    const [currentPath, setCurrentPath] = useState('/');
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    
    useEffect(() => {
        // Reset view when the component is switched by tabs
        setCurrentPath('/');
        setFileContent(null);
        setIsLoadingContent(false);
    }, [ls, read]);

    const nodes = useMemo(() => {
        const items = ls(currentPath, state);
        if (currentPath !== '/') {
            return [{ name: '..', type: 'directory' as const }, ...(items || [])];
        }
        return items;
    }, [currentPath, state, ls]);

    const handleNodeClick = async (node: { name: string, type: 'file' | 'directory' }) => {
        if (node.type === 'directory') {
            setFileContent(null);
            if (node.name === '..') {
                const parentPath = currentPath.split('/').filter(Boolean).slice(0, -1).join('/');
                setCurrentPath(parentPath ? `/${parentPath}` : '/');
            } else {
                const newPath = (currentPath === '/' ? '' : currentPath) + `/${node.name}`;
                setCurrentPath(newPath);
            }
        } else {
            const filePath = (currentPath === '/' ? '' : currentPath) + `/${node.name}`;
            setIsLoadingContent(true);
            setFileContent(null);
            const content = await read(filePath, state);
            setFileContent(content);
            setIsLoadingContent(false);
        }
    };

    return (
        <>
            <div className="vfs-path-bar">
                <span>{promptText}</span>{currentPath}$
            </div>
            <div className="vfs-main-area">
                <div className="vfs-file-list">
                    {nodes ? nodes.map(node => (
                        <div key={node.name} className="vfs-node" onClick={() => handleNodeClick(node)}>
                            <span className={`vfs-node-type type-${node.type === 'directory' ? 'd' : 'f'}`}>{`[${node.type === 'directory' ? 'd' : 'f'}]`}</span>
                            <span className="vfs-node-name">{node.name}</span>
                        </div>
                    )) : <div className="kg-placeholder">{t('vfs_error')}</div>}
                </div>
                <div className="vfs-content-viewer">
                    {isLoadingContent ? (
                         <div className="kg-placeholder" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <div className="spinner-small"></div>
                            <span>Loading Blob...</span>
                        </div>
                    ) : fileContent !== null ? (
                        <pre><code>{fileContent}</code></pre>
                    ) : (
                        <div className="kg-placeholder">{t('vfs_selectFile')}</div>
                    )}
                </div>
            </div>
        </>
    );
};


// --- Main VFS Explorer Panel ---
export const VFSExplorerPanel = () => {
    const { state } = useAuraDispatch();
    const { t } = useLocalization();
    
    return (
        <div className="vfs-explorer-panel">
            <div className="modal-tabs-container">
                <div className="left-column-tabs">
                    <button className={`tab-button active`}>
                        VFS Memory (Git-Like)
                    </button>
                </div>
            </div>
            <FileExplorer ls={memoryVfsLs} read={memoryVfsRead} state={state} t={t} promptText="aura@memfs:" />
        </div>
    );
};
