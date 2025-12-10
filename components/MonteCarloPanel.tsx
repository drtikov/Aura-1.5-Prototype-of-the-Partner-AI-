
import React, { useState } from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { MonteCarloNode, KernelTaskType } from '../types.ts';
import { Accordion } from './Accordion.tsx';

const NodeDisplay: React.FC<{ node: MonteCarloNode, tree: { [id: string]: MonteCarloNode }, depth?: number }> = ({ node, tree, depth = 0 }) => {
    const isPruned = node.status === 'pruned';
    const isSelected = node.status === 'selected' || node.type === 'root';
    
    const style = {
        marginLeft: `${depth * 20}px`,
        borderLeft: isPruned ? '2px solid var(--failure-color)' : isSelected ? '2px solid var(--success-color)' : '2px solid var(--border-color)',
        padding: '0.5rem',
        background: isPruned ? 'rgba(255,0,0,0.05)' : 'rgba(0,0,0,0.2)',
        marginBottom: '0.5rem',
        opacity: isPruned ? 0.6 : 1
    };

    return (
        <div>
            <div style={style}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}>
                    <span style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>{node.type.toUpperCase()}</span>
                    <span>Score: {node.score.toFixed(2)} (LLM: {node.llmQuality.toFixed(2)} | HAL: {node.localRelevance.toFixed(2)})</span>
                </div>
                <p style={{margin: '0.25rem 0', fontSize: '0.9rem'}}>{node.content}</p>
            </div>
            {node.childrenIds.map(childId => {
                const child = tree[childId];
                if (child) return <NodeDisplay key={child.id} node={child} tree={tree} depth={depth + 1} />;
                return null;
            })}
        </div>
    );
};

export const MonteCarloPanel = () => {
    const { monteCarloState } = useCoreState();
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [goal, setGoal] = useState('');

    const handleStart = () => {
        if (!goal.trim()) return;
        syscall('KERNEL/QUEUE_TASK', {
            id: `mc_${Date.now()}`,
            type: KernelTaskType.RUN_MONTE_CARLO_SEARCH,
            payload: { goal },
            timestamp: Date.now()
        });
        addToast('Monte Carlo search initiated.', 'info');
    };

    const { status, rootId, tree } = monteCarloState;

    return (
        <div className="side-panel">
            <p className="reason-text">
                The Monte Carlo Reasoner uses System 2 thinking to build a probability tree of potential future thoughts. It hybridizes LLM intuition with fast, local mathematical scoring (HAL Primitives) to verify reasoning steps before committing to them.
            </p>
            
            <div className="image-gen-control-group">
                <label>Goal / Problem</label>
                <textarea 
                    value={goal} 
                    onChange={e => setGoal(e.target.value)} 
                    placeholder="Enter a complex problem..." 
                    rows={3}
                    disabled={status === 'planning' || status === 'evaluating'}
                />
            </div>
            
            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button 
                    className="control-button" 
                    onClick={handleStart}
                    disabled={!goal.trim() || status === 'planning'}
                >
                    {status === 'planning' ? 'Thinking (MCTS)...' : 'Initiate System 2 Search'}
                </button>
            </div>

            <div className="panel-subsection-title" style={{marginTop: '1.5rem'}}>Search Tree Visualization</div>
            {rootId && tree[rootId] ? (
                <div className="tree-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    <NodeDisplay node={tree[rootId]} tree={tree} />
                </div>
            ) : (
                <div className="kg-placeholder">Tree is empty.</div>
            )}
        </div>
    );
};
