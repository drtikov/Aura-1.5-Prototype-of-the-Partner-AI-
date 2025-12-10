
// components/ThemeSwitcher.tsx
import React from 'react';
import { useAuraDispatch, useCoreState, useLocalization } from '../context/AuraContext.tsx';

const themes = [
    { id: 'ui-15', nameKey: 'blueprint', label: 'Blueprint' },
    { id: 'ui-1', nameKey: 'cyberpunk' },
    { id: 'ui-2', nameKey: 'solarizedLight' },
    { id: 'ui-3', nameKey: 'business' },
    { id: 'ui-4', nameKey: 'vaporwave' },
    { id: 'ui-5', nameKey: '8bit' },
    { id: 'ui-6', nameKey: 'steampunk' },
    { id: 'ui-7', nameKey: 'organic' },
    { id: 'ui-8', nameKey: 'blackAndWhite' },
    { id: 'ui-9', nameKey: 'psychedelic' },
    { id: 'ui-10', nameKey: 'raver' },
    { id: 'ui-11', nameKey: 'tokyo' },
    { id: 'ui-12', nameKey: 'gravitational' },
    { id: 'ui-13', nameKey: 'swissEngineering', label: 'Swiss Engineering (Robust)' },
    { id: 'ui-14', nameKey: 'obsidian', label: 'Obsidian (High Contrast)' },
];

export const ThemeSwitcher = () => {
    const { theme } = useCoreState();
    const { dispatch } = useAuraDispatch();
    const { t } = useLocalization();

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'SYSCALL', payload: { call: 'SET_THEME', args: e.target.value } });
    };

    return (
        <div className="localization-panel-inline">
            <label htmlFor="theme-switcher">{t('themeSwitcher')}</label>
            <div className="theme-switcher-container">
                <select id="theme-switcher" value={theme} onChange={handleThemeChange}>
                    {themes.map(themeOption => (
                        <option key={themeOption.id} value={themeOption.id}>
                            {themeOption.label || t(themeOption.nameKey)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
