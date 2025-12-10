
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch, useLogsState } from '../context/AuraContext.tsx';
import { SocialGraphNode } from '../types.ts';

export const SocialCognitionPanel = React.memo(() => {
    const { socialCognitionState } = useCoreState();
    const { history } = useLogsState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const { socialGraph, culturalModel } = socialCognitionState;
    const nodes = Object.values(socialGraph);

    const handleUpdateCulturalModel = () => {
        // Heuristic Analysis of History to update norms/values
        const userEntries = history.filter(h => h.from === 'user').map(h => h.text || '');
        const botEntries = history.filter(h => h.from === 'bot').map(h => h.text || '');
        
        const newNorms = [...culturalModel.norms];
        const newValues = [...culturalModel.values];
        const newIdioms = [...culturalModel.idioms];

        // 1. Check for politeness
        const politenessCount = userEntries.filter(t => t.toLowerCase().includes('please') || t.toLowerCase().includes('thank')).length;
        if (politenessCount > userEntries.length * 0.3) {
            if (!newNorms.includes("Politeness")) newNorms.push("Politeness");
        }
        
        // 2. Check for Brevity
        const avgLength = userEntries.reduce((acc, t) => acc + t.length, 0) / (userEntries.length || 1);
        if (avgLength < 20) {
             if (!newValues.includes("Efficiency")) newValues.push("Efficiency");
        } else {
             if (!newValues.includes("Detail-Oriented")) newValues.push("Detail-Oriented");
        }

        // 3. Check for Technical focus
        const techKeywords = ['code', 'function', 'react', 'typescript', 'bug', 'error'];
        const techCount = userEntries.filter(t => techKeywords.some(k => t.toLowerCase().includes(k))).length;
        if (techCount > 0) {
             if (!newValues.includes("Technical Proficiency")) newValues.push("Technical Proficiency");
        }

        syscall('SOCIAL/UPDATE_CULTURAL_MODEL', {
             norms: newNorms,
             values: newValues,
             idioms: newIdioms
        });
        addToast('Cultural model updated based on interaction history.', 'success');
    };

    return (
        <div className="side-panel social-cognition-panel">
            <div className="panel-subsection-title">{t('social_graph')}</div>
            {nodes.length === 0 ? (
                <div className="kg-placeholder">{t('social_noNodes')}</div>
            ) : (
                nodes.map((node: SocialGraphNode) => (
                    <div key={node.id} className="mod-log-item" style={{ marginBottom: '0.5rem' }}>
                        <div className="mod-log-header">
                            <span className="mod-log-type">{node.name}</span>
                            <span className="mod-log-status">{node.type}</span>
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic'}}>"{node.summary}"</p>
                        {node.relationships.length > 0 && (
                            <div className="relationships-list" style={{marginTop: '0.5rem'}}>
                                <strong>{t('social_relationships')}:</strong>
                                {node.relationships.map((rel, i) => (
                                    <span key={i} className="skill-tag">{rel.type}: {rel.targetId} ({(rel.strength * 100).toFixed(0)}%)</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
            
            <div className="panel-subsection-title">{t('social_culturalModel')}</div>
            <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button className="control-button" onClick={handleUpdateCulturalModel}>
                    {t('social_update_culture', { defaultValue: 'Analyze Cultural Norms' })}
                </button>
            </div>

            <div className="cultural-model-display" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                <p><strong>{t('social_norms')}:</strong> {culturalModel.norms.join(', ') || 'N/A'}</p>
                <p><strong>{t('social_values')}:</strong> {culturalModel.values.join(', ') || 'N/A'}</p>
                <p><strong>{t('social_idioms')}:</strong> {culturalModel.idioms.join(', ') || 'N/A'}</p>
            </div>
        </div>
    );
});
