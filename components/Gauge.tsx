
import React, { useEffect, useRef } from 'react';
import { loadSdk } from '../core/sdkLoader';

declare const anime: any;

export const Gauge = React.memo(({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        
        loadSdk('anime').then(() => {
            if (!isMounted) return;
            
            // Check if anime is available on window or via module
            const animeLib = typeof anime !== 'undefined' ? anime : (window as any).anime;
            
            if (!animeLib) {
                console.warn("Anime.js not loaded for Gauge");
                return;
            }

            const circumference = 157;
            const offset = circumference - (value * circumference);

            animeLib({
                targets: pathRef.current,
                strokeDashoffset: offset,
                duration: 750,
                easing: 'easeOutQuad'
            });

            const textValue = { val: parseFloat(textRef.current?.textContent || '0') };
            animeLib({
                targets: textValue,
                val: value * 100,
                round: 1,
                duration: 750,
                easing: 'easeOutQuad',
                update: () => {
                    if (textRef.current) {
                        textRef.current.textContent = String(Math.round(textValue.val));
                    }
                }
            });
        }).catch(err => console.error("Failed to load anime.js for Gauge", err));

        return () => { isMounted = false; };
    }, [value]);
    
    return (
        <div className="gauge-container">
            <svg viewBox="0 0 120 70" className="gauge-svg">
                <path d="M10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--border-color)" strokeWidth="6" strokeLinecap="round" />
                <path
                    ref={pathRef}
                    d="M10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    className={`gauge-value ${colorClass}`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="157"
                    strokeDashoffset={157} // Initial offset (empty)
                />
            </svg>
            <div className="gauge-label">{label}</div>
            <div className="gauge-text">
                <span ref={textRef}>{(value * 100).toFixed(0)}</span>%
            </div>
        </div>
    );
});
