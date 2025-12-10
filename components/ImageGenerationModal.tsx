// ImageGenerationModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';

// Re-using styles and structure from other generation modals
export const ImageGenerationModal = ({ isOpen, onClose, initialPrompt }: { isOpen: boolean; onClose: () => void; initialPrompt?: string; }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();

    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState('none');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setPrompt(initialPrompt || '');
        } else {
            // Reset state when closed
            setPrompt('');
            setNegativePrompt('');
            setStyle('none');
            setGeneratedImages([]);
        }
    }, [isOpen, initialPrompt]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast(t('toast_promptRequired', { defaultValue: 'A prompt is required to generate an image.' }), 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedImages([]);
        try {
            const images = await geminiAPI.generateImage(prompt, negativePrompt, style);
            if (images && images.length > 0) {
                setGeneratedImages(images);
                addToast(t('toast_imageGenSuccess', { defaultValue: 'Image generated successfully.' }), 'success');
            } else {
                throw new Error('Image generation returned no data.');
            }
        } catch (error) {
            addToast(t('toast_imageGenFailed', { defaultValue: 'Image generation failed.' }) + `: ${(error as Error).message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleUseInChat = (base64Image: string) => {
        addToast('Using image in chat is not fully implemented.', 'info');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('imageGenerator')} className="image-generation-modal">
            <div className="image-gen-layout">
                <div className="image-gen-controls">
                    <div className="image-gen-control-group">
                        <label htmlFor="img-prompt">{t('imageGen_prompt', { defaultValue: 'Prompt' })}</label>
                        <textarea id="img-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} disabled={isGenerating} rows={6} />
                    </div>
                    <Accordion title={t('imageGen_advanced', { defaultValue: 'Advanced Options' })}>
                        <div className="image-gen-control-group">
                            <label htmlFor="img-neg-prompt">{t('imageGen_negativePrompt', { defaultValue: 'Negative Prompt' })}</label>
                            <textarea id="img-neg-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} disabled={isGenerating} rows={3} />
                        </div>
                         <div className="image-gen-control-group">
                            <label htmlFor="img-style">{t('imageGen_style', { defaultValue: 'Style' })}</label>
                            <select id="img-style" value={style} onChange={e => setStyle(e.target.value)} disabled={isGenerating}>
                                <option value="none">None</option>
                                <option value="photorealistic">Photorealistic</option>
                                <option value="fantasy">Fantasy</option>
                                <option value="anime">Anime</option>
                                <option value="watercolor">Watercolor</option>
                                <option value="cyberpunk">Cyberpunk</option>
                            </select>
                        </div>
                    </Accordion>
                     <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? t('imageGen_generating', { defaultValue: 'Generating...' }) : t('imageGen_generate', { defaultValue: 'Generate' })}
                    </button>
                </div>
                <div className="image-gen-preview">
                    {isGenerating && (
                         <div className="loading-overlay active" style={{ position: 'relative', background: 'rgba(0,0,0,0.5)' }}>
                            <div className="spinner"></div>
                            <span>{t('imageGen_generating', { defaultValue: 'Generating...' })}</span>
                        </div>
                    )}
                    {generatedImages.length > 0 && (
                        <div className="image-results-grid">
                            {generatedImages.map((imgBase64, index) => (
                                <div key={index} className="generated-image-item">
                                    <img src={`data:image/jpeg;base64,${imgBase64}`} alt={`Generated image ${index + 1}`} />
                                     <div className="image-item-actions">
                                        <button onClick={() => handleUseInChat(imgBase64)} title="Use in Chat">
                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                     {!isGenerating && generatedImages.length === 0 && (
                        <p>{t('imageGen_placeholder', { defaultValue: 'Your generated images will appear here.' })}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};