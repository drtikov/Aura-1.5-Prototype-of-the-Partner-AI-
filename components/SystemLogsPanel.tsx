
// components/SystemLogsPanel.tsx
import React from 'react';
import { Accordion } from './Accordion';
import { PerformanceLogPanel } from './PerformanceLogPanel';
import { CommandLogPanel } from './CommandLogPanel';
import { CognitiveModesPanel } from './CognitiveModesPanel';
import { CognitiveGainPanel } from './CognitiveGainPanel';
import { SubsumptionLogPanel } from './SubsumptionLogPanel';
import { useAuraDispatch, useLogsState, useLocalization } from '../context/AuraContext';
import { HAL } from '../core/hal';

export const SystemLogsPanel = () => {
    const { syscall, addToast } = useAuraDispatch();
    const { performanceLogs, commandLog, cognitiveModeLog, cognitiveGainLog, subsumptionLogState } = useLogsState();
    const { t } = useLocalization();

    const handleExportLogs = () => {
        const logs = {
            timestamp: new Date().toISOString(),
            performanceLogs,
            commandLog,
            cognitiveModeLog,
            cognitiveGainLog,
            subsumptionLog: subsumptionLogState.log
        };
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aura-logs-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addToast("Logs exported successfully.", "success");
    };

    const handleClearLogs = () => {
        if (HAL.UI.confirm("Are you sure you want to purge all system logs? This action cannot be undone.")) {
            syscall('LOGS/CLEAR', {});
            addToast("All system logs purged.", "info");
        }
    };

    return (
        <div className="side-panel">
            <div className="button-grid" style={{ marginBottom: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <button className="control-button" onClick={handleExportLogs}>
                    Export Logs
                </button>
                <button className="control-button reject-button" onClick={handleClearLogs}>
                    Purge Logs
                </button>
            </div>

            <Accordion title="Performance Log" defaultOpen>
                <PerformanceLogPanel />
            </Accordion>
            <Accordion title="Command Log">
                <CommandLogPanel />
            </Accordion>
            <Accordion title="Subsumption Events">
                <SubsumptionLogPanel />
            </Accordion>
            <Accordion title="Cognitive Mode Log">
                <CognitiveModesPanel />
            </Accordion>
            <Accordion title="Cognitive Gain Log">
                <CognitiveGainPanel />
            </Accordion>
        </div>
    );
};
