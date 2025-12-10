
// components/HomeostaticPanel.tsx
import React from 'react';
import { useSystemState, useLocalization, useLogsState, useAuraDispatch } from '../context/AuraContext.tsx';

export const HomeostaticPanel = React.memo(() => {
    const { resourceMonitor: monitor } = useSystemState();
    const { commandLog } = useLogsState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();

    const regulationLogs = commandLog.filter(log => log.text.startsWith('Homeostatic regulation'));

    const handleForceRegulation = () => {
        syscall('HOMEOSTASIS/REGULATE', { reason: 'Manual Override' });
        addToast("Forced homeostatic regulation cycle initiated.", "warning");
    };

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                This panel displays real-time system resource usage. The Homeostatic Coprocessor monitors these vitals and takes autonomous action if they exceed safe thresholds.
            </p>

            <div className="panel-subsection-title">System Vitals</div>
            <div className="hormone-signals" style={{ marginBottom: '1rem' }}>
                <div className="state-item"> <label>{t('resourceMonitor_cpu')}</label> <div className="state-bar-container"> <div className="state-bar cpu-bar" style={{ width: `${monitor.cpu_usage * 100}%` }}></div> </div> </div>
                <div className="state-item"> <label>{t('resourceMonitor_memory')}</label> <div className="state-bar-container"> <div className="state-bar memory-bar" style={{ width: `${monitor.memory_usage * 100}%` }}></div> </div> </div>
            </div>
            
            <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button className="control-button" onClick={handleForceRegulation}>
                    Force Regulation
                </button>
            </div>

            <div className="panel-subsection-title">Regulation Log</div>
            <div className="command-log-list">
                {regulationLogs.length === 0 ? (
                    <div className="kg-placeholder">No regulation actions have been taken.</div>
                ) : (
                    regulationLogs.map(entry => (
                        <div key={entry.id} className="command-log-item log-type-info">
                            <span className="log-icon">⚖️</span>
                            <span className="log-text">{entry.text}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});
