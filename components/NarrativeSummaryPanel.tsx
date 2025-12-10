
// components/NarrativeSummaryPanel.tsx
import React, { useState } from 'react';
import { useCoreState, useLocalization, useAuraDispatch, useLogsState } from '../context/AuraContext.tsx';

export const NarrativeSummaryPanel = React.memo(() => {
    const { narrativeSummary } = useCoreState();
    const { history } = useLogsState();
    const { addToast, geminiAPI, syscall } = useAuraDispatch();
    const { t } = useLocalization();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(narrativeSummary).then(() => {
            addToast(t('narrativeSummary_copied'), 'success');
        }, () => {
            addToast(t('narrativeSummary_copyFailed'), 'error');
        });
    };
    
    const handleGenerate = async () => {
        if (history.length === 0) {
            addToast("History is empty. Nothing to summarize.", "warning");
            return;
        }
        setIsGenerating(true);
        try {
            const recentHistory = history.slice(-20).map(h => `${h.from}: ${h.text}`).join('\n');
            const summary = await geminiAPI.summarizeText(recentHistory);
            syscall('UPDATE_NARRATIVE_SUMMARY', summary);
            addToast("Narrative summary updated.", "success");
        } catch (e) {
            addToast(`Summary generation failed: ${(e as Error).message}`, "error");
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="standalone-panel">
            <div className="panel-group-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span>{t('narrativeSummary_title')}</span>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button 
                        className="copy-snippet-button" 
                        onClick={handleGenerate}
                        title="Generate New Summary"
                        style={{ position: 'static', width: '28px', height: '28px' }}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <div className="spinner-small" /> : '🔄'}
                    </button>
                    <button 
                        className="copy-snippet-button" 
                        onClick={handleCopy}
                        title={t('narrativeSummary_copy')}
                        style={{ position: 'static', width: '28px', height: '28px' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </button>
                </div>
            </div>
            <p className="reason-text" style={{fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)'}}>
                {narrativeSummary || t('narrativeSummary_placeholder')}
            </p>
        </div>
    );
});
