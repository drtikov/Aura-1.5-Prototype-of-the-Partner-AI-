
// components/MycelialNetworkPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { MycelialModule, KernelTaskType } from '../types.ts';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

const ModuleCard = React.memo(({ module }: { module: MycelialModule }) => {
    const { name, description, accuracy, lastPrediction, modelJSON } = module;
    
    let stats = { factCount: 0, connectionCount: 0, topic: 'Unknown' };
    try {
        if (modelJSON) stats = JSON.parse(modelJSON);
    } catch (e) {
        // Fallback if JSON is invalid
    }

    return (
        <div className="mycelial-module-card">
            <div className="mycelial-module-header">
                <span className="mycelial-module-name">{name}</span>
                <span className="mod-log-status" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                     {new Date(lastPrediction).toLocaleTimeString()}
                </span>
            </div>
            <p className="mycelial-module-desc">{description}</p>
            
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                 <div className="metric-item">
                    <span className="metric-label">Facts</span>
                    <span className="metric-value">{stats.factCount || 0}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">Links</span>
                    <span className="metric-value">{stats.connectionCount || 0}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Coherence</span>
                    <span className="metric-value">{(accuracy * 100).toFixed(0)}%</span>
                </div>
            </div>
            
             <div className="state-bar-container" style={{ marginTop: '0.5rem' }} title={`Cluster Coherence: ${(accuracy * 100).toFixed(1)}%`}>
                <div className="state-bar accuracy-bar" style={{ width: `${accuracy * 100}%` }}></div>
            </div>
        </div>
    );
});

export const MycelialNetworkPanel = () => {
    const { mycelialState } = useCoreState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const { modules, log } = mycelialState;

    const handlePulse = () => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `mycelial_${Date.now()}`,
            type: KernelTaskType.MYCELIAL_PULSE,
            payload: {},
            timestamp: Date.now()
        });
        addToast(t('mycelial_pulse_toast'), "info");
    };

    return (
        <div className="side-panel mycelial-network-panel">
            <p className="reason-text">{t('mycelial_description')}</p>
            
            <div className="button-grid" style={{marginBottom: '1rem'}}>
                 <button className="control-button" onClick={handlePulse}>
                    {t('mycelial_pulse')}
                </button>
            </div>
            
            <div className="panel-subsection-title">{t('mycelial_modules')}</div>
            
            {Object.keys(modules).length === 0 ? (
                <div className="kg-placeholder">{t('mycelial_noModules')}</div>
            ) : (
                Object.values(modules).map((module: MycelialModule, index) => (
                    <ModuleCard key={index} module={module} />
                ))
            )}

            <div className="panel-subsection-title">{t('mycelial_log')}</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">{t('mycelial_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🍄</span>
                            <span className="log-text">{entry.message}</span>
                            <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
