
// components/CoreControlPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization, useCoreState } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';

export const CoreControlPanel = () => {
    const { 
        isPaused, 
        handleTogglePause, 
        handleContemplate, 
        handleFantasy,
        handleCreativity,
        handleDream,
        handleMeditate,
        handleGaze,
        handleTimefocus,
        handleToggleIdleThought,
        handleCollaborate,
        handleExplainComponent,
        handleSendCommand
    } = useAuraDispatch();
    const { t } = useLocalization();
    const modal = useModal();
    const { isIdleThoughtEnabled, activeCognitiveMode, internalState } = useCoreState();

    const handleWhatIfAnalyze = (scenario: string) => {
        handleSendCommand(`Run a "What If" simulation for the scenario: ${scenario}`);
        modal.close();
    };

    const handleSearch = (query: string) => {
        handleSendCommand(`Search the web for: ${query}`);
        modal.close();
    };

    const handleSetGoal = (goal: string) => {
        handleSendCommand(`Set strategic goal: ${goal}`);
        modal.close();
    }

    return (
        <div className="side-panel">
            <div className="panel-group-title" style={{ marginTop: 0 }}>{t('coreActions')}</div>
            <div className="button-grid">
                <button className="control-button" onClick={handleContemplate} title={t('tip_introspect')}>{t('introspect')}</button>
                <button className="control-button" onClick={() => handleCollaborate()}>{t('collaborate')}</button>
                <button className="control-button" onClick={() => handleExplainComponent()}>{t('explainComponent')}</button>
                <button className="control-button" onClick={() => modal.open('whatIf', { onAnalyze: handleWhatIfAnalyze, isProcessing: false })} title={t('tip_whatIf')}>{t('whatIf')}</button>
                <button className="control-button" onClick={() => modal.open('search', { onSearch: handleSearch, isProcessing: false })} title={t('tip_search')}>{t('search')}</button>
                <button className="control-button" onClick={() => modal.open('strategicGoal', { onSetGoal: handleSetGoal })} title={t('tip_setGoal')}>{t('setGoal')}</button>
                <button className="control-button" onClick={() => modal.open('forecast', { state: internalState })} title={t('tip_forecast')}>{t('forecast')}</button>
                <button
                    className={`control-button visual-sense ${isIdleThoughtEnabled ? 'active' : ''}`}
                    onClick={handleToggleIdleThought}
                    title={isIdleThoughtEnabled ? 'Disable Aura\'s idle thoughts' : 'Enable Aura to post thoughts when idle'}
                >
                    {isIdleThoughtEnabled ? 'Thoughts On' : 'Thoughts Off'}
                </button>
                <button className={`control-button pause-button ${isPaused ? 'paused' : ''}`} onClick={handleTogglePause} title={isPaused ? t('tip_resume') : t('tip_pause')}>
                    {isPaused ? t('resume') : t('pause')}
                </button>
            </div>
            
            <div className="panel-group-title">{t('cognitiveModes')}</div>
            <div className="button-grid">
                <button className={`control-button mode-fantasy ${activeCognitiveMode === 'fantasy' ? 'active' : ''}`} onClick={handleFantasy}>{t('fantasy')}</button>
                <button className={`control-button mode-creativity ${activeCognitiveMode === 'creativity' ? 'active' : ''}`} onClick={handleCreativity}>{t('creativity')}</button>
                <button className={`control-button mode-dream ${activeCognitiveMode === 'dream' ? 'active' : ''}`} onClick={handleDream}>{t('dream')}</button>
                <button className={`control-button mode-meditate ${activeCognitiveMode === 'meditate' ? 'active' : ''}`} onClick={handleMeditate}>{t('meditate')}</button>
                <button className={`control-button mode-gaze ${activeCognitiveMode === 'gaze' ? 'active' : ''}`} onClick={handleGaze}>{t('gaze')}</button>
                <button className={`control-button mode-timefocus ${activeCognitiveMode === 'timefocus' ? 'active' : ''}`} onClick={handleTimefocus}>{t('timefocus')}</button>
            </div>
        </div>
    );
};
