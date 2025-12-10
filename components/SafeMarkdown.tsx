
import React, { useMemo, useEffect, useState } from 'react';
import { loadSdk } from '../core/sdkLoader';

declare const katex: any;
declare const marked: any;

export const SafeMarkdown = React.memo(({ text }: { text: string }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadDependencies = async () => {
            try {
                await Promise.all([
                    loadSdk('marked'),
                    loadSdk('katex_css'),
                    loadSdk('katex')
                ]);
                if (isMounted) {
                    const renderer = {
                        blockquote(quote: string) {
                            return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
                        },
                        code(code: string, language: string) {
                            const validLanguage = language && /^[a-zA-Z0-9]+$/.test(language) ? language : 'plaintext';
                            return `<pre><code class="language-${validLanguage}">${code}</code></pre>`;
                        }
                    };
                    if (typeof marked !== 'undefined') {
                        marked.use({ renderer });
                    }
                    setIsReady(true);
                }
            } catch (error) {
                console.error("Failed to load markdown/katex libraries", error);
            }
        };
        loadDependencies();
        return () => { isMounted = false; };
    }, []);

    const elements = useMemo(() => {
        if (!isReady || typeof marked === 'undefined' || typeof katex === 'undefined') {
            return <pre><code>{text}</code></pre>;
        }
        
        // Pre-process text to handle <thinking> tags before math splitting
        // We replace the thinking block with a custom markdown marker or handle it directly.
        // Here, we'll replace it with a unique string placeholder to avoid math parsing interference, then re-inject as HTML.
        
        let processedText = text;
        const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/);
        let thinkingContent = '';
        
        if (thinkingMatch) {
            thinkingContent = thinkingMatch[1].trim();
            // Replace the tag with a placeholder
            processedText = text.replace(thinkingMatch[0], '%%THINKING_BLOCK%%');
        }
        
        const mathRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
        const parts = processedText.split(mathRegex);

        const renderedParts = parts.map((part, index) => {
            if (part === '%%THINKING_BLOCK%%') {
                // Render the thinking content safely
                const renderedThinking = marked.parse(thinkingContent, { gfm: true, breaks: true });
                return (
                    <details key={`thinking-${index}`} className="workflow-details" style={{ marginBottom: '1rem', borderColor: 'var(--accent-color)' }}>
                        <summary className="workflow-summary" style={{ color: 'var(--accent-color)' }}>
                            Cognitive Trace (Reasoning)
                        </summary>
                        <div className="workflow-content" style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                            <div dangerouslySetInnerHTML={{ __html: renderedThinking }} />
                        </div>
                    </details>
                );
            }

            if (part.startsWith('$$') && part.endsWith('$$')) {
                const math = part.slice(2, -2);
                try {
                    const html = katex.renderToString(math, { 
                        displayMode: true, 
                        throwOnError: false,
                        strict: false, // Disable strict mode warnings
                        trust: true 
                    });
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                } catch (e) {
                    return <code key={index}>{part}</code>;
                }
            }
            if (part.startsWith('$') && part.endsWith('$')) {
                const math = part.slice(1, -1);
                 try {
                    const html = katex.renderToString(math, { 
                        displayMode: false, 
                        throwOnError: false,
                        strict: false, // Disable strict mode warnings
                        trust: true
                    });
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                 } catch (e) {
                     return <code key={index}>{part}</code>;
                 }
            }
            try {
                const html = marked.parse(part, { gfm: true, breaks: true });
                return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch(e) {
                return <span key={index}>{part}</span>;
            }
        });
        
        return renderedParts;
    }, [text, isReady]);

    if (!isReady) {
        return <span></span>; // Render nothing while loading to avoid layout shifts
    }

    return <div className="content-renderer">{elements}</div>;
});
