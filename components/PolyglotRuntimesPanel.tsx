
// components/PolyglotRuntimesPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { loadSdk } from '../core/sdkLoader.ts';

// --- Reliability Ratings ---
const RUNTIME_META: Record<string, { tier: string; color: string; risk: string }> = {
    python: { tier: 'S', color: 'var(--success-color)', risk: 'Low (Robust Sandbox)' },
    javascript: { tier: 'S', color: 'var(--success-color)', risk: 'Low (Native Execution)' },
    prolog: { tier: 'A', color: 'var(--primary-color)', risk: 'Low (Strict Logic)' },
    clingo: { tier: 'A', color: 'var(--primary-color)', risk: 'Low (Declarative)' },
    ruby: { tier: 'B', color: 'var(--warning-color)', risk: 'Moderate (Missing Stdlib)' },
    lua: { tier: 'B', color: 'var(--warning-color)', risk: 'Moderate (API Mismatches)' },
    scheme: { tier: 'C', color: 'var(--failure-color)', risk: 'High (Syntax/Parens)' },
    csharp: { tier: 'D', color: 'var(--text-muted)', risk: 'Educational Only' },
    java: { tier: 'D', color: 'var(--text-muted)', risk: 'Educational Only' },
};

const ReliabilityBadge = ({ lang }: { lang: string }) => {
    const meta = RUNTIME_META[lang] || { tier: '?', color: 'gray', risk: 'Unknown' };
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            border: `1px solid ${meta.color}`,
            backgroundColor: 'rgba(0,0,0,0.2)',
            fontSize: '0.7rem',
            marginBottom: '1rem'
        }}>
            <span style={{ fontWeight: 'bold', color: meta.color }}>Tier {meta.tier}</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-color)' }}>Hallucination Risk: {meta.risk}</span>
        </div>
    );
};

// --- C# / .NET Educational Sandbox ---
const CSharpRuntime = () => {
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <ReliabilityBadge lang="csharp" />
            <p className="reason-text">{t('csharp_runtime_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="csharp-code">{t('csharp_code')}</label>
                <textarea id="csharp-code" value={t('csharp_placeholder')} readOnly rows={8} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', opacity: 0.7 }} />
            </div>
        </div>
    );
};

// --- Java Educational Sandbox ---
const JavaRuntime = () => {
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <ReliabilityBadge lang="java" />
            <p className="reason-text">{t('java_runtime_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="java-code">{t('java_code')}</label>
                <textarea id="java-code" value={t('java_placeholder')} readOnly rows={8} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', opacity: 0.7 }} />
            </div>
        </div>
    );
};

// --- Python Runtime Component ---
const PythonRuntime = () => {
    const { t } = useLocalization();
    const [code, setCode] = useState(t('python_placeholder'));
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const pyodideRef = useRef<any>(null);

    useEffect(() => {
        const initPyodide = async () => {
            try {
                await loadSdk('pyodide');
                pyodideRef.current = await window.loadPyodide();
                await pyodideRef.current.loadPackage('numpy');
                setIsReady(true);
            } catch (e) {
                setError(`Failed to initialize Pyodide: ${(e as Error).message}`);
            }
        };
        initPyodide();
    }, []);

    const handleExecute = async () => {
        if (!pyodideRef.current) return;
        setIsProcessing(true);
        setOutput('');
        setError('');
        try {
            const pyodide = pyodideRef.current;
            let capturedOutput = '';
            pyodide.setStdout({ batched: (str: string) => capturedOutput += str + '\n' });
            pyodide.setStderr({ batched: (str: string) => capturedOutput += str + '\n' });
            
            // Inject Security Preamble (Mirroring HAL)
            const sandboxPreamble = `
import sys
import os
for mod in ['socket', 'http', 'requests', 'urllib']: sys.modules[mod] = None
`;
            await pyodide.runPythonAsync(sandboxPreamble + '\n' + code);
            setOutput(capturedOutput);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };
    
    if (!isReady) {
        return <div className="kg-placeholder" style={{ minHeight: '200px' }}><div className="spinner-small" /><span>{t('python_initializing')}</span></div>;
    }

    return (
        <div className="side-panel">
            <ReliabilityBadge lang="python" />
            <p className="reason-text">{t('python_runtime_description')}</p>
            <div className="image-gen-control-group"><label htmlFor="python-code">{t('python_code')}</label><textarea id="python-code" value={code} onChange={e => setCode(e.target.value)} rows={8} disabled={isProcessing} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }} /></div>
            <button className="control-button" onClick={handleExecute} disabled={isProcessing} style={{ marginTop: '1rem', width: '100%' }}>{isProcessing ? t('python_executing') : t('python_execute')}</button>
            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('python_error')}:</strong><pre><code>{error}</code></pre></div>}
            {output && <><h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('python_output')}</h4><div className="code-snippet-container"><pre><code>{output}</code></pre></div></>}
        </div>
    );
};

