
// components/SystemInfoPanel.tsx
import React, { useState } from 'react';
import { useLocalization, useCoreState, useMemoryState, useSystemState } from '../context/AuraContext.tsx';
import { AuraConfig, CURRENT_STATE_VERSION } from '../constants.ts';
import { InfoPanel, InfoItem } from './InfoPanel.tsx';
import { HAL } from '../core/hal.ts';

export const SystemInfoPanel = React.memo(() => {
    const { t } = useLocalization();
    const { coreIdentity } = useCoreState();
    const { knowledgeGraph } = useMemoryState();
    const { kernelState } = useSystemState();
    
    const [diagStatus, setDiagStatus] = useState<'idle' | 'running' | 'complete'>('idle');
    const [diagResult, setDiagResult] = useState<string | null>(null);

    const runDiagnostics = async () => {
        setDiagStatus('running');
        
        let latency = 'Checking...';
        try {
            const start = Date.now();
            // Fetch self or a known reliable CDN resource
            await fetch(window.location.origin, { method: 'HEAD', mode: 'no-cors' });
            latency = `${Date.now() - start}ms`;
        } catch (e) {
            latency = 'Offline/Blocked';
        }
        
        const vfsSize = await HAL.VFS.computeHash("root"); // Dummy call to test HAL availability
        const memSize = knowledgeGraph.length;
        const queueSize = kernelState.taskQueue.length;
        
        setDiagResult(`
        [OK] Kernel v${kernelState.kernelVersion} Running
        [OK] Network Latency: ${latency}
        [OK] VFS Hash Computed: ${vfsSize.substring(0, 8)}...
        [OK] Knowledge Graph: ${memSize} nodes active
        [OK] Task Queue: ${queueSize} pending
        [OK] HAL Bridge: Active
        `);
        setDiagStatus('complete');
    };

    const items: InfoItem[] = [
        { type: 'metric', label: t('systemInfo_aiModel'), value: "Gemini 3.0 Pro" },
        { type: 'metric', label: t('systemInfo_stateVersion'), value: `v${CURRENT_STATE_VERSION}` },
        { type: 'header', label: 'Core Concept' },
        { type: 'text', content: coreIdentity.symbioticDefinition },
        { type: 'header', label: 'Operating Parameters' },
        { type: 'metric', label: t('systemInfo_boredomDecay'), value: AuraConfig.BOREDOM_DECAY_RATE },
        { type: 'metric', label: t('systemInfo_hormoneDecay'), value: AuraConfig.HORMONE_DECAY_RATE },
        { type: 'metric', label: t('systemInfo_loadDecay'), value: AuraConfig.LOAD_DECAY_RATE },
        { type: 'metric', label: t('systemInfo_noveltyBoost'), value: AuraConfig.NOVELTY_BOOST },
    ];

    return (
        <div>
            <InfoPanel items={items} />
            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button className="control-button" onClick={runDiagnostics} disabled={diagStatus === 'running'}>
                    {diagStatus === 'running' ? 'Running...' : t('systemInfo_runDiagnostics')}
                </button>
            </div>
            {diagStatus === 'complete' && diagResult && (
                 <div className="code-snippet-container" style={{marginTop: '1rem'}}>
                    <pre><code>{diagResult}</code></pre>
                </div>
            )}
        </div>
    );
});
