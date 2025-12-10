
// components/PraxisCorePanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { loadSdk } from '../core/sdkLoader.ts';
import { HistoryEntry } from '../types';

export const PraxisCorePanel = React.memo(() => {
    const { geminiAPI, addToast } = useAuraDispatch();
    const { t } = useLocalization();

    const [task, setTask] = useState('reverse the string "hello world"');
    const [generatedScript, setGeneratedScript] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const vmRef = useRef<any>(null);

    useEffect(() => {
        const initRubyVM = async () => {
            try {
                await loadSdk('ruby-wasm');
                const { RubyVM } = (window as any);
                const vm = await RubyVM.init();
                vm.printSync = (_level: any, message: any) => {
                    setOutput(prev => prev + message + '\n');
                };
                vmRef.current = vm;
                setIsReady(true);
            } catch (e) {
                setError(`Failed to initialize Ruby VM: ${(e as Error).message}`);
            }
        };
        initRubyVM();
    }, []);
    
    const handleGenerate = async () => {
        if (!task.trim()) {
            addToast('Please describe the tool to generate.', 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedScript('');
        setOutput('');
        setError('');
        try {
            const script = await geminiAPI.generateMicroTool(task);
            setGeneratedScript(script);

        } catch(e) {
            addToast(`Tool generation failed: ${(e as Error).message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleExecute = async () => {
        if (!vmRef.current || !generatedScript) return;
        setIsExecuting(true);
        setOutput('');
        setError('');
        try {
            await vmRef.current.evalAsync(generatedScript);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsExecuting(false);
        }
    };
    
    if (!isReady) {
        return (
            <div className="side-panel">
                <div className="kg-placeholder" style={{ minHeight: '200px' }}><div className="spinner-small" /><span>{t('ruby_initializing')}</span></div>
            </div>
        );
    }
    
    return (
        <div className="side-panel command-log-panel">
            <p className="reason-text">{t('praxis_core_description')}</p>

             <div className="image-gen-control-group">
                <label htmlFor="tool-task">{t('praxis_core_task_label')}</label>
                <textarea id="tool-task" value={task} onChange={e => setTask(e.target.value)} rows={2} placeholder={t('praxis_core_task_placeholder')} disabled={isGenerating || !isReady} />
            </div>
            
            <button className="control-button" onClick={handleGenerate} disabled={isGenerating || !task.trim() || !isReady} style={{ marginTop: '1rem', width: '100%' }}>
                {isGenerating ? t('praxis_core_generating_button') : t('praxis_core_generate_button')}
            </button>

            {generatedScript && (
                <>
                    <div className="panel-subsection-title">{t('praxis_core_generated_script_title')}</div>
                    <textarea value={generatedScript} onChange={e => setGeneratedScript(e.target.value)} rows={6} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem' }}/>
                    <button className="control-button implement-button" onClick={handleExecute} disabled={isExecuting || !isReady} style={{ marginTop: '0.5rem', width: '100%' }}>
                        {isExecuting ? t('praxis_core_executing_button') : t('praxis_core_execute_button')}
                    </button>
                </>
            )}

            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('ruby_error')}:</strong><pre><code>{error}</code></pre></div>}
            {output && <><h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('praxis_core_output_title')}</h4><div className="code-snippet-container"><pre><code>{output}</code></pre></div></>}

        </div>
    );
});