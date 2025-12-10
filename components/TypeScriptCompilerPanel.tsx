
// components/TypeScriptCompilerPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAuraDispatch, useLocalization, useArchitectureState } from '../context/AuraContext.tsx';
import { DirectoryNode } from '../types.ts';

export const TypeScriptCompilerPanel = () => {
    const { syscall, addToast } = useAuraDispatch();
    const { selfProgrammingState } = useArchitectureState();
    const { t } = useLocalization();
    const [filePath, setFilePath] = useState('');

    // Helper to flatten file paths for the dropdown
    const filePaths = useMemo(() => {
        const paths: string[] = [];
        const traverse = (node: DirectoryNode, currentPath: string) => {
            for (const [name, child] of Object.entries(node.children)) {
                const fullPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
                if (child.type === 'file' && (name.endsWith('.ts') || name.endsWith('.tsx'))) {
                    paths.push(fullPath);
                } else if (child.type === 'directory') {
                    traverse(child as DirectoryNode, fullPath);
                }
            }
        };
        if (selfProgrammingState.virtualFileSystem) {
            traverse(selfProgrammingState.virtualFileSystem, '');
        }
        return paths.sort();
    }, [selfProgrammingState.virtualFileSystem]);

    const handleRunCheck = () => {
        if (!filePath.trim()) {
            addToast('A file path is required to run a type check.', 'error');
            return;
        }
        syscall('EXECUTE_TOOL', {
            toolName: 'typescript_check_types',
            args: {
                filePath: filePath.trim()
            }
        });
        addToast(`TypeScript check dispatched for ${filePath}. Check chat for results.`, 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('tsc_panel_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="tsc-path">{t('tsc_filePath')}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        id="tsc-path"
                        type="text"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                        placeholder="/src/main.ts"
                        className="vfs-path-input"
                        style={{ flexGrow: 1 }}
                    />
                    <select 
                        onChange={(e) => setFilePath(e.target.value)}
                        value=""
                        style={{ width: '20px', flexShrink: 0 }}
                        title="Select from VFS"
                    >
                        <option value="" disabled></option>
                        {filePaths.map(path => (
                            <option key={path} value={path}>{path}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button
                    className="control-button"
                    onClick={handleRunCheck}
                    disabled={!filePath.trim()}
                >
                    {t('tsc_runCheck')}
                </button>
            </div>
             <p className="reason-text" style={{fontSize: '0.8rem', marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-muted)'}}>
                {t('tsc_results_note')}
            </p>
        </div>
    );
};
