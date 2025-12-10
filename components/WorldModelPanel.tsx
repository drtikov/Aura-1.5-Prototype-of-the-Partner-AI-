
// components/WorldModelPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { Sparkline } from './Sparkline';

export const WorldModelPanel = React.memo(() => {
    const { worldModelState: state } = useCoreState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();

    const errorHistoryData = state.predictionErrorHistory.map(e => e.magnitude);

    // Helper to get color based on surprise
    const getSurpriseColor = (mag: number) => {
        if (mag < 0.3) return 'var(--success-color)'; // Low surprise = good model
        if (mag < 0.7) return 'var(--warning-color)'; // Medium surprise = learning
        return 'var(--failure-color)'; // High surprise = model failure
    };

    const handleRecalibrate = () => {
        syscall('WORLD_MODEL/RECALIBRATE', {});
        addToast("World Model recalibrated. Error state reset.", "success");
    };

    return (
        <div className="side-panel world-model-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                The Active Inference Engine continuously minimizes "Free Energy" (Surprise) by comparing its expectations against reality. High surprise triggers learning (model revision).
            </p>

            <div className="panel-subsection-title">Active Inference State</div>
            
            <div className="state-item">
                <label>{t('worldModel_lastErrorMagnitude')}</label>
                <div className="state-bar-container">
                    <div 
                        className="state-bar prediction-error-bar" 
                        style={{ 
                            width: `${state.predictionError.magnitude * 100}%`,
                            backgroundColor: getSurpriseColor(state.predictionError.magnitude)
                        }}
                    ></div>
                </div>
                <span>{(state.predictionError.magnitude * 100).toFixed(1)}%</span>
            </div>

            {state.predictionError.magnitude > 0.01 && (
                 <div className="prediction-error-details" style={{ borderLeft: `3px solid ${getSurpriseColor(state.predictionError.magnitude)}`, background: 'rgba(255,255,255,0.05)', padding: '0.5rem', marginTop: '0.5rem' }}>
                    <p><strong>Source:</strong> {state.predictionError.source}</p>
                    <p><strong>Expectation:</strong> <em>"{state.predictionError.failedPrediction}"</em></p>
                    <p><strong>Reality:</strong> <em>"{state.predictionError.actualOutcome}"</em></p>
                </div>
            )}
            
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleRecalibrate}>
                    Recalibrate Model
                </button>
            </div>

             <div className="sentiment-sparkline-container" style={{ marginTop: '0.75rem' }}>
                <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem'}}>Surprisal History (Free Energy)</div>
                <Sparkline data={errorHistoryData} strokeColor="var(--failure-color)" height={35} />
            </div>


            <div className="panel-subsection-title">{t('worldModel_hierarchicalPredictions')}</div>
            
            <div className="prediction-item level-high">
                <div className="prediction-header">
                    <span>{t('worldModel_highLevel')}</span>
                    <span>{t('causalSelfModel_confidence')}: {(state.highLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.highLevelPrediction.content}
                </p>
            </div>

            <div className="prediction-item level-mid">
                <div className="prediction-header">
                    <span>{t('worldModel_midLevel')}</span>
                     <span>{t('causalSelfModel_confidence')}: {(state.midLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.midLevelPrediction.content}
                </p>
            </div>

             <div className="prediction-item level-low">
                <div className="prediction-header">
                    <span>{t('worldModel_lowLevel')}</span>
                     <span>{t('causalSelfModel_confidence')}: {(state.lowLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.lowLevelPrediction.content}
                </p>
            </div>
        </div>
    );
});
