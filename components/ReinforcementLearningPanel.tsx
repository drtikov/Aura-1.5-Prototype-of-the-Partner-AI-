
// components/ReinforcementLearningPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { SynthesizedSkill, DesignHeuristic } from '../types';

export const ReinforcementLearningPanel = React.memo(() => {
    const { cognitiveForgeState, heuristicsForge } = useArchitectureState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();

    const { synthesizedSkills } = cognitiveForgeState;
    const { designHeuristics } = heuristicsForge;

    // Helper to make skill names readable (e.g., SYNTH_SEARCH_AND_SUMMARIZE -> Search And Summarize)
    const formatSkillName = (name: string) => {
        return name
            .replace(/^(SYNTHESIZE_|SYNTH_)/, '')
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    // Color scale for Trust Score (0.1 to 2.0)
    const getWeightColor = (weight: number) => {
        if (weight >= 1.5) return 'var(--success-color)'; // High trust
        if (weight >= 1.0) return 'var(--primary-color)'; // Neutral/Good
        if (weight >= 0.8) return 'var(--warning-color)'; // Uncertain
        return 'var(--failure-color)'; // Low trust
    };

    const handleReinforce = (skillId: string, adjustment: number) => {
        syscall('MANUAL_REINFORCE_SKILL', { skillId, adjustment });
        const type = adjustment > 0 ? 'success' : 'warning';
        const msg = adjustment > 0 ? 'Trust increased (+)' : 'Trust decreased (-)';
        addToast(msg, type);
    };

    const getValidationColor = (status: string) => {
        if (status === 'validated') return 'var(--success-color)';
        if (status === 'refuted') return 'var(--failure-color)';
        return 'var(--text-muted)';
    };

    return (
        <div className="side-panel reinforcement-learning-panel">
            <p className="reason-text" style={{marginBottom: '1.5rem'}}>
                {t('rl_description', { defaultValue: "Manage the AI's automated habits and strategic rules. Adjust the 'Trust Score' to control how often a reflex is used." })}
            </p>

            <div className="panel-subsection-title">{t('rl_synthesizedSkills', { defaultValue: "Learned Reflexes" })}</div>
            {synthesizedSkills.length > 0 ? (
                synthesizedSkills.map((skill: SynthesizedSkill) => (
                    <div key={skill.id} className="state-item" style={{ alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ flexGrow: 1 }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-color)' }} title={skill.description}>
                                {formatSkillName(skill.name)}
                            </label>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                {skill.description}
                            </p>
                            <div className="state-bar-container" title={`${t('rl_policyWeight', { defaultValue: "Trust Score" })}: ${skill.policyWeight.toFixed(2)}`}>
                                <div
                                    className="state-bar"
                                    style={{
                                        width: `${Math.min((skill.policyWeight / 2) * 100, 100)}%`,
                                        backgroundColor: getWeightColor(skill.policyWeight)
                                    }}
                                ></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                                <span>Low Trust</span>
                                <span>High Trust</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginLeft: '1rem' }}>
                            <button 
                                className="control-button" 
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderColor: 'var(--success-color)', color: 'var(--success-color)' }}
                                onClick={() => handleReinforce(skill.id, 0.1)} 
                                title="Increase Trust"
                            >
                                Trust +
                            </button>
                            <button 
                                className="control-button" 
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderColor: 'var(--failure-color)', color: 'var(--failure-color)' }}
                                onClick={() => handleReinforce(skill.id, -0.1)} 
                                title="Doubt"
                            >
                                Doubt -
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="kg-placeholder">{t('rl_noSynthesizedSkills', { defaultValue: "No reflexes learned yet. Repetitive actions will be crystallized here automatically." })}</div>
            )}
            
            <div className="panel-subsection-title" style={{marginTop: '1.5rem'}}>{t('rl_designHeuristics', { defaultValue: "Strategic Principles" })}</div>
            {designHeuristics.length > 0 ? (
                 <div className="axiom-list" style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {designHeuristics.map((h: DesignHeuristic, i: number) => (
                        <div key={i} className="axiom-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem' }}>
                             <span className="axiom-item-text" style={{ fontStyle: 'italic' }}>
                                "{h.heuristic}"
                             </span>
                             <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', width: '100%' }}>
                                <span style={{ color: getValidationColor(h.validationStatus), fontWeight: 'bold', textTransform: 'uppercase' }}>
                                     {h.validationStatus}
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>
                                    Confidence: {(h.confidence * 100).toFixed(0)}%
                                </span>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kg-placeholder">{t('rl_noHeuristics', { defaultValue: "No strategic principles extracted yet." })}</div>
            )}
        </div>
    );
});
