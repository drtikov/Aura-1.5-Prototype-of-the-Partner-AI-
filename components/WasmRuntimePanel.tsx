// components/WasmRuntimePanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { loadSdk } from '../core/sdkLoader.ts';

declare const wabt: any;

export const WasmRuntimePanel = () => {
    const { t } = useLocalization();
    const { addToast } = useAuraDispatch();
    const [watCode, setWatCode] = useState(t('wasm_wat_placeholder'));
    const [funcName, setFuncName] = useState('add');
    const [funcArgs, setFuncArgs] = useState('5, 10');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCompileAndRun = async () => {
        setIsProcessing(true);
        setResult(null);
        setError(null);

        try {
            await loadSdk('wabt');
            if (typeof wabt === 'undefined') {
                throw new Error(t('wasm_sdk_not_loaded'));
            }

            const wabtInterface = await wabt();
            const module = wabtInterface.parseWat('module.wat', watCode);
            const { buffer } = module.toBinary({ log: true });
            
            const wasmModule = await WebAssembly.instantiate(buffer);
            const exports = wasmModule.instance.exports;

            if (!exports[funcName]) {
                throw new Error(`Function '${funcName}' not found in Wasm module exports.`);
            }

            const argsArray = funcArgs.split(',').map(arg => parseInt(arg.trim(), 10)).filter(arg => !isNaN(arg));
            
            const executionResult = (exports[funcName] as Function)(...argsArray);
            setResult(String(executionResult));
            addToast('Wasm execution successful!', 'success');

        } catch (e) {
            const errorMessage = (e as Error).message;
            setError(errorMessage);
            addToast('Wasm execution failed.', 'error');
            console.error("WASM Execution Error:", e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="side-panel wasm-runtime-panel">
            <p className="reason-text">{t('wasm_runtime_description')}</p>

            <div className="image-gen-control-group">
                <label htmlFor="wat-code">{t('wasm_wat_code')}</label>
                <textarea id="wat-code" value={watCode} onChange={e => setWatCode(e.target.value)} rows={10} disabled={isProcessing} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="image-gen-control-group">
                    <label htmlFor="func-name">{t('wasm_function_name')}</label>
                    <input id="func-name" type="text" value={funcName} onChange={e => setFuncName(e.target.value)} placeholder={t('wasm_function_name_placeholder')} disabled={isProcessing} />
                </div>
                <div className="image-gen-control-group">
                    <label htmlFor="func-args">{t('wasm_function_args')}</label>
                    <input id="func-args" type="text" value={funcArgs} onChange={e => setFuncArgs(e.target.value)} placeholder={t('wasm_function_args_placeholder')} disabled={isProcessing} />
                </div>
            </div>
            
            <button className="control-button" onClick={handleCompileAndRun} disabled={isProcessing} style={{ marginTop: '1rem', width: '100%' }}>
                {isProcessing ? t('wasm_compiling') : t('wasm_compile_run')}
            </button>

            {error && (
                <div className="failure-reason-display" style={{ marginTop: '1rem' }}>
                    <strong>{t('wasm_runtime_error')}:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}><code>{error}</code></pre>
                </div>
            )}
            {result !== null && (
                <div style={{ marginTop: '1.5rem' }}>
                    <h4 className="panel-subsection-title">{t('wasm_result')}</h4>
                    <div className="code-snippet-container">
                        <pre><code>{result}</code></pre>
                    </div>
                </div>
            )}
        </div>
    );
};
