// App.tsx
import React, { useEffect, useState } from 'react';
import { AuraProvider } from './context/AuraProvider';
import { useAuraDispatch, useCoreState, useSystemState } from './context/AuraContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { ToastContainer } from './components/Toast';
import { ControlDeckComponent } from './components/controlDeckComponent';
import { Header } from './components/Header';
import { VisualAnalysisFeed } from './components/VisualAnalysisFeed';
import { ModalPayloads } from './types';
import { LeftColumnComponent } from './components/LeftColumnComponent';
import { ApiKeySelector } from './components/ApiKeySelector';

const AppContent: React.FC = () => {
    const { toasts, removeToast, videoRef, isVisualAnalysisActive, syscall } = useAuraDispatch();
    const { modalRequest } = useCoreState();
    const { systemState } = useSystemState();
    const modal = useModal();
    const [isKeySelectionRequired, setIsKeySelectionRequired] = useState(false);

    useEffect(() => {
        if (modalRequest) {
            modal.open(modalRequest.type as keyof ModalPayloads, modalRequest.payload as any);
            syscall('CLEAR_MODAL_REQUEST', {});
        }
    }, [modalRequest, modal, syscall]);

    useEffect(() => {
        if (systemState.isApiKeyInvalidated) {
            setIsKeySelectionRequired(true);
            syscall('SYSTEM/CLEAR_API_KEY_INVALIDATED', {});
        }
    }, [systemState.isApiKeyInvalidated, syscall]);
    
    if (isKeySelectionRequired) {
        return <ApiKeySelector onKeySelected={() => setIsKeySelectionRequired(false)} />;
    }

    return (
        <div className="app-wrapper">
            <Header />
            <div className="app-container">
                <LeftColumnComponent />
                <ControlDeckComponent />
            </div>
            <VisualAnalysisFeed videoRef={videoRef} isAnalysisActive={isVisualAnalysisActive} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export const App: React.FC = () => {
    return (
        <AuraProvider>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
        </AuraProvider>
    );
};