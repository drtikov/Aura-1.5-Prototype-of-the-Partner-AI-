
// components/LyceumPanel.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';
import { personas } from '../state/personas';

const specialistIds = ['historian', 'ethicist', 'literary_critic', 'organizational_psychologist'];

export const LyceumPanel = () => {
    const { t } = useLocalization();
    const modal = useModal();

    const specialists = personas.filter(p => specialistIds.includes(p.id));

    const handleConsult = () => {
        modal.open('brainstorm', { 
            initialTopic: "Philosophical Inquiry: ",
            personas: specialists 
        });
    };

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('lyceum_description')}
            </p>

            <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button className="control-button" onClick={handleConsult}>
                    {t('consult_lyceum', { defaultValue: 'Consult Lyceum' })}
                </button>
            </div>

            <div className="panel-subsection-title">{t('agencyOfCoCreation_specialists')}</div>
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
