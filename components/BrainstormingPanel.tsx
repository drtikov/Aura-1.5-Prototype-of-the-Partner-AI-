
// components/BrainstormingPanel.tsx
import React, { useMemo } from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { BrainstormIdea } from '../types';
import { HAL } from '../core/hal';
import { SafeMarkdown } from './SafeMarkdown.tsx';

export const BrainstormingPanel = () => {
    const { brainstormState } = useCoreState();
    const { t } = useLocalization();
    const { addToast } = useAuraDispatch();
    const { status, topic, ideas, winningIdea } = brainstormState;

    const uniqueParticipants = useMemo(() => {
        return Array.from(new Set(ideas.map(i => i.personaName)));
    }, [ideas]);

    const handleCopyAll = () => {
        if (!topic && ideas.length === 0) return;

        let fullText = `Brainstorming Session\n`;
        fullText += `Topic: ${topic}\n\n`;
        fullText += `--- PARTICIPANTS ---\n${uniqueParticipants.join(', ')}\n\n`;
        fullText += `--- IDEAS ---\n\n`;
        ideas.forEach(idea => {
            fullText += `${idea.personaName}:\n${idea.idea}\n\n`;
        });

        if (winningIdea) {
            fullText += `--- WINNING IDEA ---\n\n${winningIdea}\n`;
        }

        HAL.Clipboard.writeText(fullText.trim()).then(() => {
            addToast(t('brainstorm_copy_all_success'), 'success');
        }, () => {
            addToast(t('brainstorm_copy_all_failed'), 'error');
        });
    };

    if (status === 'idle') {
        return (
            <div className="side-panel">
                <div className="kg-placeholder">{t('brainstorm_idle')}</div>
            </div>
        );
    }
    
    return (
        <div className="side-panel brainstorming-panel">
            {(ideas.length > 0 || winningIdea) && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button className="control-button" onClick={handleCopyAll} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                        {t('brainstorm_copy_all')}
                    </button>
                </div>
            )}

            <div className="awareness-item">
                <label>{t('brainstorm_status')}</label>
                <strong className={`status-${status}`}>{status}</strong>
            </div>
            
            <div className="panel-subsection-title">{t('brainstorm_topic')}</div>
            <p className="reason-text"><em>"{topic}"</em></p>

            {uniqueParticipants.length > 0 && (
                <>
                    <div className="panel-subsection-title">Council of Innovators</div>
                    <ul className="ignored-list" style={{ marginBottom: '1rem' }}>
                        {uniqueParticipants.map(name => (
                            <li key={name} style={{ textDecoration: 'none', padding: '0.1rem 0' }}>• {name}</li>
                        ))}
                    </ul>
                </>
            )}

            <div className="panel-subsection-title">{t('brainstorm_ideas')}</div>
            {ideas.length === 0 && status === 'brainstorming' && (
                <div className="generating-indicator">
                    <div className="spinner-small" />
                    <span>{t('brainstorm_generating_ideas')}</span>
                </div>
            )}
            {ideas.map((idea: BrainstormIdea, index: number) => (
                <div key={index} className={`axiom-card ${idea.idea === winningIdea ? 'accepted' : ''}`}>
                    <div className="mod-log-header">
                        <span className="mod-log-type">{idea.personaName}</span>
                    </div>
                    <p className="axiom-card-text" style={{ fontStyle: 'normal' }}>{idea.idea}</p>
                </div>
            ))}

            {winningIdea && (
                <>
                    <div className="panel-subsection-title">{t('brainstorm_winner')}</div>
                     <div className="axiom-card accepted">
                        <div className="mod-log-header">
                            <span className="mod-log-type">{t('brainstorm_winner')}</span>
                        </div>
                        <div className="axiom-card-text">
                            <SafeMarkdown text={winningIdea} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
