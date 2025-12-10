
// components/PsychePanel.tsx
import React, { useState } from 'react';
import { CognitivePrimitiveDefinition } from '../types';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
import { Accordion } from './Accordion';

export const PsychePanel = () => {
    const { psycheState } = useArchitectureState();
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const modal = useModal();
    const { version, primitiveRegistry } = psycheState;

    const [testPrimitive, setTestPrimitive] = useState<string>('');
    const [testPayload, setTestPayload] = useState<string>('{}');

    const allPrimitives = Object.values(primitiveRegistry) as CognitivePrimitiveDefinition[];
    const corePrimitives: CognitivePrimitiveDefinition[] = allPrimitives.filter(p => !p.isSynthesized && ['CLASSIFY', 'SEQUENCE', 'TRANSFORM', 'AGGREGATE', 'QUERY', 'DESCRIBE_PRIMITIVE', 'LIST_PRIMITIVES', 'GENERALIZE'].includes(p.type));
    const algorithmicPrimitives = allPrimitives.filter(p => !p.isSynthesized && !corePrimitives.some(c => c.type === p.type));
    const synthesizedPrimitives = allPrimitives.filter(p => p.isSynthesized);

    const handleExecute = () => {
        if(!testPrimitive) return;
        try {
             const payload = JSON.parse(testPayload);
             // We push to Motor Cortex as a simulation
             syscall('MOTOR_CORTEX/SET_SEQUENCE', [{ type: testPrimitive, payload }]);
             addToast(`Primitive ${testPrimitive} queued for execution.`, 'success');
        } catch(e) {
            addToast("Invalid JSON payload.", "error");
        }
    };

    const renderPrimitive = (primitive: CognitivePrimitiveDefinition) => (
        <details key={primitive.type} className="workflow-details">
            <summary className="workflow-summary">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {primitive.isSynthesized && <span title="Synthesized Primitive">🤖</span>}
                    {primitive.type}
                </span>
            </summary>
            <div className="workflow-content">
                <p className="workflow-description">{primitive.description}</p>
                {primitive.isSynthesized && primitive.sourcePrimitives && (
                    <p className="workflow-description" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        <strong>Source:</strong> {primitive.sourcePrimitives.join(' → ')}
                    </p>
                )}
                <div className="code-snippet-container">
                    <pre><code>{JSON.stringify(primitive.payloadSchema, null, 2)}</code></pre>
                </div>
                <button 
                    className="control-button" 
                    style={{marginTop: '0.5rem', fontSize: '0.7rem'}}
                    onClick={() => {
                        setTestPrimitive(primitive.type);
                        setTestPayload(JSON.stringify(primitive.payloadSchema, null, 2)); // Pre-fill with schema as template
                    }}
                >
                    Use in Playground
                </button>
            </div>
        </details>
    );

    return (
        <div className="side-panel psyche-panel">
            <div className="awareness-item">
                <label>{t('psyche_languageVersion')}</label>
                <strong>v{version}</strong>
            </div>
             <div className="button-grid" style={{marginBottom: '1rem'}}>
                <button 
                    className="control-button"
                    onClick={() => modal.open('psychePrimitives', {})}
                    title={t('psyche_library_tooltip')}
                >
                    {t('psyche_library_button')}
                </button>
            </div>
            
            <Accordion title="Test Playground" defaultOpen={false}>
                <div className="image-gen-control-group">
                    <label>Primitive</label>
                    <select 
                        value={testPrimitive} 
                        onChange={e => setTestPrimitive(e.target.value)}
                        style={{width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'var(--text-color)'}}
                    >
                        <option value="">Select a primitive...</option>
                        {allPrimitives.map(p => <option key={p.type} value={p.type}>{p.type}</option>)}
                    </select>
                </div>
                <div className="image-gen-control-group">
                    <label>Payload (JSON)</label>
                    <textarea 
                        value={testPayload} 
                        onChange={e => setTestPayload(e.target.value)} 
                        rows={5}
                        style={{fontFamily: 'monospace', fontSize: '0.8rem'}}
                    />
                </div>
                <button className="control-button" onClick={handleExecute} disabled={!testPrimitive}>
                    Execute Primitive
                </button>
            </Accordion>

            <Accordion title={t('psyche_group_algorithmic')} defaultOpen>
                {algorithmicPrimitives.map(renderPrimitive)}
            </Accordion>
            
            <Accordion title={t('psyche_group_core')}>
                {corePrimitives.map(renderPrimitive)}
            </Accordion>
            
            {synthesizedPrimitives.length > 0 && (
                <Accordion title={t('psyche_group_synthesized')}>
                    {synthesizedPrimitives.map(renderPrimitive)}
                </Accordion>
            )}
        </div>
    );
};
