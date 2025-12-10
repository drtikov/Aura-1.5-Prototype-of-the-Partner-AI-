
// components/CodemodRunnerPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const CodemodRunnerPanel = () => {
    const { t } = useLocalization();
    const { addToast } = useAuraDispatch();
    
    const [sourceCode, setSourceCode] = useState('const x = 1;\nvar y = 2;\nconsole.log("debug");');
    const [regexPattern, setRegexPattern] = useState('var\\s+');
    const [replacement, setReplacement] = useState('let ');
    const [flags, setFlags] = useState('g');
    const [result, setResult] = useState('');

    const handleRun = () => {
        try {
            const re = new RegExp(regexPattern, flags);
            const newCode = sourceCode.replace(re, replacement);
            setResult(newCode);
            addToast('Refactoring applied successfully.', 'success');
        } catch (e) {
            addToast(`Invalid Regex: ${(e as Error).message}`, 'error');
        }
    };

    return (
        <div className="side-panel">
            <p className="reason-text">
                Regex-based Refactoring Tool. Use regular expressions to batch replace patterns in code.
            </p>
            
            <div className="image-gen-control-group">
                <label>Source Code</label>
                <textarea value={sourceCode} onChange={e => setSourceCode(e.target.value)} rows={5} className="vfs-path-input" style={{fontFamily: 'monospace'}}/>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem'}}>
                 <div className="image-gen-control-group">
                    <label>Regex Pattern</label>
                    <input type="text" value={regexPattern} onChange={e => setRegexPattern(e.target.value)} className="vfs-path-input" style={{fontFamily: 'monospace'}}/>
                </div>
                 <div className="image-gen-control-group">
                    <label>Replacement</label>
                    <input type="text" value={replacement} onChange={e => setReplacement(e.target.value)} className="vfs-path-input" style={{fontFamily: 'monospace'}}/>
                </div>
                 <div className="image-gen-control-group">
                    <label>Flags</label>
                    <input type="text" value={flags} onChange={e => setFlags(e.target.value)} className="vfs-path-input" style={{fontFamily: 'monospace'}}/>
                </div>
            </div>

            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleRun}>Run Refactor</button>
            </div>

            {result && (
                <div style={{marginTop: '1rem'}}>
                    <div className="panel-subsection-title">Result</div>
                    <div className="code-snippet-container">
                        <pre><code>{result}</code></pre>
                    </div>
                </div>
            )}
        </div>
    );
};
