
// i18n.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './localization';
import { plugins } from './state/plugins';

// --- Dynamic Translation Hydration ---
// This ensures that all plugins defined in the system have a valid English fallback
// so the UI never shows raw keys like "plugin_tool_calculator_name" even if 
// they aren't explicitly defined in localization.ts.

const enTranslations = translations.en.translation as Record<string, string>;

// Helper to converting snake_case keys to Title Case
const humanize = (key: string): string => {
    // Remove common prefixes
    let text = key.replace(/^(plugin_knowledge_|plugin_tool_|plugin_coprocessor_|plugin_heuristic_|plugin_persona_|plugin_strategy_|plugin_)/, '');
    
    // Remove common suffixes
    text = text.replace(/(_name|_desc|_title|_panel)$/, '');
    
    // Replace underscores with spaces and Title Case
    return text
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Hydrate the dictionary
plugins.forEach(plugin => {
    // 1. Handle Name
    if (!enTranslations[plugin.name]) {
        enTranslations[plugin.name] = humanize(plugin.name);
    }
    
    // 2. Handle Description
    if (!enTranslations[plugin.description]) {
        // For descriptions, we just clean up underscores, we don't Title Case every word
        let desc = plugin.description.replace(/_/g, ' ');
        // If it looks like a key (starts with plugin_), clean it up harder
        if (plugin.description.startsWith('plugin_')) {
             desc = humanize(plugin.description);
        }
        enTranslations[plugin.description] = desc;
    }
});

/**
 * Initializes and configures the i18next instance for the application.
 */
i18next
    .use(initReactI18next)
    .init({
        resources: translations,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        // React-specific options to reduce flickering
        react: {
            useSuspense: false,
        }
    });

export default i18next;
