
// components/SubsumptionLogPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext.tsx';

export const SubsumptionLogPanel = React.memo(() => {
    const { subsumptionLogState } = useLogsState();
    const { t } = useLocalization();
    const { log } = subsumptionLogState;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s`;
        return `${Math.floor(seconds / 60)}m`;
    };

    return (
        <div className="side-panel">
            {log.length === 0 ? (
                <div className="kg-placeholder">{t('subsumptionLog_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {log.map((entry, index) => (
                        <div key={index} className="command-log-item log-type-warning" style={{ borderLeftColor: 'var(--secondary-color)' }}>
                            <span className="log-icon" title="Subsumption Layer Event">⚡</span>
                            <span className="log-text">{entry.message}</span>
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
