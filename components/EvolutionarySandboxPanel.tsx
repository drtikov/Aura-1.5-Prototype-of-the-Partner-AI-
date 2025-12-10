
// components/EvolutionarySandboxPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { loadSdk } from '../core/sdkLoader.ts';

const CodeViewer = ({ code, title }: { code: string; title: string }) => {
    return (
        <div className="code-snippet-container" style={{ marginTop: '1rem' }}>
            <div className="panel-subsection-title" style={{ marginTop: 0, marginBottom: '0.5rem' }}>{title}</div>
            <pre><code>{code}</code></pre>
        </div>
    );
};

export const EvolutionarySandboxPanel = () => {
    const { syscall, geminiAPI, addToast } = useAuraDispatch();
    const { t } = useLocalization();

    const [goal, setGoal] = useState('a function that finds the factorial of a number');
    const [generatedCode, setGeneratedCode] = useState('');
    const [generatedTest, setGeneratedTest] = useState('');
    const [verificationOutput, setVerificationOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState('');
    const pyodideRef = useRef<any>(null);
    
    useEffect(() => {
        const initPyodide = async () => {
            try {
                await loadSdk('pyodide');
                pyodideRef.current = await (window as any).loadPyodide();
                setIsReady(true);
            } catch (e) {
                setError(`Failed to initialize Pyodide: ${(e as Error).message}`);
            }
        };
        initPyodide();
    }, []);

    const handleGenerate = async () => {
        if (!goal.trim()) return;
        setIsGenerating(true);
        setGeneratedCode('');
        setGeneratedTest('');
        setVerificationOutput('');
        setIsVerified(false);
        setError('');
        try {
            const { code, test } = await geminiAPI.generateTddPair(goal);
            setGeneratedCode(code);
            setGeneratedTest(test);
        } catch(e) {
            setError(`Code generation failed: ${(e as Error).message}`);
            addToast(`Code generation failed: ${(e as Error).message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleVerify = async () => {
        if (!pyodideRef.current || !generatedCode || !generatedTest) return;
        setIsVerifying(true);
        setVerificationOutput('');
        setError('');
        setIsVerified(false);
        try {
            const pyodide = pyodideRef.current;
            let capturedOutput = '';
            pyodide.setStdout({ batched: (str: string) => capturedOutput += str + '\n' });
            pyodide.setStderr({ batched: (str: string) => capturedOutput += str + '\n' });
            
            // The generated test script is a full executable, so we just need to run it after defining the code.
            const fullScript = `${generatedCode}\n\n${generatedTest}`;
            await pyodide.runPythonAsync(fullScript);

            setVerificationOutput(capturedOutput);
            if (capturedOutput.includes('OK') && !capturedOutput.includes('FAIL')) {
                setIsVerified(true);
            }
        } catch (e) {
            setError((e as Error).message);
            setVerificationOutput((e as Error).message);
        } finally {
            setIsVerifying(false);
        }
    };
    
    const handleApprove = () => {
        addToast("Approval is a simulation. In a real system, this would write the change to the VFS.", "info");
    };

    if (!isReady) {
        return (
            <div className="side-panel">
                <div className="kg-placeholder" style={{ minHeight: '200px' }}><div className="spinner-small" /><span>{t('python_initializing')}</span></div>
            </div>
        );
    }

    return (
        <div className="side-panel">
            <p className="reason-text">{t('sandbox_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="sprint-goal">{t('sandbox_goal')}</label>
                <textarea
                    id="sprint-goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t('sandbox_goal_placeholder')}
                    rows={2}
                    disabled={isGenerating}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleGenerate} disabled={isGenerating || !goal.trim()}>
                    {isGenerating ? 'Generating...' : 'Generate Code & Test'}
                </button>
            </div>

            {generatedCode && <CodeViewer code={generatedCode} title="Generated Function" />}
            {generatedTest && <CodeViewer code={generatedTest} title="Verification Test" />}

            {generatedTest && (
                <div className="button-grid" style={{ marginTop: '1rem' }}>
                    <button className="control-button" onClick={handleVerify} disabled={isVerifying}>
                        {isVerifying ? 'Verifying...' : 'Run Verification'}
                    </button>
                </div>
            )}
            
            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('python_error')}:</strong><pre><code>{error}</code></pre></div>}

            {verificationOutput && (
                 <>
                    <h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>Verification Output</h4>
                    <div className="code-snippet-container"><pre><code>{verificationOutput}</code></pre></div>
                 </>
            )}

            {isVerified && (
                 <div className="proposal-actions-footer">
                    <button className="control-button implement-button" onClick={handleApprove}>Approve & Implement (Simulated)</button>
                </div>
            )}
        </div>
    );
};