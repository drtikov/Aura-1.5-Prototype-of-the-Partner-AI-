
// components/ManualControlPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const ManualControlPanel = () => {
    const { 
        memoryStatus,
        handleClearMemory, 
        importInputRef, 
        handleImportState, 
        handleExportState, 
        handleSaveAsCode, 
        handleGenerateArchitecturalSchema,
    } = useAuraDispatch();
    const { t } = useLocalization();

    return (
        <div className="data-panels">
            <div className="panel-group-title" style={{ marginTop: 0 }}>{t('memoryManagement')}</div>
            <div className="memory-controls">
                <span>{t('memoryStatus')}:</span>
                <div className={`memory-status-indicator ${memoryStatus === 'ready' ? 'saved' : memoryStatus}`} title={`Memory Status: ${memoryStatus}. Saving is now automatic.`} />
                <button className="control-button clear-memory" onClick={handleClearMemory}>{t('clearMemory')}</button>
            </div>
            
            <div className="panel-group-title">{t('systemManagement')}</div>
            <div className="button-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <input type="file" ref={importInputRef} onChange={handleImportState} accept=".json" style={{ display: 'none' }} />
                <button className="control-button" onClick={() => importInputRef.current?.click()}>{t('importState')}</button>
                <button className="control-button" onClick={handleExportState}>{t('exportState')}</button>
                <button className="control-button" onClick={handleSaveAsCode}>{t('exportCode')}</button>
                <button className="control-button" onClick={handleGenerateArchitecturalSchema}>{t('generateSchema')}</button>
            </div>
        </div>
    );
};
