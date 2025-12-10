// components/AuraMonitorPanel.tsx
import React from 'react';
import { Accordion } from './Accordion';
import { CoreMonitor } from './CoreMonitor';
import { SelfAwarenessPanel } from './SelfAwarenessPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { OtherAwarenessPanel } from './OtherAwarenessPanel';
import { CuriosityPanel } from './CuriosityPanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { DevelopmentalHistoryPanel } from './DevelopmentalHistoryPanel';
import { HomeostaticPanel } from './HomeostaticPanel';
import { CoreIdentityPanel } from './CoreIdentityPanel';

export const AuraMonitorPanel = () => {
    return (
        <div className="side-panel">
            <Accordion title="Core Monitor (Rigpa)" defaultOpen>
                <CoreMonitor />
            </Accordion>
            <Accordion title="Core Identity">
                <CoreIdentityPanel />
            </Accordion>
            <Accordion title="Self-Awareness & Reflection">
                <SelfAwarenessPanel />
                <ReflectiveInsightEnginePanel />
            </Accordion>
             <Accordion title="World Model & Prediction">
                <WorldModelPanel />
            </Accordion>
            <Accordion title="User Awareness & Model">
                <OtherAwarenessPanel />
                <CuriosityPanel />
            </Accordion>
            <Accordion title="Causal & Developmental Models">
                 <CausalSelfModelPanel />
                 <DevelopmentalHistoryPanel />
            </Accordion>
            <Accordion title="Homeostasis & Resources">
                <HomeostaticPanel />
            </Accordion>
        </div>
    );
};