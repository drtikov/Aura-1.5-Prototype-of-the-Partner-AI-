
// components/BusinessNetworkPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization, useCoreState } from '../context/AuraContext.tsx';
import { KernelTaskType, SocialGraphNode } from '../types.ts';

export const BusinessNetworkPanel = () => {
    const { t } = useLocalization();
    const { syscall, addToast, geminiAPI } = useAuraDispatch();
    const { socialCognitionState } = useCoreState();
    
    const [synergies, setSynergies] = useState<any[] | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleActivateAnalyst = () => {
        syscall('UPDATE_PERSONALITY_STATE', { dominantPersona: 'business_analyst' });
        addToast(t('businessNetwork_analyst_activated'), 'success');
    };
    
    const handleAnalyzeMarket = () => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_MARKET_ANALYSIS,
            payload: {},
            timestamp: Date.now(),
        });
        addToast(t('businessNetwork_analysis_started'), 'info');
    };

    const handleFindSynergies = async () => {
        const nodes = Object.values(socialCognitionState.socialGraph) as SocialGraphNode[];
        if (nodes.length < 2) {
            addToast("Not enough entities in network to find synergies.", "warning");
            return;
        }
        
        setIsAnalyzing(true);
        try {
            const entityList = nodes.map(n => `- ${n.name} (${n.type}): ${n.summary}`).join('\n');
            const prompt = `Analyze the following business network entities and identify 2 potential strategic synergies or partnerships. Return a JSON array of objects with 'title' and 'description'.\n\nEntities:\n${entityList}`;
            
            const response = await geminiAPI.generateChatResponse(
                [{ from: 'user', text: prompt, id: 'temp-id-1', timestamp: Date.now() }],
                null,
                null
            );
            
            let fullText = '';
            for await (const chunk of response) {
                fullText += chunk.text;
            }
            
            const jsonStr = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonStr);
            
            if (Array.isArray(result)) {
                setSynergies(result);
                addToast("Synergies identified.", "success");
            }
        } catch(e) {
            addToast("Failed to analyze network.", "error");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('businessNetwork_description')}</p>

            <div className="panel-subsection-title">{t('businessNetwork_ask_analyst')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem' }}>{t('businessNetwork_ask_analyst_desc')}</p>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleActivateAnalyst}>
                    {t('businessNetwork_activate_analyst_button')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('businessNetwork_market_insights')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem' }}>{t('businessNetwork_market_insights_desc')}</p>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleAnalyzeMarket}>
                    {t('businessNetwork_analyze_market_button')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('businessNetwork_synergy_finder')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem' }}>{t('businessNetwork_synergy_finder_desc')}</p>
            
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleFindSynergies} disabled={isAnalyzing}>
                    {isAnalyzing ? "Scanning..." : "Scan for Synergies"}
                </button>
            </div>

            {synergies && (
                <div className="synergy-proposals" style={{ marginTop: '1rem' }}>
                    {synergies.map((syn, i) => (
                        <div key={i} className="proposal-card">
                            <div className="proposal-card-body">
                                <p><strong>{syn.title}</strong></p>
                                <p style={{ fontSize: '0.85rem' }}>{syn.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
