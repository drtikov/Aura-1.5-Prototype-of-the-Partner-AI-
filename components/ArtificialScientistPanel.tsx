// components/ArtificialScientistPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
// FIX: Imported missing types
import { DiagnosticFinding, InternalScientistExperiment, InternalScientistHypothesis, SelfProgrammingCandidate, CreateFileCandidate, ModifyFileCandidate } from '../types.ts';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

const FindingCard = ({ finding }: { finding: DiagnosticFinding }) => (
    <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)'}}>
        <p title={finding.finding}>
            <strong>[{finding.severity.toUpperCase()}]</strong> {finding.finding.substring(0, 60)}{finding.finding.length > 60 ? '...' : ''}
        </p>
    </div>
);

const HypothesisCard = ({ hypothesis }: { hypothesis: InternalScientistHypothesis }) => (
    <div className="gde-status" style={{ borderLeftColor: 'var(--primary-color)'}}>
        <p><em>{hypothesis.text}</em></p>
    </div>
);

// FIX: Added a type guard to correctly display code information from the SelfProgrammingCandidate union type.
const ExperimentCard = ({ experiment }: { experiment: InternalScientistExperiment }) => {
    let codeInfo = 'Unknown code change';
    if ('targetFile' in experiment.design) { // ModifyFileCandidate
        const modifyCandidate = experiment.design as ModifyFileCandidate;
        codeInfo = `// Target: ${modifyCandidate.targetFile}\n${modifyCandidate.codeSnippet}`;
    } else if ('newFile' in experiment.design) { // CreateFileCandidate
        const createCandidate = experiment.design as CreateFileCandidate;
        codeInfo = `// New File: ${createCandidate.newFile.path}\n${createCandidate.newFile.content}`;
    }

    return (
        <div className="gde-status" style={{ borderLeftColor: 'var(--secondary-color)'}}>
            <p><strong>Experiment:</strong> {experiment.design.reasoning}</p>
            <div className="code-snippet-container" style={{maxHeight: '100px', marginTop: '0.5rem'}}>
                <pre><code>{codeInfo}</code></pre>
            </div>
        </div>
    );
};

export const ArtificialScientistPanel = () => {
    const { artificialScientistState } = useCoreState();
    const { t } = useLocalization();
    const { status, log, currentGoal, currentHypothesis, currentExperiment } = artificialScientistState;


    return (
        <div className="side-panel">
             <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong style={{ textTransform: 'capitalize' }}>
                    {status}
                    {status !== 'idle' && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                </strong>
            </div>

            {currentGoal && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentGoal')}</div>
                    <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)'}}>
                        <p><em>{currentGoal}</em></p>
                    </div>
                </>
            )}
            {currentHypothesis && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentHypothesis')}</div>
                     <div className="gde-status" style={{ borderLeftColor: 'var(--primary-color)'}}>
                        <p><em>{currentHypothesis}</em></p>
                    </div>
                </>
            )}
            {currentExperiment && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentExperiment')}</div>
                     <div className="gde-status" style={{ borderLeftColor: 'var(--secondary-color)'}}>
                        <p><strong>Experiment:</strong> {(currentExperiment as any).description}</p>
                    </div>
                </>
            )}

            <div className="panel-subsection-title">{t('scientist_log')}</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">{t('scientist_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon" style={{textTransform: 'capitalize'}}>{entry.stage.substring(0,1)}</span>
                            <div className="log-text-group">
                                <span className="log-text">{entry.message}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};