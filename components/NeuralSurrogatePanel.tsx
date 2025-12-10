
// components/NeuralSurrogatePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { Sparkline } from './Sparkline';
import { HAL } from '../core/hal';
import { NeuralSurrogateCircuit } from '../types';

const CircuitVisualizer = ({ circuit }: { circuit: NeuralSurrogateCircuit }) => {
    const { nodes, edges } = circuit;
    const height = 250;
    const width = 400;
    
    // Updated positions for VWN architecture: Input -> Backbone -> Wide -> Output
    const layerX = { input: 30, backbone: 140, wide_state: 260, output: 370 };
    
    // Group nodes by layer
    const layers = { input: [], backbone: [], wide_state: [], output: [] } as any;
    nodes.forEach(n => {
        if (layers[n.layer]) layers[n.layer].push(n);
    });
    
    // Calculate Y positions dynamically based on count in layer
    const getY = (layerName: string, index: number) => {
        const count = layers[layerName].length;
        const spacing = height / (count + 1);
        return (index + 1) * spacing;
    };
    
    const nodePos: any = {};
    nodes.forEach(n => {
        const index = layers[n.layer].indexOf(n);
        nodePos[n.id] = { x: layerX[n.layer as keyof typeof layerX], y: getY(n.layer, index) };
    });

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', border: '1px solid var(--border-color)'}}>
             {/* Edges */}
            {edges.map((e, i) => {
                const start = nodePos[e.source];
                const end = nodePos[e.target];
                if (!start || !end) return null;
                const opacity = Math.min(1, Math.abs(e.weight) * 2); // Scale opacity by weight
                const color = e.weight > 0 ? 'var(--primary-color)' : 'var(--failure-color)';
                return (
                    <line 
                        key={i} 
                        x1={start.x} y1={start.y} 
                        x2={end.x} y2={end.y} 
                        stroke={color} 
                        strokeWidth={1 + Math.abs(e.weight)} 
                        opacity={opacity} 
                    />
                );
            })}
            {/* Nodes */}
            {nodes.map(n => {
                const pos = nodePos[n.id];
                if (!pos) return null;
                
                // Backbone nodes are highlighted as the bottleneck
                const r = n.layer === 'backbone' ? 5 + n.activation * 2 : 3 + n.activation * 4; 
                
                // Color based on Fisher Importance (Robustness/Curvature) if available
                let fill;
                if (n.layer === 'backbone') {
                    const imp = n.fisherImportance || 0;
                    // High curvature (Fisher) -> Robust -> Blue/Cyan
                    // Low curvature -> Plastic -> Red/Orange
                    if (imp > 0.5) fill = 'var(--success-color)'; 
                    else if (imp < 0.3) fill = 'var(--failure-color)'; 
                    else fill = 'var(--guna-dharma)';
                } else {
                    // Other layers standard color
                    fill = 'var(--accent-color)';
                }
                
                return (
                    <g key={n.id}>
                        <circle cx={pos.x} cy={pos.y} r={r} fill={fill} stroke="var(--border-color)" />
                        <text x={pos.x} y={pos.y - 8} fontSize="8" fill="var(--text-muted)" textAnchor="middle">{n.label}</text>
                    </g>
                );
            })}
            {/* Labels */}
             <text x={30} y={240} fontSize="9" fill="var(--text-muted)" textAnchor="middle">Input</text>
             <text x={140} y={240} fontSize="9" fill="var(--text-muted)" textAnchor="middle">Backbone</text>
             <text x={260} y={240} fontSize="9" fill="var(--text-muted)" textAnchor="middle">Wide State</text>
             <text x={370} y={240} fontSize="9" fill="var(--text-muted)" textAnchor="middle">Intent</text>
        </svg>
    );
};

export const NeuralSurrogatePanel = () => {
    const { neuralSurrogateState } = useCoreState();
    const { t } = useLocalization();
    const { status, accuracy, lastPrediction, lossHistory, trainingExamplesCount, lastCircuit } = neuralSurrogateState;

    return (
        <div className="side-panel neural-surrogate-panel">
            <p className="reason-text">
                The Neural Surrogate now uses <strong>Fisher-Weighted EWC</strong>. It distinguishes between robust logic (High Curvature) and flexible memory (Low Curvature), allowing it to learn your habits without forgetting core principles.
            </p>

            <div className="synaptic-metrics" style={{ marginBottom: '1rem', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                <div className="metric-item">
                    <span className="metric-label">Status</span>
                    <span className={`metric-value ${status === 'training' ? 'status-processing' : ''}`} style={{textTransform: 'capitalize'}}>
                        {status}
                    </span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Accuracy</span>
                    <span className="metric-value" style={{color: 'var(--success-color)'}}>
                        {(accuracy * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Samples</span>
                    <span className="metric-value">{trainingExamplesCount}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">Robustness</span>
                    <span className="metric-value" style={{color: (lastPrediction?.robustness || 0) > 0.4 ? 'var(--success-color)' : 'var(--warning-color)'}}>
                        {((lastPrediction?.robustness || 0) * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
            
            {lastPrediction && (
                <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)', marginBottom: '1rem' }}>
                    <div className="mod-log-header">
                        <span className="mod-log-type">Predicted Intent</span>
                        <span className="mod-log-status">{(lastPrediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <p className="mod-log-description" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                         {lastPrediction.predictedIntent}
                    </p>
                    <p className="reason-text" style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>
                        Cognitive Robustness: <strong>{((lastPrediction.robustness || 0) * 100).toFixed(0)}%</strong>
                    </p>
                </div>
            )}

            <div className="panel-subsection-title">VWN Circuit (Fisher-Weighted)</div>
            {lastCircuit ? (
                <>
                    <CircuitVisualizer circuit={lastCircuit} />
                    <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center'}}>
                        <span style={{color: 'var(--success-color)'}}>● Robust (High Fisher)</span> &nbsp;|&nbsp; 
                        <span style={{color: 'var(--failure-color)'}}>● Plastic (Low Fisher)</span>
                    </div>
                </>
            ) : (
                 <div className="kg-placeholder">Type a command to see the active VWN circuit.</div>
            )}

            <div className="panel-subsection-title" style={{marginTop: '1rem'}}>Training Loss (Learning Curve)</div>
            <div className="sentiment-sparkline-container">
                <Sparkline data={lossHistory.length > 0 ? lossHistory : [0,0]} strokeColor="var(--failure-color)" height={40} />
            </div>
        </div>
    );
};
