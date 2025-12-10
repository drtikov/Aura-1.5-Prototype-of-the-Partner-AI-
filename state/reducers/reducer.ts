
// state/reducer.ts

import { 
    AuraState, 
    Action
} from '../types';
import { getInitialState } from '../initialState';

// Import all individual reducer logic files.
import { architectureReducer } from './architecture';
import { coreReducer } from './core';
import { documentForgeReducer } from './documentForge';
import { enginesReducer } from './engines';
import { granularCortexReducer } from './granularCortex';
import { hovaReducer } from './hova';
import { internalScientistReducer } from './internalScientist';
import { introspectionReducer } from './introspection';
import { ipcReducer } from './ipc';
import { kernelReducer } from './kernel';
import { liveSessionReducer } from './liveSession';
import { logsReducer } from './logs';
import { memoryReducer } from './memory';
import { metaphorReducer } from './metaphor';
import { metisSandboxReducer } from './metisSandbox';
import { motorCortexReducer } from './motorCortex';
import { mycelialReducer } from './mycelial';
import { neuroCortexReducer } from './neuroCortex';
import { personaReducer } from './persona';
import { planningReducer } from './planning';
import { pluginReducer } from './pluginReducer';
import { praxisCoreReducer } from './praxisCore';
import { praxisResonatorReducer } from './praxisResonator';
import { premotorPlannerReducer } from './premotor';
import { psycheReducer } from './psyche';
import { resonanceReducer } from './resonanceReducer';
import { ricciFlowReducer } from './ricciFlow';
import { sandboxReducer } from './sandbox';
import { semanticWeaverReducer } from './semanticWeaver';
import { socialCognitionReducer } from './socialCognition';
import { somaticCrucibleReducer } from './somaticCrucible';
import { spandaReducer } from './spanda';
import { strategicCoreReducer } from './strategicCore';
import { subsumptionLogReducer } from './subsumptionLog';
import { synthesisReducer } from './synthesisReducer';
import { systemReducer } from './system';
import { temporalEngineReducer } from './temporalEngine';
import { toolReducer } from './toolReducer';
import { wisdomIngestionReducer } from './wisdomIngestion';
import { autoCodeForgeReducer } from './autoCodeForge';
import { axiomaticCrucibleReducer } from './axiomaticCrucible';
import { axiomaticGenesisForgeReducer } from './axiomaticGenesisForge';
import { basalGangliaReducer } from './basalGanglia';
import { bennettEngineReducer } from './bennettEngine';
import { brainstormReducer } from './brainstorm';
import { canvasReducer } from './canvas';
import { cerebellumReducer } from './cerebellum';
import { cognitiveForgeReducer } from './cognitiveForge';
import { cognitiveTriageReducer } from './cognitiveTriage';
import { doxasticReducer } from './doxastic';
import { erisReducer } from './eris';
import { harmonicEngineReducer } from './harmonicEngine';
import { heuristicCoprocessorReducer } from './heuristicCoprocessor';
import { koniocortexReducer } from './koniocortex';
import { ockhamEngineReducer } from './ockhamEngine';
import { socraticAssessorReducer } from './socraticAssessor';
import { artificialScientistReducer } from './artificialScientist';
import { symbioticCoderReducer } from './symbioticCoder';
import { synapticMatrixReducer } from './synapticMatrix';
import { daedalusReducer } from './daedalus';
import { collaborativeSessionReducer } from './collaborativeSession';
import { prometheusReducer } from './prometheus';
import { monteCarloReducer } from './monteCarlo';
import { neuroSymbolicReducer } from './neuroSymbolic';
import { neuralSurrogateReducer } from './neuralSurrogate'; 
import { recursiveConsensusReducer } from './recursiveConsensus';

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
    prometheusReducer,
    monteCarloReducer,
    neuroSymbolicReducer,
    neuralSurrogateReducer,
    recursiveConsensusReducer,
];

export const auraReducer = (state: AuraState, action: Action): AuraState => {
    switch (action.type) {
        case 'IMPORT_STATE':
            return action.payload;
        case 'RESET_STATE':
            return getInitialState();
        case 'SYSCALL':
            const changes = reducers.reduce((acc, reducer) => {
                const partialUpdate = reducer(state, action);
                return { ...acc, ...partialUpdate };
            }, {});

            if (Object.keys(changes).length > 0) {
                return { ...state, ...changes };
            }
            return state;
        default:
            return state;
    }
};
