
// components/MechanisticInterpreterModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal.tsx';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { PerformanceLogEntry, CognitiveCircuit } from '../types.ts';

// Simple SVG renderer for the circuit
const CircuitVisualizer = ({ circuit }: { circuit: CognitiveCircuit }) => {
    const { nodes, edges } = circuit;
    
    // Simple layout algorithm
    const positions = useMemo(() => {
        const pos = new Map<string, { x: number, y: number }>();
        const inputs = nodes.filter(n => n.layer === 'input');
        const states = nodes.filter(n => n.layer === 'state');
        const concepts = nodes.filter(n => n.layer === 'concept');
        // Include backbone and wide_state for VWN compatibility
        const backbones = nodes.filter(n => n.layer === 'backbone');
        const wideStates = nodes.filter(n => n.layer === 'wide_state');
        const outputs = nodes.filter(n => n.layer === 'output');

        inputs.forEach((node, i) => pos.set(node.id, { x: 50, y: 50 + i * 60 }));
        
        // Standard Cognitive Architecture
        states.forEach((node, i) => pos.set(node.id, { x: 200, y: 50 + i * 50 }));
        concepts.forEach((node, i) => pos.set(node.id, { x: 350, y: 50 + i * 60 }));
        
        // VWN / Neural Surrogate Architecture (if present)
        backbones.forEach((node, i) => pos.set(node.id, { x: 200, y: 50 + i * 50 }));
        wideStates.forEach((node, i) => pos.set(node.id, { x: 350, y: 50 + i * 60 }));

        outputs.forEach((node, i) => pos.set(node.id, { x: 500, y: 150 + i * 60 }));

        return pos;
    }, [nodes]);

    if (!nodes || nodes.length === 0) {
        return <p>No circuit data to display.</p>;
    }

    return (
        <svg width="100%" height="300" viewBox="0 0 550 300" style={{ border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)'}}>
            {/* Edges */}
            {edges.map((edge, i) => {
                const sourcePos = positions.get(edge.source);
                const targetPos = positions.get(edge.target);
                if (!sourcePos || !targetPos) return null;
                return (
                    <g key={i}>
                        <line x1={sourcePos.x} y1={sourcePos.y} x2={targetPos.x} y2={targetPos.y} stroke="var(--border-color)" strokeWidth="1" opacity={0.5 + edge.weight * 0.5} />
                        <text x={(sourcePos.x + targetPos.x) / 2} y={(sourcePos.y + targetPos.y) / 2 - 5} fill="var(--text-muted)" fontSize="8">{edge.description}</text>
                    </g>
                );
            })}
            {/* Nodes */}
            {nodes.map(node => {
                const pos = positions.get(node.id);
                if (!pos) return null;
                
                // Determine color based on layer and properties
                let fill;
                if (node.layer === 'input') fill = 'var(--accent-color)';
                else if (node.layer === 'state') fill = 'var(--secondary-color)';
                else if (node.layer === 'concept') fill = 'var(--primary-color)';
                else if (node.layer === 'output') fill = 'var(--success-color)';
                else if (node.layer === 'backbone') {
                     // Differentiate backbone based on Fisher importance if available
                     if (node.fisherImportance && node.fisherImportance > 0.5) fill = 'var(--success-color)'; // Robust
                     else if (node.fisherImportance && node.fisherImportance < 0.3) fill = 'var(--failure-color)'; // Plastic
                     else fill = 'var(--warning-color)';
                }
                else if (node.layer === 'wide_state') fill = 'var(--guna-dharma)';
                else fill = 'var(--text-muted)';

                return (
                    <g key={node.id}>
                        <circle cx={pos.x} cy={pos.y} r="5" fill={fill} />
                        <text x={pos.x} y={pos.y + 15} fill="var(--text-color)" fontSize="10" textAnchor="middle">{node.label}</text>
                         {node.value && <text x={pos.x} y={pos.y + 28} fill="var(--text-muted)" fontSize="8" textAnchor="middle">({node.value})</text>}
                    </g>
                );
            })}
        </svg>
    );
};


export const MechanisticInterpreterModal = ({ isOpen, onClose, payload }: { isOpen: boolean; onClose: () => void; payload: { log: PerformanceLogEntry | null } }) => {
    // FIX: Correctly destructure `payload` from props and then `log` from `payload` to match the type annotation and resolve the error.
    const { log } = payload;
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    const [circuit, setCircuit] = useState<CognitiveCircuit | null>(null);
    const [status, setStatus] = useState<'idle' | 'interpreting' | 'complete' | 'error'>('idle');

    useEffect(() => {
        if (isOpen && log && status === 'idle') {
            const interpret = async () => {
                setStatus('interpreting');
                try {
                    const result = await geminiAPI.inferCognitiveCircuit(log);
                    if (result) {
                        setCircuit(result);
                        setStatus('complete');
                    } else {
                        throw new Error("API returned no circuit.");
                    }
                } catch (e) {
                    setStatus('error');
                    addToast(`Failed to infer circuit: ${(e as Error).message}`, 'error');
                }
            };
            interpret();
        } else if (!isOpen) {
            // Reset on close
            setStatus('idle');
            setCircuit(null);
        }
    }, [isOpen, log, status, geminiAPI, addToast]);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('mechanisticInterpreter_title')} className="advanced-controls-modal">
            {status === 'interpreting' && (
                <div className="processing-indicator" style={{minHeight: '200px'}}>
                    {t('mechanisticInterpreter_interpreting')} <div className="spinner"></div>
                </div>
            )}
             {status === 'error' && (
                <div className="failure-reason-display">
                    {t('mechanisticInterpreter_error')}
                </div>
            )}
            {status === 'complete' && circuit && (
                <CircuitVisualizer circuit={circuit} />
            )}
        </Modal>
    );
};
