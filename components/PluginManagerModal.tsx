

// components/PluginManagerModal.tsx
import React from 'react';
import { Modal } from './Modal.tsx';
import { PluginManagerPanel } from './PluginManagerPanel.tsx';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useLocalization } from '../context/AuraContext.tsx';

interface PluginManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PluginManagerModal = ({ isOpen, onClose }: PluginManagerModalProps) => {
    const { t } = useLocalization();

    // Use 'pluginManager' which is usually defined in localization as "Plugin Manager"
    // If it falls back to key, fallback to a clean string
    let title = t('pluginManager');
    if (title === 'pluginManager') {
        title = 'Plugin Manager';
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="advanced-controls-modal" // Re-use this class for a larger modal
        >
            <div className="advanced-controls-content">
                <PluginManagerPanel />
            </div>
        </Modal>
    );
};
