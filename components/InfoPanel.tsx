// components/InfoPanel.tsx
import React from 'react';

export type InfoItem = 
    | { type: 'metric'; label: string; value: string | number; }
    | { type: 'bar'; label: string; value: number; colorClass?: string; }
    | { type: 'header'; label: string; }
    | { type: 'text'; content: string; };

interface InfoPanelProps {
    items: InfoItem[];
    className?: string;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ items, className }) => {
    return (
        <div className={`side-panel info-panel ${className || ''}`} style={{gap: '0.75rem', display: 'flex', flexDirection: 'column'}}>
            {items.map((item, index) => {
                switch (item.type) {
                    case 'header':
                        return <div key={index} className="panel-subsection-title" style={{marginTop: 0}}>{item.label}</div>;
                    case 'text':
                        return <p key={index} className="reason-text" style={{fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)'}}>{item.content}</p>;
                    case 'metric':
                        return (
                            <div key={index} className="awareness-item">
                                <label>{item.label}</label>
                                <strong>{item.value}</strong>
                            </div>
                        );
                    case 'bar':
                        return (
                             <div key={index} className="state-item">
                                <label>{item.label}</label>
                                <div className="state-bar-container">
                                    <div className={`state-bar ${item.colorClass || ''}`} style={{ width: `${item.value * 100}%`, backgroundColor: !item.colorClass ? 'var(--primary-color)' : undefined }}></div>
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};
