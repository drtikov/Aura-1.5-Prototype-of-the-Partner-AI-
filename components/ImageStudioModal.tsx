// components/ImageStudioModal.tsx
import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { GunaState } from '../types.ts';

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export const ImageStudioModal = ({ isOpen, onClose, initialPrompt, initialImage }: { isOpen: boolean; onClose: () => void; initialPrompt?: string; initialImage?: string }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast, handleGenerateDreamPrompt } = useAuraDispatch();

    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState('none');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [imageHistory, setImageHistory] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = useCallback(() => {
        setPrompt('');
        setCurrentImage(null);
        setImageHistory([]);
        setGeneratedImages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setNegativePrompt('');
        setStyle('none');
    }, []);

    useEffect(() => {
        if (isOpen) {
            setPrompt(initialPrompt || '');
            if (initialImage) {
                setCurrentImage(initialImage);
                setImageHistory([initialImage]);
            }
        } else {
            resetState();
        }
    }, [isOpen, initialPrompt, initialImage, resetState]);

    const handleFileSelect = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setCurrentImage(base64String);
                setImageHistory([base64String]);
                setGeneratedImages([]); // Clear generated grid when switching to edit mode
            };
            reader.readAsDataURL(file);
        } else if (file) {
            addToast('Please upload a valid image file.', 'warning');
        }
    };

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileSelect(e.dataTransfer.files?.[0] || null); }, []);
    const handleRemoveImage = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setCurrentImage(null); setImageHistory([]); if (fileInputRef.current) { fileInputRef.current.value = ''; } }, []);
    
    const handleUndo = () => {
        if (imageHistory.length > 1) {
            const newHistory = [...imageHistory];
            newHistory.pop();
            setCurrentImage(newHistory[newHistory.length - 1]);
            setImageHistory(newHistory);
        }
    };

    const constructFinalPrompt = () => {
        let finalPrompt = prompt;
        const additions: string[] = [];
        if (style !== 'none') additions.push(`in the style of ${style}`);
        if (additions.length > 0) finalPrompt += `, ${additions.join(', ')}`;
        return finalPrompt;
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast('A prompt is required to generate.', 'warning');
            return;
        }
        setIsProcessing(true);
        setGeneratedImages([]);
        try {
            const finalPrompt = constructFinalPrompt();
            const images = await geminiAPI.generateImage(finalPrompt, negativePrompt, style);
            if (images && images.length > 0) {
                setGeneratedImages(images.map(img => `data:image/jpeg;base64,${img}`));
                addToast('Images generated successfully.', 'success');
            } else {
                throw new Error('Image generation returned no data.');
            }
        } catch (error) {
            addToast(`Image generation failed: ${(error as Error).message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleEdit = async () => {
        if (!currentImage) {
            addToast('No image to edit.', 'warning');
            return;
        }
        if (!prompt.trim()) {
            addToast('A prompt is required to edit.', 'warning');
            return;
        }

        setIsProcessing(true);
        try {
            const finalPrompt = constructFinalPrompt();
            const base64Data = currentImage.split(',')[1];
            if (!base64Data) throw new Error("Invalid image data URL.");
            const mimeType = currentImage.match(/:(.*?);/)?.[1] || 'image/png';

            const newImageUrl = await geminiAPI.editImage(base64Data, mimeType, finalPrompt);

            if (newImageUrl) {
                setCurrentImage(newImageUrl);
                setImageHistory(prev => [...prev, newImageUrl]);
                addToast('Image edited successfully.', 'success');
            } else {
                throw new Error("Image editing returned no data.");
            }
        } catch (error) {
            addToast(`Image editing failed: ${(error as Error).message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const isEditing = !!currentImage;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Image Studio" className="image-generation-modal">
            <div className="image-gen-layout">
                <div className="image-gen-controls">
                    <div className="image-gen-control-group">
                        <label htmlFor="img-prompt">{isEditing ? 'Edit Instruction' : 'Prompt'}</label>
                        <textarea id="img-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} disabled={isProcessing} rows={6} />
                    </div>
                    <div className="image-gen-control-group">
                        <label htmlFor="img-style">Style</label>
                        <select id="img-style" value={style} onChange={e => setStyle(e.target.value)} disabled={isProcessing}>
                            <option value="none">None</option>
                            <option value="photorealistic">Photorealistic</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="anime">Anime</option>
                            <option value="watercolor">Watercolor</option>
                            <option value="cyberpunk">Cyberpunk</option>
                        </select>
                    </div>
                     <button className="image-generator-button" onClick={isEditing ? handleEdit : handleGenerate} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : (isEditing ? 'Edit Image' : 'Generate')}
                    </button>
                </div>
                <div className="image-gen-preview">
                    {isProcessing && (
                         <div className="loading-overlay active" style={{ position: 'relative', background: 'rgba(0,0,0,0.5)' }}>
                            <div className="spinner"></div>
                            <span>{isEditing ? 'Editing...' : 'Generating...'}</span>
                        </div>
                    )}
                    {currentImage ? (
                         <div className="generated-image-item">
                            <img src={currentImage} alt="current" />
                            <div className="image-item-actions">
                                <button onClick={handleUndo} disabled={imageHistory.length <= 1} title="Undo">
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C20.25 10.23 16.71 8 12.5 8z"/></svg>
                                </button>
                                <button onClick={handleRemoveImage} title="Remove Image">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </div>
                    ) : generatedImages.length > 0 ? (
                         <div className="image-results-grid">
                            {generatedImages.map((imgSrc, index) => (
                                <div key={index} className="generated-image-item">
                                    <img src={imgSrc} alt={`Generated image ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div 
                            className={`image-upload-dropzone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver} 
                            onDragLeave={handleDragLeave} 
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <p>To generate, enter a prompt. To edit, drag & drop an image here.</p>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} style={{display: 'none'}} />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};