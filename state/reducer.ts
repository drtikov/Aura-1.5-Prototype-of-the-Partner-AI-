
// state/reducer.ts
// This file is now the home for all reducer logic, split into functions by state slice.
// This allows a single `useReducer` to manage the state while keeping the logic separated.

import { 
    AuraState, 
    Action
} from '../types';
import { getInitialState } from './initialState';

// Import all individual reducer logic files.
// In this new architecture, we'll combine their logic here.
import { architectureReducer } from './reducers/architecture';
import { coreReducer } from './reducers/core';
import { documentForgeReducer } from './reducers/documentForge';
import { enginesReducer } from './reducers/engines';
import { granularCortexReducer } from './reducers/granularCortex';
import { hovaReducer } from './reducers/hova';
import { internalScientistReducer } from './reducers/internalScientist';
import { introspectionReducer } from './reducers/introspection';
import { ipcReducer } from './reducers/ipc';
import { kernelReducer } from './reducers/kernel';
import { liveSessionReducer } from './reducers/liveSession';
import { logsReducer } from './reducers/logs';
import { memoryReducer } from './reducers/memory';
import { metaphorReducer } from './reducers/metaphor';
import { metisSandboxReducer } from './reducers/metisSandbox';
import { motorCortexReducer } from './reducers/motorCortex';
import { mycelialReducer } from './reducers/mycelial';
import { neuroCortexReducer } from './reducers/neuroCortex';
import { personaReducer } from './reducers/persona';
import { planningReducer } from './reducers/planning';
import { pluginReducer } from './reducers/pluginReducer';
import { praxisCoreReducer } from './reducers/praxisCore';
import { praxisResonatorReducer } from './reducers/praxisResonator';
import { premotorPlannerReducer } from './reducers/premotor';
import { psycheReducer } from './reducers/psyche';
import { resonanceReducer } from './reducers/resonanceReducer';
import { ricciFlowReducer } from './reducers/ricciFlow';
import { sandboxReducer } from './reducers/sandbox';
import { semanticWeaverReducer } from './reducers/semanticWeaver';
import { socialCognitionReducer } from './reducers/socialCognition';
import { somaticCrucibleReducer } from './reducers/somaticCrucible';
import { spandaReducer } from './reducers/spanda';
import { strategicCoreReducer } from './reducers/strategicCore';
import { subsumptionLogReducer } from './reducers/subsumptionLog';
import { synthesisReducer } from './reducers/synthesisReducer';
import { systemReducer } from './reducers/system';
import { temporalEngineReducer } from './reducers/temporalEngine';
import { toolReducer } from './reducers/toolReducer';
import { wisdomIngestionReducer } from './reducers/wisdomIngestion';
import { autoCodeForgeReducer } from './reducers/autoCodeForge';
import { axiomaticCrucibleReducer } from './reducers/axiomaticCrucible';
import { axiomaticGenesisForgeReducer } from './reducers/axiomaticGenesisForge';
import { basalGangliaReducer } from './reducers/basalGanglia';
import { bennettEngineReducer } from './reducers/bennettEngine';
import { brainstormReducer } from './reducers/brainstorm';
import { canvasReducer } from './reducers/canvas';
import { cerebellumReducer } from './reducers/cerebellum';
import { cognitiveForgeReducer } from './reducers/cognitiveForge';
import { cognitiveTriageReducer } from './reducers/cognitiveTriage';
import { doxasticReducer } from './reducers/doxastic';
import { erisReducer } from './reducers/eris';
import { harmonicEngineReducer } from './reducers/harmonicEngine';
import { heuristicCoprocessorReducer } from './reducers/heuristicCoprocessor';
import { koniocortexReducer } from './reducers/koniocortex';
import { ockhamEngineReducer } from './reducers/ockhamEngine';
import { socraticAssessorReducer } from './reducers/socraticAssessor';
import { artificialScientistReducer } from './reducers/artificialScientist';
import { symbioticCoderReducer } from './reducers/symbioticCoder';
import { synapticMatrixReducer } from './reducers/synapticMatrix';
import { daedalusReducer } from './reducers/daedalus';
import { collaborativeSessionReducer } from './reducers/collaborativeSession';

// A list of all reducer functions
const reducers = [
    architectureReducer,
    coreReducer,
    documentForgeReducer,
    enginesReducer,
    granularCortexReducer,
    hovaReducer,
    internalScientistReducer,
    introspectionReducer,
    ipcReducer,
    kernelReducer,
    liveSessionReducer,
    logsReducer,
    memoryReducer,
    metaphorReducer,
    metisSandboxReducer,
    motorCortexReducer,
    mycelialReducer,
    neuroCortexReducer,
    personaReducer,
    planningReducer,
    pluginReducer,
    praxisCoreReducer,
    praxisResonatorReducer,
    premotorPlannerReducer,
    psycheReducer,
    resonanceReducer,
    ricciFlowReducer,
    sandboxReducer,
    semanticWeaverReducer,
    socialCognitionReducer,
    somaticCrucibleReducer,
    spandaReducer,
    strategicCoreReducer,
    subsumptionLogReducer,
    synthesisReducer,
    systemReducer,
    temporalEngineReducer,
    toolReducer,
    wisdomIngestionReducer,
    autoCodeForgeReducer,
    axiomaticCrucibleReducer,
    axiomaticGenesisForgeReducer,
    basalGangliaReducer,
    bennettEngineReducer,
    brainstormReducer,
    canvasReducer,
    cerebellumReducer,
    cognitiveForgeReducer,
    cognitiveTriageReducer,
    doxasticReducer,
    erisReducer,
    harmonicEngineReducer,
    heuristicCoprocessorReducer,
    koniocortexReducer,
    ockhamEngineReducer,
    socraticAssessorReducer,
    artificialScientistReducer,
    symbioticCoderReducer,
    synapticMatrixReducer,
    daedalusReducer,
    collaborativeSessionReducer,
];

/**
 * The root reducer for the entire Aura application.
 * It handles top-level actions like importing or resetting state,
 * and delegates all SYSCALL actions to the combined reducer.
 */
export const auraReducer = (state: AuraState, action: Action): AuraState => {
    switch (action.type) {
        case 'IMPORT_STATE':
            return action.payload;
        case 'RESET_STATE':
            return getInitialState();
        case 'SYSCALL':
            // Each reducer takes the full state and returns a PARTIAL state of changes.
            // We merge all these partial changes together.
            const changes = reducers.reduce((acc, reducer) => {
                const partialUpdate = reducer(state, action);
                return { ...acc, ...partialUpdate };
            }, {});

            // If any reducer returned changes, create a new state object.
            if (Object.keys(changes).length > 0) {
                return { ...state, ...changes };
            }
            // Otherwise, return the original state to prevent re-renders.
            return state;
        default:
            return state;
    }
};
