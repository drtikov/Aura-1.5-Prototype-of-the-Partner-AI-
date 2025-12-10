
// components/KnowledgeGraphPanel.tsx
import React, { useState } from 'react';
// FIX: Add '.ts' extension to satisfy module resolution.
import { SyscallCall, KnowledgeFact } from '../types.ts';
import { ECAN_CONSTANTS } from '../constants.ts';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useMemoryState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';

const FactTypeBadge = ({ type }: { type: KnowledgeFact['type'] }) => {
    if (!type || type === 'fact') return null;
    let style = {};
    switch (type) {
        case 'theorem': style = { backgroundColor: 'var(--guna-dharma)', color: 'var(--background)' }; break;
        case 'definition': style = { backgroundColor: 'var(--primary-color)', color: 'var(--background)' }; break;
        case 'dependency': style = { backgroundColor: 'var(--text-muted)', color: 'var(--background)' }; break;
        default: style = { backgroundColor: 'var(--border-color)', color: 'var(--text-color)' }; break;
    }
    return <span className="proposal-type-badge" style={{...style, justifySelf: 'start', gridColumn: '2 / 3'}}>{type}</span>;
}

const AttentionBar = ({ value, max, color, label }: { value?: number, max: number, color: string, label: string }) => {
    const v = value || 0;
    const percent = Math.min(100, Math.max(0, (v / max) * 100));
    return (
        <div className="state-bar-container" style={{ width: '40px', height: '4px', marginLeft: 'auto' }} title={`${label}: ${v.toFixed(0)}`}>
            <div className="state-bar" style={{ width: `${percent}%`, backgroundColor: color }}></div>
        </div>
    );
}

export const KnowledgeGraphPanel = React.memo(() => {
    const { knowledgeGraph: graph } = useMemoryState();
    const { t } = useLocalization();
    const { syscall, handleManualAddFact } = useAuraDispatch();

    const [subject, setSubject] = useState('');
    const [predicate, setPredicate] = useState('');
    const [object, setObject] = useState('');
    const [confidence, setConfidence] = useState(1.0);

    const handleAdd = () => {
        if (subject && predicate && object) {
            handleManualAddFact({
                subject,
                predicate,
                object,
                confidence,
                strength: 1.0,
                lastAccessed: Date.now(),
                source: 'manual_entry'
            });
            setSubject('');
            setPredicate('');
            setObject('');
            setConfidence(1.0);
        }
    };

    return (
        <div className="side-panel">
            <Accordion title={t('knowledgeGraph_manualInjection')} defaultOpen={false}>
                <div className="image-gen-control-group">
                    <label>{t('knowledgeGraph_subject')}</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Aura" className="vfs-path-input"/>
                </div>
                <div className="image-gen-control-group">
                    <label>{t('knowledgeGraph_predicate')}</label>
                    <input type="text" value={predicate} onChange={e => setPredicate(e.target.value)} placeholder="e.g., is" className="vfs-path-input"/>
                </div>
                <div className="image-gen-control-group">
                    <label>{t('knowledgeGraph_object')}</label>
                    <input type="text" value={object} onChange={e => setObject(e.target.value)} placeholder="e.g., self-aware" className="vfs-path-input"/>
                </div>
                <div className="image-gen-control-group">
                    <label>{t('knowledgeGraph_confidence')} ({confidence.toFixed(2)})</label>
                    <input type="range" min="0" max="1" step="0.1" value={confidence} onChange={e => setConfidence(parseFloat(e.target.value))} />
                </div>
                <div className="button-grid" style={{marginTop: '0.5rem'}}>
                    <button className="control-button implement-button" onClick={handleAdd} disabled={!subject || !predicate || !object}>{t('knowledgeGraph_add')}</button>
                </div>
            </Accordion>

            <div className="kg-content" style={{marginTop: '1rem'}}>
                {graph.length === 0 ? (
                    <div className="kg-placeholder">{t('knowledgeGraph_empty')}</div>
                ) : (
                    graph.map((fact) => (
                        <div 
                            className="kg-fact" 
                            key={fact.id}
                            style={{ 
                                opacity: 0.4 + (fact.strength * 0.6), 
                                gridTemplateColumns: '10px auto 1fr auto auto',
                                gridTemplateRows: fact.type && fact.type !== 'fact' ? 'auto auto' : 'auto',
                            }}
                            title={`STI: ${fact.STI?.toFixed(0) || 0}, LTI: ${fact.LTI?.toFixed(0) || 0}`}
                        >
                            <div className="kg-fact-confidence" style={{'--confidence': `${fact.confidence * 100}%`, gridRow: '1 / -1'} as React.CSSProperties} title={`${t('causalSelfModel_confidence')}: ${Math.round(fact.confidence * 100)}%`}></div>
                            
                            <FactTypeBadge type={fact.type} />
                            
                            <span className="kg-subject" style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2', gridColumn: '2 / 3' }}>{fact.subject}</span>
                            <span className="kg-predicate" style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2' }}>{fact.predicate}</span>
                            <span className="kg-object" style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2' }}>{fact.object}</span>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2' }}>
                                <AttentionBar value={fact.STI} max={ECAN_CONSTANTS.MAX_STI} color="var(--accent-color)" label="Short Term Importance" />
                                <AttentionBar value={fact.LTI} max={ECAN_CONSTANTS.MAX_LTI} color="var(--primary-color)" label="Long Term Importance" />
                            </div>

                            <button className="kg-delete-button" onClick={() => syscall('DELETE_FACT', fact.id)} title={t('knowledgeGraph_deleteFact')} style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2' }}>&times;</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});