// --- Lua Runtime Component ---
const LuaRuntime = () => {
    const { t } = useLocalization();
    const [code, setCode] = useState(t('lua_placeholder'));
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => { loadSdk('fengari'); }, []);

    const handleExecute = () => {
        if (typeof window.fengari === 'undefined') {
            setError('Fengari SDK not loaded.');
            return;
        }
        setIsProcessing(true);
        setOutput('');
        setError('');
        try {
            const { lua, lauxlib, lualib, interop } = window.fengari;
            const L = lauxlib.luaL_newstate();
            lualib.luaL_openlibs(L);
            interop.push(L, (str: any) => setOutput(prev => prev + interop.to_jsstring(str) + '\n'));
            lua.lua_setglobal(L, 'print');
            lauxlib.luaL_loadstring(L, code);
            const status = lua.lua_pcall(L, 0, 0, 0);
            if (status !== 0) {
                throw new Error(lua.lua_tojsstring(L, -1));
            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="side-panel">
            <ReliabilityBadge lang="lua" />
            <p className="reason-text">{t('lua_runtime_description')}</p>
            <div className="image-gen-control-group"><label htmlFor="lua-code">{t('lua_code')}</label><textarea id="lua-code" value={code} onChange={e => setCode(e.target.value)} rows={8} disabled={isProcessing} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }} /></div>
            <button className="control-button" onClick={handleExecute} disabled={isProcessing} style={{ marginTop: '1rem', width: '100%' }}>{isProcessing ? t('lua_executing') : t('lua_execute')}</button>
            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('lua_error')}:</strong><pre><code>{error}</code></pre></div>}
            {output && <><h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('lua_output')}</h4><div className="code-snippet-container"><pre><code>{output}</code></pre></div></>}
        </div>
    );
};

// --- Scheme Runtime Component ---
const SchemeRuntime = () => {
    const { t } = useLocalization();
    const [code, setCode] = useState(t('scheme_placeholder'));
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => { loadSdk('biwascheme'); }, []);
    
    const handleExecute = () => {
         if (typeof window.BiwaScheme === 'undefined') {
            setError('BiwaScheme SDK not loaded.');
            return;
        }
        setIsProcessing(true);
        setOutput('');
        setError('');
        try {
            const biwa = new window.BiwaScheme.Interpreter((e: Error) => {
                setError(e.message);
                setIsProcessing(false);
            });
            const result = biwa.evaluate(code);
            if (result !== undefined && result !== window.BiwaScheme.undef) {
                 setOutput(window.BiwaScheme.to_write(result));
            }
        } catch (e) {
             setError((e as Error).message);
        } finally {
             setIsProcessing(false);
        }
    };

    return (
        <div className="side-panel">
            <ReliabilityBadge lang="scheme" />
            <p className="reason-text">{t('scheme_runtime_description')}</p>
            <div className="image-gen-control-group"><label htmlFor="scheme-code">{t('scheme_code')}</label><textarea id="scheme-code" value={code} onChange={e => setCode(e.target.value)} rows={8} disabled={isProcessing} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }} /></div>
            <button className="control-button" onClick={handleExecute} disabled={isProcessing} style={{ marginTop: '1rem', width: '100%' }}>{isProcessing ? t('scheme_executing') : t('scheme_execute')}</button>
            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('scheme_error')}:</strong><pre><code>{error}</code></pre></div>}
            {output && <><h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('scheme_output')}</h4><div className="code-snippet-container"><pre><code>{output}</code></pre></div></>}
        </div>
    );
};

