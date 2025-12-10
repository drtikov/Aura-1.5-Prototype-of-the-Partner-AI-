
// components/AuraOSModal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useCoreState, useMemoryState, useSystemState, useLogsState, useArchitectureState } from '../context/AuraContext.tsx';
import { mainControlDeckLayout, advancedControlsLayout } from './controlDeckConfig.tsx';
import { NarrativeSummaryPanel } from './NarrativeSummaryPanel.tsx';
import { PanelConfig } from '../types.ts';
import { Gauge } from './Gauge.tsx';
import { useModal } from '../context/ModalContext.tsx';
import { personas } from '../state/personas.ts';

interface AuraOSModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialPanel?: string;
}

const getAllPanels = (layout: PanelConfig[]): PanelConfig[] => {
    const all: PanelConfig[] = [];
    const recurse = (panels: PanelConfig[]) => {
        for (const panel of panels) {
            if (panel.component) {
                all.push(panel);
            }
            if (panel.children) {
                recurse(panel.children);
            }
        }
    };
    recurse(layout);
    return all;
};

interface DashboardProps {
    onNavigate: (panelId: string) => void;
}

const MissionControlDashboard = ({ onNavigate }: DashboardProps) => {
    const { internalState, telosEngine, personalityState, activeCognitiveMode } = useCoreState();
    const { knowledgeGraph } = useMemoryState();
    const { resourceMonitor, kernelState, pluginState } = useSystemState();
    const { commandLog } = useLogsState();
    const { selfProgrammingState } = useArchitectureState();
    const { t } = useLocalization();
    const modal = useModal();
    const { memoryStatus } = useAuraDispatch();

    const activeGoal = telosEngine.valueHierarchy.telos || t('dashboard_activeTelos_none');
    
    // Lookup the proper name for the dominant persona
    const activePersonaId = personalityState.dominantPersona;
    const activePersonaObj = personas.find(p => p.id === activePersonaId);
    // If it's a translation key (starts with plugin_), translate it. Otherwise use name or ID.
    const activePersonaName = activePersonaObj 
        ? (activePersonaObj.name.startsWith('plugin_') ? t(activePersonaObj.name) : activePersonaObj.name)
        : activePersonaId;
    
    // Determine the display text for the current cognitive state
    const modeDisplay = useMemo(() => {
        if (activeCognitiveMode) {
            return activeCognitiveMode.charAt(0).toUpperCase() + activeCognitiveMode.slice(1);
        }
        if (internalState.activeCognitiveStrategyId) {
             // Clean up strategy name for display
             const strategy = pluginState.registry.find(p => p.id === internalState.activeCognitiveStrategyId);
             if (strategy) {
                 // e.g. plugin_strategy_first_principles_name -> First Principles
                 let name = strategy.name;
                 const translated = t(name);
                 if (translated !== name) return translated;
                 
                 // Fallback cleanup if translation missing
                 return name.replace('plugin_strategy_', '').replace('_name', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
             }
             return 'Guided';
        }
        return 'Standard';
    }, [activeCognitiveMode, internalState.activeCognitiveStrategyId, pluginState.registry, t]);
    
    const handleQuickLaunch = (action: string) => {
        switch(action) {
            case 'workflow':
                modal.open('coCreatedWorkflow', {});
                break;
            case 'diagnostics':
                onNavigate('systemInfo');
                break;
            case 'review':
                onNavigate('selfEngineering');
                break;
            case 'document':
                modal.open('documentForge', {});
                break;
        }
    };

    return (
        <div className="mission-control-dashboard dashboard-interactive">
            <div className="dashboard-header-section">
                <div className="dashboard-kpi" onClick={() => onNavigate('strategicPlanner')}>
                    <label>{t('dashboard_activeTelos')}</label>
                    <div className="kpi-value-text" title={activeGoal}>"{activeGoal.substring(0, 60)}{activeGoal.length > 60 ? '...' : ''}"</div>
                </div>
                <div className="dashboard-kpi" onClick={() => onNavigate('personaManual')}>
                    <label>{t('dashboard_dominantPersona')}</label>
                    <div className="kpi-value-text accent">{activePersonaName}</div>
                </div>
            </div>

            <div className="dashboard-gauges-section">
                <div className="gauge-wrapper" onClick={() => onNavigate('auraMonitor')}>
                    <Gauge label={t('dashboard_gauge_entropy')} value={internalState.uncertaintySignal} colorClass="uncertainty-bar" />
                </div>
                <div className="gauge-wrapper" onClick={() => onNavigate('auraMonitor')}>
                    <Gauge label={t('dashboard_gauge_coherence')} value={internalState.harmonyScore} colorClass="coherence-bar" />
                </div>
                 <div className="gauge-wrapper" onClick={() => onNavigate('auraMonitor')}>
                    <Gauge label={t('dashboard_gauge_load')} value={resourceMonitor.cpu_usage} colorClass="cpu-bar" />
                </div>
                 <div className="gauge-wrapper" onClick={() => onNavigate('unifiedMemory')}>
                    <Gauge label={t('dashboard_gauge_memory')} value={Math.min(1, knowledgeGraph.length / 1000)} colorClass="knowledge-bar" />
                </div>
            </div>

            <div className="panel-group-title" style={{ marginTop: '1rem' }}>{t('dashboard_quickLaunch')}</div>
            <div className="button-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1rem' }}>
                <button className="control-button" onClick={() => handleQuickLaunch('workflow')}>{t('dashboard_newWorkflow')}</button>
                <button className="control-button" onClick={() => handleQuickLaunch('diagnostics')}>{t('dashboard_diagnostics')}</button>
                <button className="control-button" onClick={() => handleQuickLaunch('review')}>{t('dashboard_reviewProposals')}</button>
                <button className="control-button" onClick={() => handleQuickLaunch('document')}>{t('dashboard_documentForge')}</button>
            </div>

            <div className="dashboard-stats-grid">
                <div className="stat-card" onClick={() => onNavigate('systemLogs')}>
                    <span className="stat-label">{t('dashboard_kernelTick')}</span>
                    <span className="stat-value">{kernelState.tick}</span>
                </div>
                <div className="stat-card" onClick={() => onNavigate('systemLogs')}>
                    <span className="stat-label">{t('dashboard_taskQueue')}</span>
                    <span className="stat-value">{kernelState.taskQueue.length}</span>
                </div>
                <div className="stat-card" onClick={() => onNavigate('vfsExplorer')}>
                    <span className="stat-label">{t('dashboard_vfsFiles')}</span>
                    <span className="stat-value">
                        {memoryStatus === 'initializing' ? <div className="spinner-small" style={{display: 'inline-block'}}/> : (selfProgrammingState?.vfsPaths?.length || 0)}
                    </span>
                </div>
                 <div className="stat-card" onClick={() => onNavigate('coreControls')}>
                    <span className="stat-label">{t('dashboard_activeMode')}</span>
                    <span className="stat-value" style={{fontSize: modeDisplay.length > 12 ? '1.2rem' : '1.5rem'}}>{modeDisplay}</span>
                </div>
            </div>
            
            <div className="dashboard-activity-log">
                <h3 onClick={() => onNavigate('systemLogs')}>{t('dashboard_recentActivity')} ({t('dashboard_viewFullLogs')})</h3>
                {commandLog.length === 0 ? (
                     <p className="reason-text" style={{fontSize: '0.8rem'}}>{t('dashboard_noActivity')}</p>
                ) : (
                    <ul>
                        {commandLog.slice(0, 8).map(log => (
                            <li key={log.id} className={`log-type-${log.type}`}>
                                <span className="log-time">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                <span className="log-text" title={log.text}>{log.text}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};


export const AuraOSModal = ({ isOpen, onClose, initialPanel }: AuraOSModalProps) => {
    const { t } = useLocalization();
    const handlers = useAuraDispatch();

    const [searchQuery, setSearchQuery] = useState('');
    const [activePanel, setActivePanel] = useState<PanelConfig | null>(null);

    const allPanelConfigs = useMemo(() => [
        ...getAllPanels(mainControlDeckLayout),
        ...getAllPanels(advancedControlsLayout)
    ], []);

    // Create a comprehensive map from panel ID to component
    const allPanels = useMemo(() => {
        const panelMap: { [key: string]: React.ComponentType<any> } = {};
        allPanelConfigs.forEach(p => {
            if(p.component) {
                panelMap[p.id] = p.component;
            }
        });
        return panelMap;
    }, [allPanelConfigs]);

    useEffect(() => {
        if (isOpen) {
            if (initialPanel) {
                const panelToOpen = allPanelConfigs.find(p => p.id === initialPanel);
                setActivePanel(panelToOpen || null);
            } else {
                setActivePanel(null);
            }
            setSearchQuery('');
        }
    }, [isOpen, initialPanel, allPanelConfigs]);

    const handleNavigate = (panelId: string) => {
        const panel = allPanelConfigs.find(p => p.id === panelId);
        if (panel) {
            setActivePanel(panel);
        }
    };

    const panelGroups = useMemo(() => {
        const mainGroups = mainControlDeckLayout.map(group => ({
            titleKey: group.titleKey,
            panels: group.children ? group.children.sort((a,b) => t(a.titleKey).localeCompare(t(b.titleKey))) : [group]
        }));
        
        const advancedGroups = advancedControlsLayout.map(group => ({
            titleKey: group.titleKey,
            panels: (group.children || []).sort((a,b) => t(a.titleKey).localeCompare(t(b.titleKey)))
        }));

        return [...mainGroups, ...advancedGroups];
    }, [t]);


    const filteredPanelGroups = useMemo(() => {
        if (!searchQuery.trim()) {
            return panelGroups;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        
        return panelGroups
            .map(group => ({
                ...group,
                panels: group.panels.filter(panel =>
                    t(panel.titleKey).toLowerCase().includes(lowercasedQuery)
                ),
            }))
            .filter(group => group.panels.length > 0);
    }, [searchQuery, panelGroups, t]);
    
    const PanelComponent = activePanel ? allPanels[activePanel.id] : null;
    const componentProps = activePanel && activePanel.props ? activePanel.props(handlers) : {};
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('auraOS_title')} className="aura-os-modal">
            <div className="aura-os-layout">
                <nav className="aura-os-nav">
                    <input
                        type="text"
                        className="aura-os-search"
                        placeholder={t('auraOS_search_placeholder')}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        aria-label={t('auraOS_search_placeholder')}
                    />
                    <NarrativeSummaryPanel />
                    <div className="aura-os-nav-list">
                        <div key="dashboard">
                            <button 
                                className={`aura-os-nav-item ${!activePanel ? 'active' : ''}`}
                                onClick={() => setActivePanel(null)}
                                style={{fontWeight: 'bold', borderLeftColor: 'var(--accent-color)'}}
                            >
                                Mission Control
                            </button>
                        </div>
                        {filteredPanelGroups.map(group => (
                            <div key={group.titleKey}>
                                <h3 className="aura-os-nav-group">{t(group.titleKey)}</h3>
                                {group.panels.map(panel => (
                                    <button
                                        key={panel.id}
                                        className={`aura-os-nav-item ${activePanel?.id === panel.id ? 'active' : ''}`}
                                        onClick={() => setActivePanel(panel)}
                                    >
                                        {t(panel.titleKey)}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </nav>
                <main className="aura-os-content" role="tabpanel">
                    {activePanel && PanelComponent ? (
                        <>
                            <h2 className="aura-os-content-header">{t(activePanel.titleKey)}</h2>
                            <PanelComponent {...componentProps} />
                        </>
                    ) : (
                         <MissionControlDashboard onNavigate={handleNavigate} />
                    )}
                </main>
            </div>
        </Modal>
    );
};
