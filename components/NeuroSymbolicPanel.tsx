
// components/NeuroSymbolicPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { KernelTaskType } from '../types.ts';
import { Accordion } from './Accordion';
import { SafeMarkdown } from './SafeMarkdown';

export const NeuroSymbolicPanel = () => {
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const { neuroSymbolicState } = useCoreState();
    const { status, lastQuery, generatedProlog, result, knowledgeBase } = neuroSymbolicState;
    
    const [input, setInput] = useState("All humans are mortal. Socrates is a human. Is Socrates mortal?");

    const handleTranslateAndSolve = () => {
        if (!input.trim()) return;
        
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_ns_${Date.now()}`,
            type: KernelTaskType.TRANSLATE_TO_LOGIC,
            payload: { input: input.trim() },
            timestamp: Date.now()
        });
        
        syscall('LOGIC/UPDATE_STATE', { status: 'translating', lastQuery: input });
    };
    
    const handleClearKB = () => {
        syscall('LOGIC/UPDATE_STATE', { knowledgeBase: [] });
        addToast("Knowledge Base cleared.", "info");
    };

    return (
        <div className="side-panel">
            <p className="reason-text">
                The Neuro-Symbolic Architect combines the linguistic flexibility of LLMs with the rigorous logical deduction of Prolog. Enter natural language facts and questions below.
            </p>
            
            <div className="image-gen-control-group">
                <label>Natural Language Input</label>
                <textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    placeholder="e.g., Socrates is a man. All men are mortal. Is Socrates mortal?"
                    rows={4}
                    disabled={status === 'translating' || status === 'solving'}
                />
            </div>
            
            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button 
                    className="control-button" 
                    onClick={handleTranslateAndSolve}
                    disabled={status === 'translating' || status === 'solving' || !input.trim()}
                >
                    {status === 'translating' ? 'Translating...' : status === 'solving' ? 'Solving...' : 'Translate & Solve'}
                </button>
            </div>
            
            {(generatedProlog || result) && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div className="panel-subsection-title">Logical Execution</div>
                    
                    {generatedProlog && (
                         <div className="code-snippet-container" style={{marginBottom: '1rem'}}>
                            <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.2rem'}}>Generated Prolog</div>
                            <pre><code>{generatedProlog}</code></pre>
                        </div>
                    )}
                    
                    {result && (
                        <div className="rie-insight-item" style={{ borderLeftColor: result.includes('true') ? 'var(--success-color)' : 'var(--failure-color)' }}>
                            <div className="mod-log-header">
                                <span className="mod-log-type">Result</span>
                            </div>
                            <p className="mod-log-description" style={{ fontWeight: 'bold', fontSize: '1rem' }}>{result}</p>
                        </div>
                    )}
                </div>
            )}
            
            <Accordion title={`Active Knowledge Base (${knowledgeBase.length})`} defaultOpen={false}>
                {knowledgeBase.length === 0 ? (
                    <div className="kg-placeholder">Knowledge base is empty.</div>
                ) : (
                    <div className="vfs-content-viewer" style={{maxHeight: '200px'}}>
                        <pre><code>{knowledgeBase.join('\n')}</code></pre>
                    </div>
                )}
                 <div className="button-grid" style={{marginTop: '0.5rem'}}>
                    <button className="control-button reject-button" onClick={handleClearKB}>Clear KB</button>
                </div>
            </Accordion>
        </div>
    );
};