// --- Prolog Runtime Component (Trealla) ---
const PrologRuntime = () => {
    const { t } = useLocalization();
    const [kb, setKb] = useState(t('prolog_kb_placeholder'));
    const [query, setQuery] = useState(t('prolog_query_placeholder'));
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const plRef = useRef<any>(null);

    useEffect(() => {
        loadSdk('trealla').then(async () => {
            try {
                // @ts-ignore
                if (window.loadTrealla) {
                     // @ts-ignore
                    plRef.current = await window.loadTrealla();
                    setIsReady(true);
                } else {
                    throw new Error("Trealla loader not found.");
                }
            } catch(e) {
                setError(`Failed to load Trealla: ${(e as Error).message}`);
            }
        }).catch(() => setError('Failed to load Trealla SDK.'));
    }, []);

    const handleExecute = async () => {
        if (!plRef.current) return;
        setIsProcessing(true);
        setOutput('');
        setError('');

        try {
            const session = plRef.current.getSession();
            // Load KB
            await session.consult("/user.pl", kb);
            
            // Run Query
            const q = await session.query(query);
            let results = '';
            
            for await (const answer of q) {
                 if (answer.result === 'success') {
                    results += answer.output + '\n'; // Text output (if any, usually empty for pure logic)
                    // Format variable bindings
                    if (answer.substitutions) {
                        // @ts-ignore
                        const bindings = Object.entries(answer.substitutions).map(([k, v]) => `${k} = ${v}`).join(', ');
                         results += `Answer: ${bindings || 'true'}\n`;
                    } else {
                         results += "true.\n";
                    }
                } else {
                    results += "false.\n";
                }
            }
            setOutput(results || "No results.");
            
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isReady) {
        return <div className="kg-placeholder" style={{ minHeight: '200px' }}><div className="spinner-small" /><span>{t('prolog_initializing')}</span></div>;
    }

    return (
        <div className="side-panel">
            <ReliabilityBadge lang="prolog" />
            <p className="reason-text">{t('prolog_runtime_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="prolog-kb">{t('prolog_kb_label')}</label>
                <textarea id="prolog-kb" value={kb} onChange={e => setKb(e.target.value)} rows={6} disabled={isProcessing} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }} />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="prolog-query">{t('prolog_query_label')}</label>
                <input id="prolog-query" type="text" value={query} onChange={e => setQuery(e.target.value)} disabled={isProcessing} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }} />
            </div>
            <button className="control-button" onClick={handleExecute} disabled={isProcessing} style={{ marginTop: '1rem', width: '100%' }}>{isProcessing ? t('prolog_executing') : t('prolog_execute')}</button>
            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('prolog_error')}:</strong><pre><code>{error}</code></pre></div>}
            {output && <><h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('prolog_output')}</h4><div className="code-snippet-container"><pre><code>{output}</code></pre></div></>}
        </div>
    );
};

// --- Clingo Runtime Component ---
declare const clingo: any; // Global for clingo-wasm

