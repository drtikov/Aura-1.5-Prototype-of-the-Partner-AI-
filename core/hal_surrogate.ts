
// core/hal_surrogate.ts
import { loadSdk } from './sdkLoader';

declare const tf: any;

let surrogateModel: any = null;
const WIDE_DIM = 256; // Virtual Width
const NARROW_DIM = 16; // Backbone Width (Bottleneck)
const NUM_CLASSES = 4; // CHAT, CODE, SEARCH, MEMORY
const EWC_LAMBDA = 500; // Regularization strength for EWC
const LABELS = ['CHAT', 'CODE', 'SEARCH', 'MEMORY']; // Defined outside to avoid reference errors

// State for EWC (Elastic Weight Consolidation)
let fisherDiag: any[] = []; // Diagonal of Fisher Information Matrix (as tensors)
let starWeights: any[] = []; // Snapshot of weights from previous task

// Simple hash function to vectorize text into fixed size (Wide)
const hashVectorize = (text: string, dim: number): number[] => {
    const vector = new Array(dim).fill(0);
    const normalized = text.toLowerCase().replace(/[^\w\s]/g, '');
    const tokens = normalized.split(/\s+/);
    
    for (const token of tokens) {
        let hash = 0;
        for (let i = 0; i < token.length; i++) {
            hash = ((hash << 5) - hash) + token.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % dim;
        vector[index] += 1;
    }
    
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? vector : vector.map(v => v / magnitude);
};

export const Surrogate = {
    LABELS, // Export the constant

    /**
     * Initializes or loads the surrogate model (VWN Architecture).
     */
    init: async (): Promise<void> => {
        await loadSdk('tensorflow');
        if (!tf) throw new Error("TensorFlow.js not loaded");

        try {
            // Try to load from IndexedDB first
            surrogateModel = await tf.loadLayersModel('indexeddb://aura-surrogate-vwn-model');
            console.log("Surrogate model (VWN) loaded from storage.");
        } catch (e) {
            console.log("Creating new surrogate model (VWN Architecture)...");
            
            // Virtual Width Network (VWN) Architecture for TFJS
            const input = tf.input({shape: [WIDE_DIM], name: 'vwn_input'});
            
            // GHC Down-projection (A)
            const compressed = tf.layers.dense({units: NARROW_DIM, activation: 'linear', name: 'ghc_compress'}).apply(input);
            
            // Backbone Processing (T) - The "Neural" part where we measure Fisher Info
            const backbone = tf.layers.dense({units: NARROW_DIM, activation: 'relu', name: 'backbone_process'}).apply(compressed);
            
            // GHC Up-projection (B)
            const expanded = tf.layers.dense({units: WIDE_DIM, activation: 'linear', name: 'ghc_expand'}).apply(backbone);
            
            // Residual connection (Wide State Persists: x + expanded)
            const wideState = tf.layers.add().apply([input, expanded]);
            
            // Readout
            const output = tf.layers.dense({units: NUM_CLASSES, activation: 'softmax', name: 'readout'}).apply(wideState);
            
            surrogateModel = tf.model({inputs: input, outputs: output});
        }
    },

    /**
     * Updates the Fisher Information Matrix based on current data.
     * This calculates the importance (curvature) of each weight.
     * Crucial for EWC to prevent catastrophic forgetting.
     */
    updateFisherInformation: async (xs: any, ys: any) => {
        if (!surrogateModel) return;
        
        // 1. Snapshot current weights (theta*)
        if (starWeights.length > 0) {
            starWeights.forEach((t: any) => t.dispose());
        }
        // Clone current weights to lock them as the 'center' of the penalty
        starWeights = surrogateModel.getWeights().map((w: any) => w.clone());
        
        // 2. Calculate Fisher Information
        const f: any = () => {
            const preds = surrogateModel.predict(xs);
            return tf.metrics.categoricalCrossentropy(ys, preds).mean();
        };
        
        // Get gradients of loss w.r.t weights
        const grads = tf.grad(f)(surrogateModel.getWeights());
        
        // Update running average of Fisher Diagonal
        if (fisherDiag.length === 0) {
            // Initialize Fisher with squared gradients
            fisherDiag = grads.map((g: any) => g.square());
        } else {
            // Moving average update: F_new = alpha * F_old + (1-alpha) * F_current
            const newFisher = fisherDiag.map((fOld: any, i: number) => {
                const gSquared = grads[i].square();
                // 0.9 smoothing factor to keep historical importance
                const updated = fOld.mul(0.9).add(gSquared.mul(0.1));
                fOld.dispose();
                gSquared.dispose();
                return updated;
            });
            fisherDiag = newFisher;
        }
    },

    /**
     * Custom training loop implementing EWC loss.
     */
    train: async (examples: { input: string, label: number }[]): Promise<{ loss: number, accuracy: number }> => {
        if (!surrogateModel) await Surrogate.init();
        if (examples.length === 0) return { loss: 0, accuracy: 0 };

        // Prepare Tensors
        const xs = tf.tensor2d(examples.map(e => hashVectorize(e.input, WIDE_DIM)));
        const ys = tf.oneHot(tf.tensor1d(examples.map(e => e.label), 'int32'), NUM_CLASSES);

        const optimizer = tf.train.adam(0.005);
        
        // Define EWC Loss Function
        const lossFn = () => {
            const preds = surrogateModel.predict(xs);
            const standardLoss = tf.metrics.categoricalCrossentropy(ys, preds).mean();
            
            // If we don't have previous task info (Fisher), just standard loss
            if (fisherDiag.length === 0 || starWeights.length === 0) return standardLoss;

            // Calculate EWC penalty
            let ewcLoss = tf.scalar(0);
            const currentWeights = surrogateModel.getWeights();
            
            for (let i = 0; i < currentWeights.length; i++) {
                const diff = currentWeights[i].sub(starWeights[i]);
                const squaredDiff = diff.square();
                const weightedDiff = fisherDiag[i].mul(squaredDiff);
                const termSum = weightedDiff.sum();
                ewcLoss = ewcLoss.add(termSum);
            }
            
            return standardLoss.add(ewcLoss.mul(EWC_LAMBDA / 2));
        };

        // Train loop
        let finalLoss = 0;
        for (let i = 0; i < 5; i++) { // 5 Epochs
            const h = await optimizer.minimize(lossFn, true);
            if (h) {
                finalLoss = h.dataSync()[0];
                h.dispose();
            }
        }

        // Update Fisher Information for next time (Online EWC)
        tf.tidy(() => {
             Surrogate.updateFisherInformation(xs, ys);
        });

        // Calculate Accuracy for reporting
        const pred = surrogateModel.predict(xs) as any;
        const accTensor = tf.metrics.categoricalAccuracy(ys, pred);
        const acc = (await accTensor.mean().data())[0];

        // Cleanup
        xs.dispose();
        ys.dispose();
        accTensor.dispose();
        pred.dispose();

        // Save updated model
        await surrogateModel.save('indexeddb://aura-surrogate-vwn-model');
        
        return { loss: finalLoss, accuracy: acc };
    },

    /**
     * Predicts the intent and extracts the VWN explanation circuit.
     */
    predict: async (input: string): Promise<{ labelIndex: number, confidence: number, scores: number[], circuit: any, robustness: number }> => {
        if (!surrogateModel) await Surrogate.init();
        
        const inputVec = hashVectorize(input, WIDE_DIM);
        const x = tf.tensor2d([inputVec]);
        
        // Manual Forward Pass to get internal activations
        const compressLayer = surrogateModel.getLayer('ghc_compress');
        const backboneLayer = surrogateModel.getLayer('backbone_process');
        const expandLayer = surrogateModel.getLayer('ghc_expand');
        const readoutLayer = surrogateModel.getLayer('readout');
        
        const compressed = compressLayer.apply(x);
        const backbone = backboneLayer.apply(compressed);
        const expanded = expandLayer.apply(backbone);
        const wideState = x.add(expanded);
        const output = readoutLayer.apply(wideState) as any;
        
        const scores = await output.data();
        const backboneData = await backbone.data();
        const wideStateData = await wideState.data();
        
        let robustnessScore = 0;
        if (fisherDiag.length > 0) {
             // Heuristic: Average Fisher value of the backbone layer
             const backboneKernelFisher = fisherDiag[2]; 
             if (backboneKernelFisher) {
                 const fisherValues = await backboneKernelFisher.data();
                 const avgFisher = fisherValues.reduce((a:number, b:number) => a+b, 0) / fisherValues.length;
                 robustnessScore = 1 - Math.exp(-100 * avgFisher); 
             }
        }

        x.dispose();
        compressed.dispose();
        backbone.dispose();
        expanded.dispose();
        wideState.dispose();
        output.dispose();

        const scoresArray = Array.from(scores as Float32Array);
        const maxScore = Math.max(...scoresArray);
        const labelIndex = scoresArray.indexOf(maxScore);
        
        // Visualization Logic
        const activeInputs = inputVec.map((v, i) => ({ i, v })).filter(item => item.v > 0).slice(0, 10);
        const activeBackbone = Array.from(backboneData).map((v: any, i: number) => ({ i, v })).sort((a: any, b: any) => b.v - a.v);
        const activeWide = Array.from(wideStateData).map((v: any, i: number) => ({ i, v })).sort((a: any, b: any) => b.v - a.v).slice(0, 12);

        const compressWeights = await compressLayer.getWeights()[0].data();
        const edges1 = [];
        for(const inp of activeInputs) {
            for(const bb of activeBackbone) {
                const w = compressWeights[inp.i * NARROW_DIM + bb.i];
                if (Math.abs(w) > 0.1) edges1.push({ source: `in_${inp.i}`, target: `bb_${bb.i}`, weight: w });
            }
        }
        
        const expandWeights = await expandLayer.getWeights()[0].data();
        const edges2 = [];
        for(const bb of activeBackbone) {
            if (bb.v <= 0) continue;
            for(const ws of activeWide) {
                 const w = expandWeights[bb.i * WIDE_DIM + ws.i];
                 if (Math.abs(w) > 0.1) edges2.push({ source: `bb_${bb.i}`, target: `ws_${ws.i}`, weight: w });
            }
        }
        
        const readoutWeights = await readoutLayer.getWeights()[0].data();
        const edges3 = [];
        for(const ws of activeWide) {
             const w = readoutWeights[ws.i * NUM_CLASSES + labelIndex];
             if (Math.abs(w) > 0.1) edges3.push({ source: `ws_${ws.i}`, target: `out_${labelIndex}`, weight: w });
        }
        
        const circuit = {
            nodes: [
                ...activeInputs.map(item => ({ id: `in_${item.i}`, layer: 'input' as const, label: `Token ${item.i}`, activation: item.v })),
                ...activeBackbone.map(item => ({ 
                    id: `bb_${item.i}`, 
                    layer: 'backbone' as const, 
                    label: `Core ${item.i}`, 
                    activation: item.v,
                    fisherImportance: robustnessScore 
                })),
                ...activeWide.map(item => ({ id: `ws_${item.i}`, layer: 'wide_state' as const, label: `Latent ${item.i}`, activation: item.v })),
                { id: `out_${labelIndex}`, layer: 'output' as const, label: LABELS[labelIndex], activation: maxScore }
            ],
            edges: [...edges1, ...edges2, ...edges3]
        };

        return { labelIndex, confidence: maxScore, scores: scoresArray, circuit, robustness: robustnessScore };
    }
};
