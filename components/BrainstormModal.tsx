
// components/BrainstormModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext.tsx';
import { BrainstormIdea, Persona, KernelTaskType } from '../types.ts';
import { HAL } from '../core/hal.ts';
import { personas as allRegisteredPersonas } from '../state/personas.ts';
import { SafeMarkdown } from './SafeMarkdown.tsx';

// Re-using the results display logic from BrainstormingPanel
const BrainstormResults = ({ topic, ideas, winningIdea, onCopy }: { topic: string | null; ideas: BrainstormIdea[]; winningIdea: string | null; onCopy: () => void }) => {
    const { t } = useLocalization();
    const uniqueParticipants = useMemo(() => Array.from(new Set(ideas.map(i => i.personaName))), [ideas]);

    return (
        <div className="brainstorming-panel">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button className="control-button" onClick={onCopy} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                    {t('brainstorm_copy_all')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('brainstorm_topic')}</div>
            <p className="reason-text"><em>"{topic}"</em></p>

            {uniqueParticipants.length > 0 && (
                <>
                    <div className="panel-subsection-title">Council of Innovators</div>
                    <div className="participants-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                        {uniqueParticipants.map(name => (
                            <div key={name} className="skill-tag" style={{ justifyContent: 'center' }}>{name}</div>
                        ))}
                    </div>
                </>
            )}

            <div className="panel-subsection-title">{t('brainstorm_ideas')}</div>
            {ideas.map((idea: BrainstormIdea, index: number) => (
                <div key={index} className="axiom-card">
                    <div className="mod-log-header">
                        <span className="mod-log-type">{idea.personaName}</span>
                    </div>
                    <p className="axiom-card-text" style={{ fontStyle: 'normal' }}>{idea.idea}</p>
                </div>
            ))}

            {winningIdea && (
                <>
                    <div className="panel-subsection-title">{t('brainstorm_winner')}</div>
                     <div className="axiom-card accepted" style={{ borderLeftColor: 'var(--accent-color)' }}>
                        <div className="mod-log-header">
                            <span className="mod-log-type" style={{ color: 'var(--accent-color)' }}>🏆 The Strategist's Verdict</span>
                        </div>
                        <div className="axiom-card-text">
                            <SafeMarkdown text={winningIdea} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const BrainstormModal = ({ isOpen, onClose, initialTopic, personas: customPersonasProp }: { isOpen: boolean; onClose: () => void; initialTopic?: string; personas?: Persona[] }) => {
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const { brainstormState } = useCoreState();
    
    const [localStatus, setLocalStatus] = useState<'input' | 'generating' | 'results'>('input');
    const [topic, setTopic] = useState(initialTopic || '');

    // Reset local state when modal is closed/reopened
    useEffect(() => {
        if (isOpen) {
            setLocalStatus('input');
            setTopic(initialTopic || '');
            // Reset the global state for a fresh session
            syscall('BRAINSTORM/RESET', {});
        }
    }, [isOpen, initialTopic, syscall]);

    // Listen to global state changes to update UI
    useEffect(() => {
        if (brainstormState.status === 'brainstorming' || brainstormState.status === 'proposing') {
            setLocalStatus('generating');
        } else if (brainstormState.status === 'complete') {
            if (brainstormState.ideas.length > 0) {
                // Results are ready, switch to results view
                setLocalStatus('results');
            } else {
                // This is the error/empty case. Reset the modal to the input state for a retry.
                setLocalStatus('input');
            }
        } else if (brainstormState.status === 'idle') {
            // If the global state resets to idle (e.g. on error), ensure we aren't stuck in generating
            setLocalStatus((prev) => (prev === 'generating' ? 'input' : prev));
        }
    }, [brainstormState.status, brainstormState.ideas]);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            addToast(t('brainstorm_prompt_required_toast', { defaultValue: 'Please enter a topic to brainstorm.' }), 'warning');
            return;
        }
        
        // --- EXTENDED BRAINSTORMING ALGORITHM ---
        
        // 1. Core Council of Innovators (ALL)
        const innovatorIds = [
            'nikola_tesla', 'steve_jobs', 'leonardo_da_vinci', 'richard_feynman', 
            'albert_einstein', 'elon_musk', 'r_buckminster_fuller', 'ray_kurzweil', 
            'saul_griffith', 'henri_poincare', 'grigori_perelman', 'andrey_kolmogorov', 
            'walter_russell'
        ];

        // 2. Specialist Mathematicians (ALL)
        const mathematicianIds = ['terence_tao', 'stanislav_smirnov'];

        // 3. Sci-Fi Guest (SELECT 1)
        const scifiIds = [
            'isaac_asimov', 'philip_k_dick', 'arthur_c_clarke', 'william_gibson', 
            'stanislaw_lem', 'iain_m_banks', 'greg_egan', 'ted_chiang'
        ];

        // Helper to find personas
        const findPersonas = (ids: string[]) => ids.map(id => allRegisteredPersonas.find(p => p.id === id)).filter(Boolean) as Persona[];

        const innovators = findPersonas(innovatorIds);
        const mathematicians = findPersonas(mathematicianIds);
        const scifiPool = findPersonas(scifiIds);

        // Select 1 Sci-Fi Guest
        let scifiGuest: Persona | null = null;
        if (scifiPool.length > 0) {
            scifiGuest = scifiPool[Math.floor(Math.random() * scifiPool.length)];
        }

        // 4. Random Persona (SELECT 1 from remaining)
        // Exclude anyone already selected (innovators, mathematicians, scifiGuest)
        const usedIds = new Set([...innovatorIds, ...mathematicianIds, scifiGuest?.id]);
        const randomPool = allRegisteredPersonas.filter(p => !usedIds.has(p.id));
        
        let randomGuest: Persona | null = null;
        if (randomPool.length > 0) {
            randomGuest = randomPool[Math.floor(Math.random() * randomPool.length)];
        }

        // Assemble the final team
        const personasToUse = [...innovators, ...mathematicians];
        if (scifiGuest) personasToUse.push(scifiGuest);
        if (randomGuest) personasToUse.push(randomGuest);

        console.log("Brainstorming with:", personasToUse.map(p => p.name));

        // Queue the task
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_brainstorm_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_BRAINSTORM_SESSION,
            payload: { triageResult: { goal: topic }, customPersonas: personasToUse },
            timestamp: Date.now(),
        });

        setLocalStatus('generating');
        addToast(t('brainstorm_started_toast'), 'info');
    };

    const handleStartNew = () => {
        syscall('BRAINSTORM/START', { topic: '' }); // Reset global state
        syscall('BRAINSTORM/FINALIZE', {});
        setLocalStatus('input');
        setTopic('');
    };

    const handleCopyAll = () => {
        let fullText = `Brainstorming Session\n`;
        fullText += `Topic: ${brainstormState.topic}\n\n`;
        
        const participants = Array.from(new Set(brainstormState.ideas.map(i => i.personaName)));
        fullText += `--- COUNCIL OF INNOVATORS ---\n${participants.join(', ')}\n\n`;

        fullText += `--- IDEAS ---\n\n`;
        brainstormState.ideas.forEach(idea => {
            fullText += `${idea.personaName}:\n${idea.idea}\n\n`;
        });
        if (brainstormState.winningIdea) {
            fullText += `--- WINNER (THE STRATEGIST) ---\n\n${brainstormState.winningIdea}\n`;
        }
        HAL.Clipboard.writeText(fullText.trim()).then(() => {
            addToast(t('brainstorm_copy_all_success'), 'success');
        }, () => {
            addToast(t('brainstorm_copy_all_failed'), 'error');
        });
    };

    const renderContent = () => {
        switch (localStatus) {
            case 'input':
                return (
                    <div className="trace-section"> 
                        <h4>{t('brainstorm_config')}</h4> 
                        <p>{t('brainstorm_guide')}</p> 
                        <textarea 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            placeholder={t('brainstorm_topic_hint')} 
                            rows={4} 
                        /> 
                         <div style={{marginTop: '1rem'}}>
                            <strong style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Council of Innovators (Default):</strong>
                            <div className="participants-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>Nikola Tesla</span><span>Steve Jobs</span><span>Leonardo da Vinci</span><span>Richard Feynman</span><span>Albert Einstein</span><span>Elon Musk</span><span>Buckminster Fuller</span><span>Ray Kurzweil</span><span>Saul Griffith</span><span>Henri Poincaré</span><span>Grigori Perelman</span><span>Andrey Kolmogorov</span><span>Walter Russell</span><span>Terence Tao</span><span>Stanislav Smirnov</span><span>+ Sci-Fi & Random Guest</span>
                            </div>
                        </div>
                    </div>
                );
            case 'generating':
                 return (
                    <div className="kg-placeholder" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '200px'}}>
                        <div className="spinner-small"></div>
                        <span>{t('brainstorm_processing')}</span>
                    </div>
                );
            case 'results':
                return <BrainstormResults topic={brainstormState.topic} ideas={brainstormState.ideas} winningIdea={brainstormState.winningIdea} onCopy={handleCopyAll} />;
        }
    };

    const renderFooter = () => {
        const isGenerating = localStatus === 'generating';
        switch (localStatus) {
            case 'input':
                return (
                    <>
                        <button className="proposal-reject-button" onClick={onClose} disabled={isGenerating}>{t('brainstorm_cancel')}</button>
                        <button className="proposal-approve-button" onClick={handleGenerate} disabled={isGenerating || !topic.trim()}>{t('brainstorm_generate')}</button>
                    </>
                );
            case 'generating':
                return null; // No footer while generating
            case 'results':
                return (
                     <>
                        <button className="proposal-reject-button" onClick={handleStartNew}>{t('brainstorm_start_new')}</button>
                        <button className="proposal-approve-button" onClick={onClose}>{t('brainstorm_close')}</button>
                    </>
                );
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('brainstorm_session')} 
            footer={renderFooter()}
            className="advanced-controls-modal" // Use large modal style
        >
            {renderContent()}
        </Modal>
    );
};
