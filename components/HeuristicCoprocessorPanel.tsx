
// components/HeuristicCoprocessorPanel.tsx
import React from 'react';
import { useSystemState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { HeuristicCoprocessorConfig, Plugin, KernelTaskType } from '../types.ts';

export const HeuristicCoprocessorPanel = React.memo(() => {
    const { t } = useLocalization();
    const { heuristicCoprocessorState, pluginState } = useSystemState();
    const { syscall, addToast } = useAuraDispatch();
    const { log } = heuristicCoprocessorState || { log: [], cooldowns: {} };

    const coprocessors = pluginState.registry.filter(
        (p): p is Plugin & { heuristicCoprocessor: HeuristicCoprocessorConfig } => 
            p.type === 'HEURISTIC_COPROCESSOR' && p.status === 'enabled'
    );

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    const handleForceRun = (id: string, name: string) => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `force_run_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_HEURISTIC_COPROCESSORS,
            payload: { runOnce: id },
            timestamp: Date.now()
        });
        addToast(`Manual override dispatched for ${t(name)}.`, 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">
                Heuristic Coprocessors are fast, rule-based agents that run in the background to autonomously regulate Aura's state without needing slow, expensive LLM calls. They act like "closed-form solutions" for common internal state problems.
            </p>

            <div className="panel-subsection-title">Active Coprocessors</div>
            {coprocessors.map(plugin => (
                <div key={plugin.id} className="mod-log-item">
                    <div className="mod-log-header" style={{justifyContent: 'space-between'}}>
                        <span className="mod-log-type">{t(plugin.name)}</span>
                         <button 
                            className="control-button" 
                            onClick={() => handleForceRun(plugin.id, plugin.name)}
                            style={{padding: '0.2rem 0.5rem', fontSize: '0.7rem'}}
                        >
                            Force Run
                        </button>
                    </div>
                    <p className="mod-log-description" style={{fontStyle: 'italic'}}>{t(plugin.description)}</p>
                </div>
            ))}
            
            <div className="panel-subsection-title">Activation Log</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">No activations logged yet.</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">⚡</span>
                            <div className="log-text-group">
                                <span className="log-text">{t(coprocessors.find(c => c.id === entry.coprocessorId)?.name || entry.coprocessorId)}</span>
                                <span className="log-subtext">{entry.message}</span>
                            </div>
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});