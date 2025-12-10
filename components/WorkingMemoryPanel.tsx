
// components/WorkingMemoryPanel.tsx
import React, { useMemo } from 'react';
import { useMemoryState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { KnowledgeFact, Episode } from '../types.ts';
import { ECAN_CONSTANTS } from '../constants.ts';

export const WorkingMemoryPanel = React.memo(() => {
    const { knowledgeGraph, episodicMemoryState } = useMemoryState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    // Combine Facts and Episodes, filter by STI > Threshold, sort by STI
    const attentionalFocus = useMemo(() => {
        const facts = knowledgeGraph.map(f => ({ ...f, type: 'fact' as const }));
        const episodes = episodicMemoryState.episodes.map(e => ({ ...e, type: 'episode' as const }));
        
        const allItems = [...facts, ...episodes];
        
        return allItems
            .filter(item => (item.STI || 0) > ECAN_CONSTANTS.ATTENTION_THRESHOLD)
            .sort((a, b) => (b.STI || 0) - (a.STI || 0))
            .slice(0, 15); // Top 15 items
    }, [knowledgeGraph, episodicMemoryState.episodes]);

    return (
        <div className="working-memory-panel">
            <div className="working-memory-header">
                <h4>Attentional Focus (STI > {ECAN_CONSTANTS.ATTENTION_THRESHOLD})</h4>
                <button className="clear-wm-button" onClick={() => syscall('CLEAR_WORKING_MEMORY', {})}>Clear</button>
            </div>
            {attentionalFocus.length === 0 ? (
                <div className="kg-placeholder" style={{fontSize: '0.8rem'}}>Focus is empty. Access facts to boost them.</div>
            ) : (
                <ul>
                    {attentionalFocus.map((item, index) => {
                        const isFact = item.type === 'fact';
                        // Type narrowing for Fact vs Episode
                        const label = isFact 
                            ? `${(item as KnowledgeFact).subject} ${(item as KnowledgeFact).predicate} ${(item as KnowledgeFact).object}`
                            : `Ep: ${(item as Episode).title}`;
                        
                        const sti = item.STI || 0;
                        const opacity = Math.max(0.3, sti / ECAN_CONSTANTS.MAX_STI);

                        return (
                            <li key={item.id || index} style={{ opacity, borderColor: isFact ? 'var(--primary-color)' : 'var(--accent-color)' }} title={`STI: ${sti.toFixed(0)}`}>
                                {label}
                                <span style={{fontSize: '0.6rem', opacity: 0.7}}>({sti.toFixed(0)})</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
});
