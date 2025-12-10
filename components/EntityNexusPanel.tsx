
// components/EntityNexusPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { SocialGraphNode } from '../types';

export const EntityNexusPanel = React.memo(() => {
    const { socialCognitionState } = useCoreState();
    const { t } = useLocalization();

    const entities = Object.values(socialCognitionState.socialGraph) as SocialGraphNode[];

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('entityNexus_desc')}
            </p>
            {entities.length === 0 ? (
                <div className="kg-placeholder">{t('entityNexus_empty')}</div>
            ) : (
                entities.map((node) => (
                    <details key={node.id} className="workflow-details">
                        <summary className="workflow-summary">
                             <div className="mod-log-header" style={{ width: '100%' }}>
                                <span className="mod-log-type">{node.name}</span>
                                <span className="mod-log-status" style={{textTransform: 'capitalize'}}>{node.type}</span>
                            </div>
                        </summary>
                        <div className="workflow-content">
                             <p className="workflow-description"><em>"{node.summary}"</em></p>
                             <div className="panel-subsection-title" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Dossier</div>
                             <ul className="workflow-steps-list" style={{fontSize: '0.8rem'}}>
                                {node.dossier.length > 0 ? node.dossier.map((fact, i) => <li key={i}>{fact}</li>) : <li>No facts recorded.</li>}
                            </ul>
                        </div>
                    </details>
                ))
            )}
        </div>
    );
});
