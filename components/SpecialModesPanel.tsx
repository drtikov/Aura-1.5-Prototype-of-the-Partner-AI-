
// components/SpecialModesPanel.tsx
import React from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';

export const SpecialModesPanel = () => {
    const { t } = useLocalization();
    const modal = useModal();
    const { 
        handleTrip, 
        handleVisions, 
        handleSatori, 
        handleEvolveFromInsight, 
        syscall, 
        handleToggleVisualAnalysis, 
        isVisualAnalysisActive 
    } = useAuraDispatch();
    const { gankyilInsights, psychedelicIntegrationState, satoriState } = useCoreState();

    const unprocessedInsightsCount = gankyilInsights.insights.filter(i => !i.isProcessedForEvolution).length;

    const handleBranch = (prompt: string) => {
        syscall('MULTIVERSE/CREATE_BRANCH', { prompt });
    };

    return (
        <div className="side-panel">
             <div className="panel-subsection-title">{t('vision')}</div>
             <div className="button-grid" style={{marginBottom: '1.5rem'}}>
                <button
                    className={`control-button visual-sense ${isVisualAnalysisActive ? 'active' : ''}`}
                    onClick={handleToggleVisualAnalysis}
                >
                    {isVisualAnalysisActive ? t('visionDeactivate') : t('visionActivate')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('specialModes')}</div>
            <div className="button-grid">
                 <button className={`control-button mode-trip ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'trip' ? 'active' : ''}`} onClick={handleTrip} title={t('tip_trip')}>{t('trip')}</button>
                 <button className={`control-button mode-visions ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'visions' ? 'active' : ''}`} onClick={handleVisions} title={t('tip_visions')}>{t('visions')}</button>
                 <button className={`control-button mode-satori ${satoriState.isActive ? 'active' : ''}`} onClick={handleSatori} title={t('tip_satori')}>{t('satori')}</button>
                 <button className={`control-button mode-insight ${unprocessedInsightsCount > 0 ? 'has-new-insight' : ''}`} onClick={handleEvolveFromInsight} title={t('tip_insight')} disabled={unprocessedInsightsCount === 0}>{t('insight')}</button>
                 <button className="control-button mode-psi" onClick={() => modal.open('multiverseBranching', { onBranch: handleBranch, isProcessing: false })} title={t('tip_branch')}>{t('branch')}</button>
                 <button className="control-button mode-brainstorm" onClick={() => modal.open('brainstorm', {})} title={t('tip_brainstorm')}>{t('brainstorm')}</button>
            </div>
        </div>
    );
};
