
// components/RecursiveConsensusPanel.tsx
import React, { useState } from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { KernelTaskType } from '../types.ts';
import { SafeMarkdown } from './SafeMarkdown';

export const RecursiveConsensusPanel = () => {
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const { recursiveConsensusState } = useCoreState();
    const { status, goal, dialogue, convergenceScore, finalOutcome } = recursiveConsensusState;
    
    const [inputGoal, setInputGoal] = useState("Design a secure, zero-trust authentication system.");

    const handleStart = () => {
        if (!inputGoal.trim()) return;
        syscall('CONSENSUS/RESET', {});
        syscall('KERNEL/QUEUE_TASK', {
            id: `rc_${Date.now()}`,
            type: KernelTaskType.RUN_RECURSIVE_CONSENSUS,
            payload: { goal: inputGoal },
            timestamp: Date.now()
        });
        addToast("Recursive Consensus initiated.", "info");
    };
    
    const isRunning = status !== 'idle' && status !== 'consensus_reached' && status !== 'failed';

    return (
        <div className="side-panel recursive-consensus-panel">
            <p className="reason-text">
                The Recursive Consensus Engine simulates a game between a Proposer and a Rational Adversary. 
                Based on game theory, this adversarial loop forces the system to converge on a Nash Equilibrium solution—one that cannot be easily improved upon.
            </p>

            <div className="image-gen-control-group">
                <label>Problem Statement</label>
                <textarea 
                    value={inputGoal} 
                    onChange={e => setInputGoal(e.target.value)} 
                    rows={3}
                    disabled={isRunning}
                />
            </div>

            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button 
                    className="control-button" 
                    onClick={handleStart}
                    disabled={isRunning || !inputGoal.trim()}
                >
                    {isRunning ? 'Converging...' : 'Start Recursive Game'}
                </button>
            </div>

            {(status !== 'idle') && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div className="synaptic-metrics" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
                        <div className="metric-item">
                            <span className="metric-label">Status</span>
                            <span className="metric-value" style={{ textTransform: 'capitalize' }}>
                                {status.replace('_', ' ')}
                                {isRunning && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                            </span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Convergence</span>
                            <span className="metric-value" style={{ color: convergenceScore > 0.8 ? 'var(--success-color)' : 'var(--warning-color)' }}>
                                {(convergenceScore * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>

                    <div className="panel-subsection-title">Consensus Dialogue</div>
                    <div className="command-log-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {dialogue.map((turn, i) => (
                            <div 
                                key={i} 
                                className="rie-insight-item" 
                                style={{ 
                                    borderLeftColor: turn.speaker === 'Proposer' ? 'var(--primary-color)' : 'var(--failure-color)',
                                    background: turn.speaker === 'Proposer' ? 'rgba(0, 255, 255, 0.05)' : 'rgba(255, 0, 0, 0.05)'
                                }}
                            >
                                <div className="mod-log-header">
                                    <span className="mod-log-type">{turn.speaker}</span>
                                </div>
                                <div className="mod-log-description">
                                    <SafeMarkdown text={turn.content} />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {finalOutcome && (
                        <div style={{ marginTop: '1.5rem' }}>
                             <div className="panel-subsection-title">Final Nash Equilibrium Solution</div>
                             <div className="code-snippet-container" style={{ padding: '1rem', border: '1px solid var(--success-color)' }}>
                                 <SafeMarkdown text={finalOutcome} />
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
