// state/reducers/synapticMatrix.ts
import { AuraState, Action } from '../../types';

export const synapticMatrixReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SYNAPTIC_MATRIX/UPDATE_METRICS': {
            const { conceptConnections } = state;
            const synapseCount = Object.keys(conceptConnections).length;
            const weights = Object.values(conceptConnections).map(c => (c as any).weight);
            const avgWeight = weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : 0;
            
            // Simulate plasticity and efficiency fluctuations for visual feedback
            const plasticity = state.synapticMatrix.plasticity * 0.99 + (Math.random() * 0.01);
            const efficiency = 0.9 + Math.random() * 0.1;
            
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    synapseCount,
                    avgConfidence: avgWeight,
                    plasticity,
                    efficiency,
                }
            };
        }
        case 'SYNAPTIC_MATRIX/SET_ADAPTING':
            return { synapticMatrix: { ...state.synapticMatrix, isAdapting: args.isAdapting } };
        case 'SYNAPTIC_MATRIX/SET_ACTIVE_CONCEPT':
            return { synapticMatrix: { ...state.synapticMatrix, activeConcept: args.concept } };
        case 'SYNAPTIC_MATRIX/ADD_INTUITIVE_ALERT':
            return { synapticMatrix: { ...state.synapticMatrix, intuitiveAlerts: [args, ...state.synapticMatrix.intuitiveAlerts].slice(0, 5) } };
        case 'SYNAPTIC_MATRIX/LOG_PROBE': {
            const newLog = { timestamp: Date.now(), message: args.message };
            return { synapticMatrix: { ...state.synapticMatrix, probeLog: [newLog, ...state.synapticMatrix.probeLog].slice(0, 10) } };
        }
        default:
            return {};
    }
};
