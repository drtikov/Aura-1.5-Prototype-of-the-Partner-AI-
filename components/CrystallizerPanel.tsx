
// components/CrystallizerPanel.tsx
import React, { useState } from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { CrystallizedSkill } from '../types.ts';
import { Accordion } from './Accordion.tsx';
import { HAL } from '../core/hal';

export const CrystallizerPanel = () => {
    const { selfProgrammingState } = useArchitectureState();
    const { t } = useLocalization();
    const { syscall, addToast, handleManualCreateSkill } = useAuraDispatch();
    
    const skills = Object.values(selfProgrammingState.skillLibrary || {}) as CrystallizedSkill[];

    // Manual creation state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [triggerPattern, setTriggerPattern] = useState('');
    const [code, setCode] = useState('import re\n\n# Input available as "input_str"\nprint(f"Echo: {input_str}")');

    const handleDeleteSkill = (skillId: string, skillName: string) => {
        if (HAL.UI.confirm(`Are you sure you want to delete the skill "${skillName}"? This reflex will be lost.`)) {
            syscall('CRYSTALLIZER/DELETE_SKILL', { skillId });
            addToast(`Skill "${skillName}" deleted.`, 'info');
        }
    };

    const handleCreate = () => {
        if (!name || !triggerPattern || !code) {
            addToast('Name, Trigger Regex, and Code are required.', 'warning');
            return;
        }
        
        const newSkill: CrystallizedSkill = {
            id: `skill_manual_${Date.now()}`,
            name,
            description: description || 'Manually forged reflex',
            triggerPattern,
            code,
            language: 'python',
            usageCount: 0,
            lastUsed: Date.now()
        };
        
        handleManualCreateSkill(newSkill);
        // Reset form
        setName('');
        setDescription('');
        setTriggerPattern('');
        setCode('import re\n\n# Input available as "input_str"\nprint(f"Echo: {input_str}")');
    };

    return (
        <div className="side-panel crystallizer-panel">
            <p className="reason-text">
                The Crystallizer Engine detects repetitive tasks (Novelty) and compiles them into automated reflexes (Automaticity). You can also manually forge reflexes here.
            </p>
            
            <Accordion title="Manual Skill Forge (Python)" defaultOpen={false}>
                 <div className="image-gen-control-group">
                    <label>Skill Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Calculate Pi" className="vfs-path-input"/>
                </div>
                <div className="image-gen-control-group">
                    <label>Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" className="vfs-path-input"/>
                </div>
                 <div className="image-gen-control-group">
                    <label>Trigger Regex (JavaScript)</label>
                    <input type="text" value={triggerPattern} onChange={e => setTriggerPattern(e.target.value)} placeholder="e.g., ^calc pi$" className="vfs-path-input"/>
                </div>
                 <div className="image-gen-control-group">
                    <label>Python Logic</label>
                    <textarea value={code} onChange={e => setCode(e.target.value)} rows={6} className="vfs-path-input" style={{fontFamily: 'monospace'}}/>
                </div>
                 <div className="button-grid" style={{marginTop: '0.5rem'}}>
                    <button className="control-button implement-button" onClick={handleCreate}>Forge Reflex</button>
                </div>
            </Accordion>
            
            <div className="synaptic-metrics" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                <div className="metric-item">
                    <span className="metric-label">Crystallized Skills</span>
                    <span className="metric-value" style={{color: 'var(--accent-color)'}}>{skills.length}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Total Executions</span>
                    <span className="metric-value">{skills.reduce((acc, s) => acc + s.usageCount, 0)}</span>
                </div>
            </div>

            <div className="panel-subsection-title">Skill Library</div>
            {skills.length === 0 ? (
                <div className="kg-placeholder">No skills have been crystallized yet. Repeatedly perform a task to trigger crystallization or forge one manually.</div>
            ) : (
                skills.map((skill: CrystallizedSkill) => (
                    <Accordion key={skill.id} title={skill.name} summary={`${skill.usageCount} runs`}>
                         <div className="workflow-content">
                            <p className="workflow-description"><em>{skill.description}</em></p>
                            <p className="workflow-trigger" style={{fontSize: '0.8rem'}}><strong>Trigger Regex:</strong> <code>{skill.triggerPattern}</code></p>
                            <div className="code-snippet-container">
                                <pre><code>{skill.code}</code></pre>
                            </div>
                            <div className="proposal-actions-footer">
                                <button 
                                    className="control-button reject-button" 
                                    onClick={() => handleDeleteSkill(skill.id, skill.name)}
                                    style={{fontSize: '0.7rem', padding: '0.3rem 0.6rem'}}
                                >
                                    Delete Skill
                                </button>
                            </div>
                        </div>
                    </Accordion>
                ))
            )}
        </div>
    );
};
