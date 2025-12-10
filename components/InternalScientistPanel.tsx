
// components/InternalScientistPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useCoreState, useLocalization, useAuraDispatch, useLogsState } from '../context/AuraContext.tsx';
import { PerformanceLogEntry } from '../types';
import { loadSdk } from '../core/sdkLoader.ts';

export const InternalScientistPanel = () => {
    const { t } = useLocalization();
    const { performanceLogs } = useLogsState();
    const { geminiAPI, syscall, addToast } = useAuraDispatch();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [output, setOutput] = useState('');
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

    const handleAnalyze = async () => {
        if (!pyodideRef.current || performanceLogs.length === 0) {
            setOutput('Not enough data to analyze or Python runtime not ready.');
            return;
        }
        setIsProcessing(true);
        setOutput('');
        setError('');

        const script = `
import json

logs_json = """${JSON.stringify(performanceLogs)}"""
logs = json.loads(logs_json)

if not logs:
    print("No performance logs to analyze.")
else:
    total_entries = len(logs)
    successful_entries = sum(1 for log in logs if log.get('success', False))
    success_rate = (successful_entries / total_entries) * 100 if total_entries > 0 else 0

    durations_by_skill = {}
    for log in logs:
        skill = log.get('skill', 'Unknown')
        duration = log.get('duration', 0)
        if skill not in durations_by_skill:
            durations_by_skill[skill] = []
        durations_by_skill[skill].append(duration)

    avg_durations = {skill: sum(durs) / len(durs) for skill, durs in durations_by_skill.items()}
    sorted_skills = sorted(avg_durations.items(), key=lambda item: item[1], reverse=True)

    print("--- Internal Scientist Performance Analysis ---")
    print(f"Total Entries Analyzed: {total_entries}")
    print(f"Overall Success Rate: {success_rate:.2f}%")
    print("\\n--- Average Duration by Skill (Slowest First) ---")
    for skill, avg_duration in sorted_skills[:5]:
        # Format the skill name: remove underscores and title case
        skill_name = skill.replace('_', ' ').title()
        print(f"- {skill_name}: {avg_duration:.2f} ms")
`;
        try {
            const pyodide = pyodideRef.current;
            let capturedOutput = '';
            pyodide.setStdout({ batched: (str: string) => capturedOutput += str + '\\n' });
            pyodide.setStderr({ batched: (str: string) => capturedOutput += str + '\\n' });
            await pyodide.runPythonAsync(script);
            setOutput(capturedOutput);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleHypothesize = async () => {
        setIsProcessing(true);
        try {
            const summary = `Performance Logs Summary: Analyzed ${performanceLogs.length} logs. Recent tasks involve coding and math.`;
            const hypothesis = await geminiAPI.formulateHypothesis("Cognitive Efficiency", summary);
            
            syscall('SCIENTIST/UPDATE_STATE', { 
                currentHypothesis: { text: hypothesis },
                log: [{ timestamp: Date.now(), stage: 'HYPOTHESIZE', message: hypothesis }]
            });
            addToast("Hypothesis formulated.", "success");
        } catch (e) {
            addToast("Failed to generate hypothesis.", "error");
        } finally {
            setIsProcessing(false);
        }
    };
    
    if (!isReady) {
        return (
            <div className="side-panel">
                <div className="kg-placeholder" style={{ minHeight: '200px' }}>
                    <div className="spinner-small" />
                    <span>{t('python_initializing')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="side-panel">
            <p className="reason-text">{t('internal_scientist_description')}</p>
            <div className="button-grid" style={{ marginTop: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <button
                    className="control-button"
                    onClick={handleAnalyze}
                    disabled={isProcessing || performanceLogs.length === 0}
                >
                    {isProcessing ? t('internal_scientist_analyzing') : t('internal_scientist_run_analysis')}
                </button>
                 <button
                    className="control-button"
                    onClick={handleHypothesize}
                    disabled={isProcessing}
                >
                    {t('scientist_hypothesize')}
                </button>
            </div>
            {error && <div className="failure-reason-display" style={{marginTop: '1rem'}}><strong>{t('python_error')}:</strong><pre><code>{error}</code></pre></div>}
            {output && (
                <>
                    <h4 className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('internal_scientist_results')}</h4>
                    <div className="code-snippet-container"><pre><code>{output}</code></pre></div>
                </>
            )}
        </div>
    );
};
