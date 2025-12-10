
// components/MetacognitiveNexusPanel.tsx
import React, { useState } from 'react';
import { MetacognitiveLink, InternalState } from '../types';
import { useSystemState, useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

const CorrelationArrow = ({ correlation, t }: { correlation: number, t: (key: string, options?: any) => string }) => {
    if (correlation > 0.3) return <span style={{ color: 'var(--success-color)' }}>↑ {t('metaCausal_increase')}</span>;
    if (correlation < -0.3) return <span style={{ color: 'var(--failure-color)' }}>↓ {t('metaCausal_decrease')}</span>;
    return <span style={{ color: 'var(--text-muted)' }}>- {t('metaCausal_noEffect')}</span>;
};

// Simple Pearson correlation
const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    if (n === 0) return 0;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
};

export const MetacognitiveNexusPanel = React.memo(() => {
    const { metacognitiveCausalModel: model } = useSystemState();
    const { internalStateHistory } = useCoreState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const links = Object.values(model).sort((a, b) => (b as MetacognitiveLink).lastUpdated - (a as MetacognitiveLink).lastUpdated);

    const handleAnalysis = () => {
        setIsAnalyzing(true);
        
        if (internalStateHistory.length < 10) {
            addToast("Not enough history to analyze correlations.", "warning");
            setIsAnalyzing(false);
            return;
        }

        // Extract data series
        const loads = internalStateHistory.map(s => s.load);
        const happiness = internalStateHistory.map(s => s.happinessSignal);
        const uncertainty = internalStateHistory.map(s => s.uncertaintySignal);
        const mastery = internalStateHistory.map(s => s.masterySignal);
        const wisdom = internalStateHistory.map(s => s.wisdomSignal);

        // Analyze pairs
        const pairs = [
            { k1: 'load', v1: loads, k2: 'happinessSignal', v2: happiness },
            { k1: 'uncertaintySignal', v1: uncertainty, k2: 'masterySignal', v2: mastery },
            { k1: 'wisdomSignal', v1: wisdom, k2: 'happinessSignal', v2: happiness }
        ];

        let found = 0;
        pairs.forEach(pair => {
            const corr = calculateCorrelation(pair.v1, pair.v2);
            // Only log significant correlations
            if (Math.abs(corr) > 0.5) {
                syscall('SYSTEM/ADD_META_LINK', {
                    source: { key: pair.k1, condition: corr > 0 ? 'High' : 'High' }, // Simplified condition text
                    target: { key: pair.k2, metric: 'Value' },
                    correlation: corr,
                    observationCount: internalStateHistory.length
                });
                found++;
            }
        });

        if (found > 0) addToast(`Analysis complete. Discovered ${found} correlations.`, 'success');
        else addToast("Analysis complete. No strong correlations found yet.", "info");
        
        setIsAnalyzing(false);
    };

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('metaCausal_description')}
            </p>
            
            <div className="button-grid" style={{marginBottom: '1rem'}}>
                 <button className="control-button" onClick={handleAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? 'Analyzing History...' : 'Run Correlation Analysis'}
                </button>
            </div>

            {links.length === 0 ? (
                <div className="kg-placeholder">{t('metaCausal_placeholder')}</div>
            ) : (
                links.map(link => {
                    const typedLink = link as MetacognitiveLink;
                    return (
                        <div key={typedLink.id} className="causal-link source-rie" style={{ background: 'rgba(0, 255, 255, 0.05)' }}>
                            <div className="causal-link-header">
                                <span className="causal-cause" style={{color: 'var(--primary-color)'}}>
                                    {t('metaCausal_when')} {formatKey(typedLink.source.key)} {t('metaCausal_is')} {typedLink.source.condition}
                                </span>
                                <span className="causal-confidence" title={`${t('causalSelfModel_confidence')}: ${typedLink.correlation.toFixed(2)}`}>
                                    ({(typedLink.correlation * 100).toFixed(0)}%)
                                </span>
                            </div>
                            <div className="causal-effect">
                                <span className="causal-effect-arrow">→</span>
                                {t('metaCausal_performanceOf')} <strong style={{color: 'var(--accent-color)'}}>{formatKey(typedLink.target.key)}</strong>
                            </div>
                            <div className="causal-effect" style={{ marginTop: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                                <CorrelationArrow correlation={typedLink.correlation} t={t} />
                            </div>
                            <div className="causal-link-footer">
                                {t('metaCausal_basedOn', { count: typedLink.observationCount })}
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
});
