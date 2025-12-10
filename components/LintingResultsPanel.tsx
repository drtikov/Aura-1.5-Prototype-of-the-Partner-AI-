
// components/LintingResultsPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch } from '../context/AuraContext.tsx';

interface Issue {
    line: number;
    message: string;
    severity: 'error' | 'warning';
}

export const LintingResultsPanel = () => {
    const { addToast } = useAuraDispatch();
    const [code, setCode] = useState('function test() {\n  console.log("debug");\n  // TODO: Fix this\n  var x = 1;\n}');
    const [issues, setIssues] = useState<Issue[]>([]);

    const handleScan = () => {
        const lines = code.split('\n');
        const foundIssues: Issue[] = [];

        lines.forEach((line, index) => {
            const i = index + 1;
            if (line.includes('console.log')) {
                foundIssues.push({ line: i, message: 'Unexpected console.log statement.', severity: 'warning' });
            }
            if (line.includes('TODO')) {
                foundIssues.push({ line: i, message: 'Found TODO comment.', severity: 'warning' });
            }
            if (line.includes('FIXME')) {
                foundIssues.push({ line: i, message: 'Found FIXME comment.', severity: 'error' });
            }
            if (line.match(/\bvar\s+/)) {
                foundIssues.push({ line: i, message: 'Use "let" or "const" instead of "var".', severity: 'error' });
            }
            if (line.length > 80) {
                foundIssues.push({ line: i, message: 'Line exceeds 80 characters.', severity: 'warning' });
            }
        });

        setIssues(foundIssues);
        if (foundIssues.length === 0) {
            addToast('No issues found!', 'success');
        } else {
            addToast(`Found ${foundIssues.length} issues.`, 'warning');
        }
    };

    return (
        <div className="side-panel">
             <p className="reason-text">
                Static Analysis Tool. Scans for common code smells and style violations using heuristic pattern matching.
            </p>
             <div className="image-gen-control-group">
                <label>Source Code</label>
                <textarea value={code} onChange={e => setCode(e.target.value)} rows={8} className="vfs-path-input" style={{fontFamily: 'monospace'}}/>
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleScan}>Scan Code</button>
            </div>
            
            {issues.length > 0 && (
                <div className="command-log-list" style={{marginTop: '1rem'}}>
                    {issues.map((issue, idx) => (
                         <div key={idx} className={`command-log-item log-type-${issue.severity === 'error' ? 'error' : 'warning'}`}>
                            <span className="log-icon">{issue.severity === 'error' ? '❌' : '⚠️'}</span>
                            <span className="log-text">Line {issue.line}: {issue.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
