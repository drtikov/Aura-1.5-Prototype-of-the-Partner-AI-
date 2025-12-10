
// components/SelfAdaptationPanel.tsx
import React, { useState } from 'react';
import { useCoreState, useLocalization, useAuraDispatch, useLogsState } from '../context/AuraContext.tsx';

export const SelfAdaptationPanel = () => {
    const { selfAdaptationState } = useCoreState();
    const { performanceLogs } = useLogsState();
    const { t } = useLocalization();
    const { syscall, geminiAPI, addToast } = useAuraDispatch();
    const { expertVectors, activeAdaptation } = selfAdaptationState;
    const [isCalculating, setIsCalculating] = useState(false);

    const handleAdapt = async () => {
        if (performanceLogs.length < 5) {
            addToast("Not enough performance logs to adapt.", "warning");
            return;
        }
        setIsCalculating(true);
        try {
            const adaptation = await geminiAPI.deriveAdaptationVector(performanceLogs);
            if (adaptation && adaptation.weights) {
                 syscall('SELF_ADAPTATION/SET_ACTIVE', adaptation);
                 addToast("Self-adaptation complete.", "success");
            } else {
                 addToast("Failed to derive adaptation.", "error");
            }
        } catch(e) {
             addToast("Adaptation error: " + (e as Error).message, "error");
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="side-panel self-adaptation-panel">
            <div className="panel-subsection-title">{t('selfAdaptation_expertVectors')}</div>
            <div className="expert-vectors-list">
                {expertVectors.map(vector => (
                    <div key={vector.id} className="mod-log-item">
                        <div className="mod-log-header">
                            <span className="mod-log-type">{vector.name}</span>
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic'}}>{vector.description}</p>
                    </div>
                ))}
            </div>

             <div className="button-grid" style={{ margin: '1rem 0' }}>
                <button 
                    className="control-button" 
                    onClick={handleAdapt} 
                    disabled={isCalculating}
                >
                    {isCalculating ? 'Deriving Vector...' : 'Compute Adaptation Vector'}
                </button>
            </div>

            <div className="panel-subsection-title">{t('selfAdaptation_activeAdaptation')}</div>
            {activeAdaptation ? (
                <div className="active-adaptation-display">
                    <p className="reasoning-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <strong>{t('selfAdaptation_reasoning')}:</strong> "{activeAdaptation.reasoning}"
                    </p>
                    <div className="panel-subsection-title">{t('selfAdaptation_weights')}</div>
                    {Object.entries(activeAdaptation.weights).map(([name, value]: [string, any]) => (
                        <div key={name} className="state-item">
                            <label>{name}</label>
                            <div className="state-bar-container">
                                <div 
                                    className="state-bar" 
                                    style={{ 
                                        width: `${(value as number) * 100}%`,
                                        backgroundColor: 'var(--primary-color)' 
                                    }}
                                ></div>
                            </div>
                            <span>{((value as number) * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kg-placeholder">{t('selfAdaptation_noActive')}</div>
            )}
        </div>
    );
};
