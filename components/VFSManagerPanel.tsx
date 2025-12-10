
// components/VFSManagerPanel.tsx
import React, { useState, useRef } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { HAL } from '../core/hal.ts';

export const VFSManagerPanel = React.memo(() => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [filePath, setFilePath] = useState('');
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const fileContent = await file.text();
            setContent(fileContent);
            setFileName(file.name);
            if (!filePath.trim()) {
                setFilePath(`/${file.name}`); // Auto-fill path if empty
            }
        } catch (e) {
            console.error("Could not read file", e);
            addToast(t('vfsManager_fileError'), 'error');
        }
    };

    const handleClearFile = () => {
        setContent('');
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = () => {
        if (!filePath.trim() || !content.trim()) {
            addToast(t('vfsManager_pathContentRequired'), 'error');
            return;
        }

        if (HAL.UI.confirm(t('vfsManager_confirm_message', { filePath }))) {
            syscall('VFS/WRITE_FILE_REQUEST', {
                type: 'WRITE',
                files: [{ path: filePath, content: content }]
            });
            // The success toast and reboot is handled by the useAura hook
            addToast(t('vfsManager_requestSent'), 'info');
            setFilePath('');
            setContent('');
            setFileName('');
        }
    };

    return (
        <div className="side-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <p className="reason-text">
                {t('vfsManager_description')}
            </p>
            <div className="image-gen-control-group">
                <label htmlFor="vfs-path">{t('vfsManager_path_label')}</label>
                <input
                    id="vfs-path"
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder={t('vfsManager_path_placeholder')}
                    className="vfs-path-input"
                />
            </div>
             <div className="image-gen-control-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="vfs-content">{t('vfsManager_code_label')}</label>
                <textarea
                    id="vfs-content"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        if (fileName) handleClearFile();
                    }}
                    placeholder={t('vfsManager_code_placeholder')}
                    className="curriculum-textarea"
                    style={{ flexGrow: 1, minHeight: '150px' }}
                />
            </div>
             <div className="ingest-file-controls">
                {fileName ? (
                    <div className="ingest-file-display">
                        <span>{fileName}</span>
                        <button onClick={handleClearFile} title={t('ingestPanel_clear')}>&times;</button>
                    </div>
                ) : (
                    <button className="control-button" onClick={() => fileInputRef.current?.click()}>
                        {t('vfsManager_uploadButton')}
                    </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
            </div>
            <div className="button-grid" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <button
                    className="control-button implement-button"
                    onClick={handleSave}
                    disabled={!filePath.trim() || !content.trim()}
                >
                    {t('vfsManager_save_button')}
                </button>
            </div>
        </div>
    );
});
