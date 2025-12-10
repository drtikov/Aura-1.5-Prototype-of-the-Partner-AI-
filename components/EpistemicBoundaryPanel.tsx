
// components/EpistemicBoundaryPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { KnownUnknown } from '../types';

export const EpistemicBoundaryPanel = React.memo(() => {
    const { knownUnknowns } = useCoreState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();

    const unexploredGaps = [...knownUnknowns]
        .filter(ku => ku.status === 'unexplored')
        .sort((a, b) => b.priority - a.priority);

    const handleInvestigate = (gap: KnownUnknown) => {
        syscall('UPDATE_KNOWN_UNKNOWN', { id: gap.id, updates: { status: 'exploring' } });
        syscall('PROMETHEUS/START_GUIDED_INQUIRY', { 
            sourceDomain: "Current Knowledge", 
            targetDomain: gap.question 
        });
        addToast(`Investigation initiated: ${gap.question}`, 'info');
    };

    return (
        <div className="side-panel epistemic-boundary-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('epistemic_description')}
            </p>
            <div className="panel-subsection-title">{t('epistemic_unexploredGaps')}</div>
            {unexploredGaps.length === 0 ? (
                <div className="kg-placeholder">{t('epistemic_noGaps')}</div>
            ) : (
                unexploredGaps.map(gap => (
                    <div key={gap.id} className="veto-log-item" style={{ borderLeftColor: 'var(--secondary-color)', background: 'rgba(255, 0, 255, 0.05)' }}>
                        <div className="causal-link-header" style={{ marginBottom: '0.25rem', alignItems: 'flex-start', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <span className="priority-score" title={t('epistemic_priority')}>
                                    P: {gap.priority.toFixed(2)}
                                </span>
                                <button 
                                    className="control-button" 
                                    style={{padding: '0.2rem 0.5rem', fontSize: '0.7rem'}}
                                    onClick={() => handleInvestigate(gap)}
                                >
                                    Investigate
                                </button>
                            </div>
                            <p className="veto-reason" style={{ fontStyle: 'italic', color: 'var(--text-color)', margin: 0 }}>
                                "{gap.question}"
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});
