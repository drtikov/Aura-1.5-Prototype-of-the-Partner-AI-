// components/HostBridgePanel.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { HostBridge } from '../core/hostBridge';
import { InfoPanel, InfoItem } from './InfoPanel.tsx';

export const HostBridgePanel = React.memo(() => {
    const { t } = useLocalization();
    const isConnected = HostBridge.isHostConnected();

    const items: InfoItem[] = [
        { type: 'metric', label: t('hostBridge_status'), value: isConnected ? t('hostBridge_connected') : t('hostBridge_disconnected') },
        { type: 'text', content: isConnected ? t('hostBridge_connected_desc') : t('hostBridge_disconnected_desc') }
    ];

    return <InfoPanel items={items} />;
});
