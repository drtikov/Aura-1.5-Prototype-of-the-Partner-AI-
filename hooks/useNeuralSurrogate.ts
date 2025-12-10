
// hooks/useNeuralSurrogate.ts
import { useEffect, useRef, useCallback } from 'react';
import { AuraState, SyscallCall } from '../types.ts';
import { HAL } from '../core/hal.ts';

// Label mapping
const INTENTS = {
    'CHAT': 0,
    'CODE': 1,
    'SEARCH': 2,
    'MEMORY': 3
};

// Simple heuristics to label data for self-supervised learning
const labelInput = (text: string): number => {
    const t = text.toLowerCase();
    if (t.includes('function') || t.includes('const') || t.includes('import ') || t.includes('console.log')) return INTENTS.CODE;
    if (t.includes('search') || t.includes('find') || t.includes('google') || t.includes('lookup')) return INTENTS.SEARCH;
    if (t.includes('remember') || t.includes('save') || t.includes('forget') || t.includes('memory')) return INTENTS.MEMORY;
    return INTENTS.CHAT;
};

export const useNeuralSurrogate = (
    state: AuraState,
    currentCommand: string,
    syscall: (call: SyscallCall, args: any) => void
) => {
    const trainingQueue = useRef<{ input: string, label: number }[]>([]);
    const predictionDebounce = useRef<number | null>(null);

    // Initialize model on mount
    useEffect(() => {
        HAL.Surrogate.init();
    }, []);

    // Real-time Prediction on Keystroke
    useEffect(() => {
        if (!currentCommand || currentCommand.length < 3) {
             syscall('SURROGATE/UPDATE_STATE', { status: 'idle', lastPrediction: null });
             syscall('SURROGATE/SET_CIRCUIT', { circuit: null });
             return;
        }

        if (predictionDebounce.current) clearTimeout(predictionDebounce.current);

        predictionDebounce.current = window.setTimeout(async () => {
            syscall('SURROGATE/UPDATE_STATE', { status: 'predicting' });
            try {
                const result = await HAL.Surrogate.predict(currentCommand);
                const labels = HAL.Surrogate.LABELS;
                syscall('SURROGATE/UPDATE_STATE', {
                    status: 'idle',
                    lastPrediction: {
                        input: currentCommand,
                        predictedIntent: labels[result.labelIndex],
                        confidence: result.confidence,
                        timestamp: Date.now()
                    }
                });
                syscall('SURROGATE/SET_CIRCUIT', { circuit: result.circuit });
            } catch (e) {
                console.error("Surrogate Prediction Error:", e);
                syscall('SURROGATE/UPDATE_STATE', { status: 'idle' });
            }
        }, 300); // 300ms debounce

    }, [currentCommand, syscall]);

    // Training Loop (Simulated via hook effect, but triggered by command history updates)
    // In a real app, we'd hook into the command submission event directly.
    // Here, we'll observe the history length.
    const prevHistoryLength = useRef(state.history.length);
    
    useEffect(() => {
        if (state.history.length > prevHistoryLength.current) {
            const lastEntry = state.history[state.history.length - 1];
            // Only learn from user commands
            if (lastEntry.from === 'user' && lastEntry.text) {
                const label = labelInput(lastEntry.text);
                trainingQueue.current.push({ input: lastEntry.text, label });
                
                // Trigger training if queue is big enough
                if (trainingQueue.current.length >= 3) {
                    const batch = [...trainingQueue.current];
                    trainingQueue.current = [];
                    
                    syscall('SURROGATE/UPDATE_STATE', { status: 'training' });
                    HAL.Surrogate.train(batch).then(metrics => {
                         syscall('SURROGATE/UPDATE_STATE', { 
                             status: 'idle', 
                             accuracy: metrics.accuracy,
                             loss: metrics.loss,
                             trainingExamplesCount: state.neuralSurrogateState.trainingExamplesCount + batch.length
                        });
                    });
                }
            }
            prevHistoryLength.current = state.history.length;
        }
    }, [state.history, syscall, state.neuralSurrogateState.trainingExamplesCount]);
};
