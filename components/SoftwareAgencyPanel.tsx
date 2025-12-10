
// components/SoftwareAgencyPanel.tsx
import React, { useState } from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';
import { personas } from '../state/personas.ts';

const specialistIds = [
    'strategist',
    'programmer',
    'coder',
    'tester',
    'ux_designer',
    'code_archaeologist',
    'cloud_engineer'
];

export const SoftwareAgencyPanel = () => {
    const { t } = useLocalization();
    const modal = useModal();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const specialists = personas.filter(p => specialistIds.includes(p.id));

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleConsult = () => {
        const targetPersonas = selectedIds.size > 0 
            ? specialists.filter(p => selectedIds.has(p.id))
            : specialists;

        modal.open('brainstorm', { 
            initialTopic: "Software Architecture: ",
            personas: targetPersonas 
        });
    };

    return (
        <div className="side-panel software-agency-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('software_agency_description')}
            </p>

            <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button 
                    className="control-button" 
                    onClick={handleConsult}
                    disabled={specialists.length === 0}
                >
                    {selectedIds.size > 0 
                        ? t('consult_selected_specialists', { count: selectedIds.size, defaultValue: `Consult Selected (${selectedIds.size})` }) 
                        : t('consult_full_agency', { defaultValue: 'Consult Full Agency' })}
                </button>
            </div>

            <div className="panel-subsection-title">{t('software_agency_members')}</div>
            <div className="personas-container">
                {specialists.map(specialist => {
                    const isSelected = selectedIds.has(specialist.id);
                    return (
                        <div 
                            key={specialist.id} 
                            className={`persona-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSelection(specialist.id)}
                            style={{ 
                                cursor: 'pointer',
                                borderColor: isSelected ? 'var(--primary-color)' : 'var(--border-color)',
                                backgroundColor: isSelected ? 'rgba(0, 255, 255, 0.05)' : 'transparent'
                            }}
                        >
                            <div className="persona-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="checkbox-indicator" style={{
                                        width: '12px', height: '12px', 
                                        borderRadius: '2px', 
                                        border: '1px solid var(--text-muted)',
                                        background: isSelected ? 'var(--primary-color)' : 'transparent'
                                    }}></span>
                                    <span className="persona-name">{t(`personality_${specialist.id}_name`)}</span>
                                </div>
                            </div>
                            <p className="persona-desc">{t(`personality_${specialist.id}_desc`)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
