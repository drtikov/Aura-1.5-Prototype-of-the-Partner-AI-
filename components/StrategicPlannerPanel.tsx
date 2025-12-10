
// components/StrategicPlannerPanel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { usePlanningState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { Goal, GoalTree } from '../types.ts';
import { useModal } from '../context/ModalContext.tsx';
import { personas } from '../state/personas.ts';
import { Accordion } from './Accordion.tsx';
import { HAL } from '../core/hal.ts';

// Helper for recursive updates to avoid prop drilling issues
const GoalNode = React.memo(({ goalId, goalTree, level = 0, onStatusChange, onDelete, onDecompose, onAddSubgoal }: { 
    goalId: string; 
    goalTree: { [id: string]: Goal }; 
    level?: number;
    onStatusChange: (id: string, status: Goal['status']) => void;
    onDelete: (id: string) => void;
    onDecompose: (id: string, description: string) => void;
    onAddSubgoal: (id: string) => void;
}) => {
    const goal = goalTree[goalId];
    const { t } = useLocalization();
    const [isHovered, setIsHovered] = useState(false);
    const [isDecomposing, setIsDecomposing] = useState(false);

    if (!goal) return null;

    const getStatusKey = (status: Goal['status']) => {
        switch(status) {
            case 'not_started': return 'goalStatus_not_started';
            case 'in_progress': return 'goalStatus_in_progress';
            case 'completed': return 'goalStatus_completed';
            case 'failed': return 'goalStatus_failed';
            case 'proving': return 'goalStatus_proving';
            default: return status;
        }
    };

    const getStatusColor = (status: Goal['status']) => {
        switch(status) {
            case 'completed': return 'var(--success-color)';
            case 'failed': return 'var(--failure-color)';
            case 'in_progress': return 'var(--warning-color)';
            default: return 'var(--text-muted)';
        }
    };

    // Resolve proper name from persona ID
    const assignedPersonaObj = goal.personaId ? personas.find(p => p.id === goal.personaId) : null;
    // Handle case where name might be a translation key
    const assignedPersonaName = assignedPersonaObj 
        ? (assignedPersonaObj.name.startsWith('plugin_') ? t(assignedPersonaObj.name) : assignedPersonaObj.name)
        : null;

    const cycleStatus = (e: React.MouseEvent) => {
        e.stopPropagation();
        const map: Record<Goal['status'], Goal['status']> = {
            'not_started': 'in_progress',
            'in_progress': 'completed',
            'completed': 'not_started',
            'failed': 'not_started',
            'proving': 'not_started'
        };
        onStatusChange(goal.id, map[goal.status]);
    };

    const handleDecomposeClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDecomposing(true);
        await onDecompose(goal.id, goal.description);
        setIsDecomposing(false);
    };

    const handleAddSubgoalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddSubgoal(goal.id);
    };

    return (
        <div className="goal-node-wrapper" style={{ marginLeft: level * 12 + 'px', position: 'relative' }}>
            <div 
                className={`goal-tree-item status-${goal.status}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ position: 'relative', borderLeftColor: getStatusColor(goal.status) }}
            >
                <div className="goal-tree-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <button 
                        className={`status-indicator-dot status-${goal.status}`}
                        onClick={cycleStatus}
                        title="Click to cycle status"
                        style={{
                            width: '12px', height: '12px', borderRadius: '50%', 
                            border: 'none', cursor: 'pointer', flexShrink: 0,
                            backgroundColor: getStatusColor(goal.status)
                        }}
                    />
                    <span className="goal-tree-description" style={{ flexGrow: 1 }}>{goal.description}</span>
                    
                    {/* Action Buttons visible on hover */}
                    <div className="goal-actions" style={{ display: 'flex', gap: '0.25rem', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}>
                        <button
                            className="control-button"
                            style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
                            onClick={handleAddSubgoalClick}
                            title="Add Subgoal"
                        >
                            +
                        </button>
                        {(!goal.children || goal.children.length === 0) && (
                            <button 
                                className="control-button" 
                                style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
                                onClick={handleDecomposeClick}
                                disabled={isDecomposing}
                                title="AI Decompose"
                            >
                                {isDecomposing ? '...' : '⚡'}
                            </button>
                        )}
                        <button 
                            className="control-button reject-button" 
                            style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
                            onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }}
                            title="Delete Goal"
                        >
                            &times;
                        </button>
                    </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <span className={`goal-status status-${goal.status}`} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {t(getStatusKey(goal.status))}
                    </span>
                    {(assignedPersonaName || goal.type === 'RESEARCH') && (
                        <div className="goal-tags" style={{fontSize: '0.7rem'}}>
                            {assignedPersonaName && <span style={{color: 'var(--primary-color)'}}>{assignedPersonaName}</span>}
                        </div>
                    )}
                </div>

                <div className="goal-tree-progress-container" style={{marginTop: '0.25rem'}}>
                    <div 
                        className="goal-tree-progress-bar"
                        style={{ width: `${goal.progress * 100}%`, backgroundColor: getStatusColor(goal.status)}}
                    ></div>
                </div>
                 {goal.status === 'failed' && goal.failureReason && (
                    <div className="failure-reason-display" style={{marginTop: '0.5rem', fontSize: '0.75rem'}}>
                        {goal.failureReason}
                    </div>
                )}
            </div>
            {goal.children && goal.children.length > 0 && (
                <div className="goal-children-container">
                     {goal.children.map(childId => (
                        <GoalNode 
                            key={childId} 
                            goalId={childId} 
                            goalTree={goalTree} 
                            level={level + 1}
                            onStatusChange={onStatusChange}
                            onDelete={onDelete}
                            onDecompose={onDecompose}
                            onAddSubgoal={onAddSubgoal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export const StrategicPlannerPanel = React.memo(() => {
    const { goalTree, activeStrategicGoalId: activeGoalId } = usePlanningState();
    const { t } = useLocalization();
    const { syscall, geminiAPI, addToast } = useAuraDispatch();
    const modal = useModal();
    
    const [symbolicPlan, setSymbolicPlan] = useState<string | null>(null);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    useEffect(() => {
        if (activeGoalId && goalTree[activeGoalId]) {
            const generatePlan = async () => {
                setIsGeneratingPlan(true);
                // Keep existing plan if available while regenerating to prevent flicker, or set null if you want to show loading state explicitly.
                // Here we let it update in background.
                try {
                    const plan = await geminiAPI.generateSymbolicPlan(goalTree, activeGoalId);
                    setSymbolicPlan(plan);
                } catch (e) {
                    setSymbolicPlan(`// Error generating symbolic plan: ${(e as Error).message}`);
                } finally {
                    setIsGeneratingPlan(false);
                }
            };
            // Generate only if we don't have one yet for this root ID (simple cache check)
            // In a real app, we might want to regenerate on significant tree changes.
            if (!symbolicPlan) generatePlan();
        } else {
            setSymbolicPlan(null);
        }
    }, [activeGoalId, geminiAPI]); // removed goalTree dependency to prevent constant regeneration on small updates

    const handleStatusChange = useCallback((id: string, status: Goal['status']) => {
        syscall('UPDATE_GOAL_STATUS', { id, status });
    }, [syscall]);

    const handleDelete = useCallback((id: string) => {
        if (HAL.UI.confirm("Delete this goal and all its sub-goals?")) {
            syscall('DELETE_GOAL', { id });
        }
    }, [syscall]);

    const handleDecompose = useCallback(async (id: string, description: string) => {
        try {
            const subtasks = await geminiAPI.decomposeGoal(description);
            if (subtasks.length > 0) {
                subtasks.forEach(task => {
                    syscall('ADD_SUBGOAL', { parentId: id, description: task });
                });
                addToast(`Decomposed into ${subtasks.length} subtasks.`, 'success');
            } else {
                addToast('AI could not decompose this task further.', 'warning');
            }
        } catch (e) {
            addToast(`Decomposition failed: ${(e as Error).message}`, 'error');
        }
    }, [geminiAPI, syscall, addToast]);
    
    const handleAddSubgoal = useCallback((parentId: string) => {
        const description = prompt("Enter description for new subgoal:");
        if (description) {
            syscall('ADD_SUBGOAL', { parentId, description });
        }
    }, [syscall]);

    return (
        <div className="side-panel goals-panel">
            {activeGoalId && goalTree[activeGoalId] ? (
                <div className="goal-tree-container">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                        <h3 style={{margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-color)'}}>
                            Strategic Tree
                        </h3>
                        <button className="control-button" style={{width: 'auto', fontSize: '0.7rem'}} onClick={() => syscall('PLANNING/CLEAR_ACTIVE_GOAL', {})}>
                            Clear Plan
                        </button>
                    </div>
                    
                    <GoalNode 
                        goalId={activeGoalId} 
                        goalTree={goalTree} 
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onDecompose={handleDecompose}
                        onAddSubgoal={handleAddSubgoal}
                    />
                    
                    <Accordion title={t('symbolic_plan_title')} defaultOpen={false}>
                        <p className="reason-text">{t('symbolic_plan_description')}</p>
                        <div className="code-snippet-container">
                            <pre><code>
                                {isGeneratingPlan ? 'Generating symbolic representation...' : (symbolicPlan || 'Plan not yet generated.')}
                            </code></pre>
                        </div>
                    </Accordion>
                </div>
            ) : (
                <div className="kg-placeholder">
                    {t('strategicPlanner_placeholder')}
                    <div className="button-grid" style={{marginTop: '1rem'}}>
                        <button className="control-button" onClick={() => modal.open('strategicGoal', {})}>
                            {t('setGoal')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});
