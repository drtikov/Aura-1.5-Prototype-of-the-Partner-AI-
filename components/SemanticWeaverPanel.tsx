
// components/SemanticWeaverPanel.tsx
import React, { useState } from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { KernelTaskType } from '../types.ts';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

export const SemanticWeaverPanel = () => {
    const { semanticWeaverState } = useCoreState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const { isTrained, accuracy, log, modelJSON } = semanticWeaverState;
    const [isTraining, setIsTraining] = useState(false);

    const handleTrigger = () => {
        setIsTraining(true);
        syscall('KERNEL/QUEUE_TASK', {
            id: `weaver_${Date.now()}`,
            type: KernelTaskType.SEMANTIC_WEAVER_PULSE,
            payload: {},
            timestamp: Date.now()
        });
        addToast("Semantic Weaver consolidation triggered.", "info");
        // Reset button state after expected duration (simulated) or when log updates
        setTimeout(() => setIsTraining(false), 3000); 
    };
    
    let modelStats = null;
    try {
        if (modelJSON) modelStats = JSON.parse(modelJSON);
    } catch(e) {}

    return (
        <div className="side-panel semantic-weaver-panel">
            <p className="reason-text">{t('semantic_weaver_description')}</p>
            
            <div className="semantic-weaver-card">
                <div className="semantic-weaver-header">
                    <span className="semantic-weaver-name">{t('semantic_weaver_model_name')}</span>
                    {isTraining && <div className="spinner-small"></div>}
                </div>
                <p className="semantic-weaver-desc">{t('semantic_weaver_model_desc')}</p>
                <div className="semantic-weaver-metrics">
                    <div className="metric-item">
                        <span className="metric-label">{t('cogArchPanel_status')}</span>
                        <span className="metric-value" style={{color: isTraining ? 'var(--warning-color)' : (isTrained ? 'var(--success-color)' : 'var(--text-muted)')}}>
                            {isTraining ? 'Consolidating...' : (isTrained ? t('semantic_weaver_status_trained') : t('semantic_weaver_status_untrained'))}
                        </span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-label">{t('semantic_weaver_reconstruction_accuracy')}</span>
                         <div className="state-bar-container" title={`${(accuracy * 100).toFixed(1)}%`}>
                            <div className="state-bar accuracy-bar" style={{ width: `${accuracy * 100}%` }}></div>
                        </div>
                    </div>
                </div>
                
                {modelStats && (
                    <div className="model-stats-grid" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '0.75rem', gap: '0.5rem' }}>
                        <div>
                            <span style={{color: 'var(--text-muted)'}}>Arch:</span> {modelStats.architecture}
                        </div>
                        <div>
                            <span style={{color: 'var(--text-muted)'}}>Params:</span> {modelStats.parameters?.toLocaleString()}
                        </div>
                        <div>
                            <span style={{color: 'var(--text-muted)'}}>Layers:</span> {modelStats.layers}
                        </div>
                        <div>
                             <span style={{color: 'var(--text-muted)'}}>Loss:</span> {modelStats.last_loss}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="button-grid" style={{marginBottom: '1rem'}}>
                 <button className="control-button" onClick={handleTrigger} disabled={isTraining}>
                    {isTraining ? 'Weaving Knowledge...' : t('weaver_trigger')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('semantic_weaver_log')}</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">{t('semantic_weaver_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🕸️</span>
                            <span className="log-text">{entry.message}</span>
                            <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
