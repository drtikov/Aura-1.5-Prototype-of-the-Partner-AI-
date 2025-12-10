// components/controlDeckComponent.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { ManualControlPanel } from './ManualControlPanel.tsx';
import { useModal } from '../context/ModalContext.tsx';
import { LocalizationPanel } from './LocalizationPanel.tsx';

const _ControlDeckComponent: React.FC = () => {
    const { t } = useLocalization();
    const modal = useModal();

    return (
        <div className="control-deck-container">
            <div className="control-deck-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                    <ThemeSwitcher />
                    <LocalizationPanel />
                </div>

                <div className="panel-group-header">{t('auraOS_header')}</div>
                <div className="button-grid" style={{gridTemplateColumns: '1fr'}}>
                    <button className="control-button advanced-module-button" onClick={() => modal.open('auraOS', {})}>
                        <span className="advanced-module-header">{t('auraOS_title')}</span>
                        <span className="advanced-module-summary">{t('auraOS_summary')}</span>
                    </button>
                </div>

                <ManualControlPanel />
            </div>
        </div>
    );
};

export const ControlDeckComponent = React.memo(_ControlDeckComponent);