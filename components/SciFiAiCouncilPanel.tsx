
// components/SciFiAiCouncilPanel.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';
import { personas } from '../state/personas.ts';

const specialistIds = [
    'isaac_asimov',
    'philip_k_dick',
    'arthur_c_clarke',
    'william_gibson',
    'stanislaw_lem',
    'iain_m_banks',
    'greg_egan',
    'ted_chiang'
];

export const SciFiAiCouncilPanel = () => {
    const { t } = useLocalization();
    const modal = useModal();

    const specialists = personas.filter(p => specialistIds.includes(p.id));

    const handleConsult = () => {
        modal.open('brainstorm', { 
            initialTopic: "Speculative Future: ",
            personas: specialists 
        });
    };

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('sciFiAiCouncil_description')}
            </p>

            <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button className="control-button" onClick={handleConsult}>
                    {t('consult_council', { defaultValue: 'Convened Council' })}
                </button>
            </div>

            <div className="panel-subsection-title">{t('sciFiAiCouncil_members')}</div>
            <div className="personas-container">
                {specialists.map(specialist => (
                    <div key={specialist.id} className="persona-item">
                        <div className="persona-header">
                            <span className="persona-name">{t(`personality_${specialist.id}_name`)}</span>
                        </div>
                        <p className="persona-desc">{t(`personality_${specialist.id}_desc`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
