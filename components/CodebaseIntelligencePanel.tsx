
// components/CodebaseIntelligencePanel.tsx
import React, { useMemo } from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
import { DirectoryNode, VFSNode } from '../types.ts';

export const CodebaseIntelligencePanel = () => {
    const { selfProgrammingState } = useArchitectureState();
    const { t } = useLocalization();
    const root = selfProgrammingState.virtualFileSystem;

    const stats = useMemo(() => {
        let fileCount = 0;
        let totalSize = 0;
        const typeCounts: Record<string, number> = {};
        const largestFiles: { path: string; size: number }[] = [];

        const traverse = (node: VFSNode, currentPath: string) => {
            if (node.type === 'file') {
                fileCount++;
                const size = node.size || 0;
                totalSize += size;
                
                const ext = currentPath.split('.').pop() || 'unknown';
                typeCounts[ext] = (typeCounts[ext] || 0) + 1;

                largestFiles.push({ path: currentPath, size });
            } else if (node.type === 'directory' && node.children) {
                Object.entries(node.children).forEach(([name, child]) => {
                    traverse(child, `${currentPath}/${name}`);
                });
            }
        };

        if (root) {
            traverse(root, '');
        }

        // Sort largest files
        largestFiles.sort((a, b) => b.size - a.size);

        return {
            fileCount,
            totalSize,
            typeCounts,
            largestFiles: largestFiles.slice(0, 5) // Top 5
        };
    }, [root]);

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        return `${(bytes / 1024).toFixed(1)} KB`;
    };

    return (
        <div className="side-panel codebase-intelligence-panel">
            <p className="reason-text">
                Real-time static analysis of the Aura Virtual File System (VFS). This metrics engine monitors the complexity and footprint of the self-modifying codebase.
            </p>

            <div className="synaptic-metrics" style={{ marginBottom: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <div className="metric-item">
                    <span className="metric-label">Total Files</span>
                    <span className="metric-value">{stats.fileCount}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Codebase Size</span>
                    <span className="metric-value" style={{ color: 'var(--primary-color)' }}>{formatSize(stats.totalSize)}</span>
                </div>
            </div>

            <div className="panel-subsection-title">File Composition</div>
            <div className="hormone-signals">
                {Object.entries(stats.typeCounts)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([ext, count]) => (
                        <div key={ext} className="state-item">
                            <label style={{ textTransform: 'uppercase' }}>{ext}</label>
                            <div className="state-bar-container">
                                <div 
                                    className="state-bar" 
                                    style={{ 
                                        width: `${((count as number) / stats.fileCount) * 100}%`, 
                                        backgroundColor: 'var(--accent-color)' 
                                    }} 
                                />
                            </div>
                            <span>{count}</span>
                        </div>
                ))}
            </div>

            <div className="panel-subsection-title">Largest Modules</div>
            <div className="command-log-list">
                {stats.largestFiles.map((file, index) => (
                    <div key={index} className="command-log-item log-type-info">
                        <span className="log-icon">📄</span>
                        <span className="log-text" title={file.path}>{file.path}</span>
                        <span className="log-time">{formatSize(file.size)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