const ClingoRuntime = () => {
    const { t } = useLocalization();
    const [code, setCode] = useState(t('clingo_placeholder'));
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        loadSdk('clingo').then(() => {
             // Check if the global variable is available
             if (typeof clingo !== 'undefined' || (window as any).Clingo) {
                 setIsReady(true);
             } else {
                 setError('Failed to load Clingo global. The SDK might not be compatible.');
             }
        }).catch(() => setError('Failed to load Clingo SDK.'));
    }, []);

    const handleExecute = async () => {
        setIsProcessing(true);
        setOutput('');
        setError('');
        try {
            let result = '';
            // Try to use the global 'clingo' or 'Clingo'
            const clingoInstance = typeof clingo !== 'undefined' ? clingo : (window as any).Clingo;

            if (clingoInstance && typeof clingoInstance.run === 'function') {
                 result = await clingoInstance.run(code);
            } else if (clingoInstance && typeof clingoInstance.solve === 'function') {
                 result = await clingoInstance.solve(code);
            } else {
                throw new Error("Clingo run/solve function not found on global object.");
            }
            
            setOutput(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isReady) {
        return <div className="kg-placeholder" style={{ minHeight: '200px' }}><div className="spinner-small" /><span>{t('clingo_initializing')}</span></div>;
    }

    return (
        <div className="side-panel">
            <ReliabilityBadge lang="clingo" />
            <p className="reason-text">{t('clingo_runtime_description')}</p>
            <div className="image-gen-control-group"><label>{t('clingo_code')}</label><textarea value={code} onChange={e => setCode(e.target.value)} rows={8} disabled={isProcessing} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }} /></div>
            <button className="control-button" onClick={handleExecute} disabled={isProcessing} style={{ marginTop: '1rem', width: '100%' }}>{isProcessing ? t('clingo_executing') : t('clingo_execute')}</button>
            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('clingo_error')}:</strong><pre><code>{error}</code></pre></div>}
            {output && <><h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('clingo_output')}</h4><div className="code-snippet-container"><pre><code>{output}</code></pre></div></>}
        </div>
    );
};


export const PolyglotRuntimesPanel = () => {
    const [activeTab, setActiveTab] = useState('python');
    const { t } = useLocalization();

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'python': return <PythonRuntime />;
            case 'lua': return <LuaRuntime />;
            case 'scheme': return <SchemeRuntime />;
            case 'prolog': return <PrologRuntime />;
            case 'clingo': return <ClingoRuntime />;
            case 'csharp': return <CSharpRuntime />;
            case 'java': return <JavaRuntime />;
            default:
                return <PythonRuntime />;
        }
    };

    return (
        <div>
            <div className="left-column-tabs" style={{flexWrap: 'wrap'}}>
                <button className={`tab-button ${activeTab === 'python' ? 'active' : ''}`} onClick={() => setActiveTab('python')}>{t('polyglot_tab_python')}</button>
                <button className={`tab-button ${activeTab === 'lua' ? 'active' : ''}`} onClick={() => setActiveTab('lua')}>{t('polyglot_tab_lua')}</button>
                <button className={`tab-button ${activeTab === 'scheme' ? 'active' : ''}`} onClick={() => setActiveTab('scheme')}>{t('polyglot_tab_scheme')}</button>
                <button className={`tab-button ${activeTab === 'prolog' ? 'active' : ''}`} onClick={() => setActiveTab('prolog')}>{t('polyglot_tab_prolog')}</button>
                <button className={`tab-button ${activeTab === 'clingo' ? 'active' : ''}`} onClick={() => setActiveTab('clingo')}>{t('polyglot_tab_clingo')}</button>
                <button className={`tab-button ${activeTab === 'csharp' ? 'active' : ''}`} onClick={() => setActiveTab('csharp')}>{t('polyglot_tab_csharp')}</button>
                <button className={`tab-button ${activeTab === 'java' ? 'active' : ''}`} onClick={() => setActiveTab('java')}>{t('polyglot_tab_java')}</button>
            </div>
            <div className="tab-content">
                {renderActiveTab()}
            </div>
        </div>
    );
};
