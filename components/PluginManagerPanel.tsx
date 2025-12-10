
// components/PluginManagerPanel.tsx
import React, { useMemo } from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext.tsx';
import { Plugin } from '../types.ts';

export const PluginManagerPanel = React.memo(() => {
    const { pluginState } = useSystemState();
    const { t } = useLocalization();

    const groupedPlugins = useMemo(() => {
        return pluginState.registry.reduce((acc, plugin) => {
            const type = plugin.type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(plugin);
            return acc;
        }, {} as Record<Plugin['type'], Plugin[]>);
    }, [pluginState.registry]);
    
    const groupOrder: { type: Plugin['type'], className: string }[] = [
        { type: 'TOOL', className: 'tools' },
        { type: 'COPROCESSOR', className: 'coprocessors' },
        { type: 'HEURISTIC_COPROCESSOR', className: 'heuristic' },
        { type: 'KNOWLEDGE', className: 'knowledge' },
        { type: 'HEURISTIC', className: 'heuristic' },
        { type: 'PERSONA', className: 'persona' },
        { type: 'COGNITIVE_STRATEGY', className: 'cognitive-strategy' },
    ];

    const getCardClass = (type: Plugin['type']) => {
        switch (type) {
            case 'TOOL': return 'tool';
            case 'KNOWLEDGE': return 'knowledge';
            case 'COPROCESSOR': return 'coprocessor';
            case 'HEURISTIC': return 'heuristic';
            case 'PERSONA': return 'persona';
            case 'COGNITIVE_STRATEGY': return 'cognitive-strategy';
            case 'HEURISTIC_COPROCESSOR': return 'heuristic';
            default: return '';
        }
    };

    const cleanGroupName = (type: string) => {
        const key = `plugin_group_${type}`;
        // If translation exists, use it. Otherwise format the type string nicely.
        return t(key, { defaultValue: type.replace('_', ' ') });
    };

    return (
        <div className="plugin-manager-content">
            {groupOrder.map(group => {
                const pluginsInGroup = groupedPlugins[group.type];
                if (!pluginsInGroup || pluginsInGroup.length === 0) return null;
                
                return (
                    <div key={group.type} className="plugin-group">
                        <h3 className={`plugin-group-header ${group.className}`} style={{ textTransform: 'capitalize' }}>
                            {cleanGroupName(group.type).toLowerCase()}
                        </h3>
                        <div className="plugin-card-grid">
                             {pluginsInGroup.map((plugin: Plugin) => (
                                <div key={plugin.id} className={`plugin-card ${getCardClass(plugin.type)}`}>
                                    <div className="plugin-card-header">
                                        {/* Now we can trust t() because i18n.ts guarantees a value */}
                                        <div className="plugin-card-name">{t(plugin.name)}</div>
                                        <div className={`plugin-card-status ${plugin.status}`} title={`${plugin.status}`}></div>
                                    </div>
                                    <p className="plugin-card-desc">{t(plugin.description)}</p>
                                    
                                    {/* Display Fact Count if available */}
                                    {(plugin.knowledge?.length || plugin.factCount) ? (
                                        <div className="plugin-fact-count" title={`${plugin.knowledge?.length || plugin.factCount} Facts available`}>
                                            {t('plugin_facts_indicator', { count: plugin.knowledge?.length || plugin.factCount, defaultValue: `${plugin.knowledge?.length || plugin.factCount} Facts` })}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});
