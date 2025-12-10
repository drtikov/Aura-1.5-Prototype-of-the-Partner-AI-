
// components/HardwarePrimitivesPanel.tsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocalization } from '../context/AuraContext';
import { HAL } from '../core/hal';
import { Accordion } from './Accordion';

interface TestResult {
    status: 'idle' | 'running' | 'success' | 'error';
    result?: any;
    error?: string;
}

interface BenchmarkResult {
    totalOps: number;
    timeMs: number;
    opsPerSec: number;
    passRate: number;
}

const TestResultDisplay: React.FC<{ name: string; explanation: string; testResult: TestResult }> = React.memo(({ name, explanation, testResult }) => {
    const getStatusInfo = () => {
        switch (testResult.status) {
            case 'success': return { color: 'var(--success-color)', icon: '✅' };
            case 'error': return { color: 'var(--failure-color)', icon: '❌' };
            case 'running': return { color: 'var(--warning-color)', icon: <div className="spinner-small" /> };
            case 'idle':
            default: return { color: 'var(--text-muted)', icon: '⚪' };
        }
    };
    const { icon, color } = getStatusInfo();

    return (
        <div className="proposal-card" style={{ marginBottom: '1rem', borderLeft: `3px solid ${color}` }}>
            <div className="proposal-card-header">
                <span className="proposal-type-badge" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background)' }}>{name}</span>
                <div className="mod-log-status" style={{ color, display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                    {icon} {testResult.status}
                </div>
            </div>
            <div className="proposal-card-body">
                <p><em>{explanation}</em></p>
                {testResult.status === 'success' && testResult.result && (
                    <div className="code-snippet-container" style={{ marginTop: '1rem' }}>
                        <pre><code>{testResult.result}</code></pre>
                    </div>
                )}
                {testResult.status === 'error' && <div className="failure-reason-display" style={{marginTop: '0.5rem'}}>{testResult.error}</div>}
            </div>
        </div>
    );
});


export const HardwarePrimitivesPanel = () => {
    const { t } = useLocalization();
    const [results, setResults] = useState<Record<string, TestResult>>({});
    const [benchmarkStats, setBenchmarkStats] = useState<BenchmarkResult | null>(null);
    const [isBenchmarking, setIsBenchmarking] = useState(false);

    const categories = useMemo(() => [
        // --- CATEGORY 1: Core Linear Algebra ---
        { name: 'Category 1: Core Linear Algebra', modules: [
            { name: 'MATRIX_INVERSION', explanation: 'Calculates the inverse of a 2x2 matrix.', testFn: () => HAL.Primitives.MATRIX_INVERSION([[1, 2], [3, 4]]) },
            { name: 'MATRIX_MVM', explanation: 'Multiplies a 2x2 matrix by a 2-element vector.', testFn: () => HAL.Primitives.MATRIX_MVM([[1, 2], [3, 4]], [5, 6]) },
            { name: 'VECTOR_DOT_PRODUCT', explanation: 'Calculates the dot product of two vectors.', testFn: () => HAL.Primitives.VECTOR_DOT_PRODUCT([1, 2, 3], [4, 5, 6]) },
            { name: 'VECTOR_ADDITION', explanation: 'Performs element-wise addition of two vectors.', testFn: () => HAL.Primitives.VECTOR_ADDITION([1, 2], [3, 4]) },
            { name: 'VECTOR_SUBTRACTION', explanation: 'Performs element-wise subtraction of two vectors.', testFn: () => HAL.Primitives.VECTOR_SUBTRACTION([10, 5], [3, 2]) },
            { name: 'VECTOR_SCALAR_MULTIPLICATION', explanation: 'Multiplies each element of a vector by a scalar.', testFn: () => HAL.Primitives.VECTOR_SCALAR_MULTIPLICATION([1, 2, 3], 5) },
            { name: 'VECTOR_NORMALIZATION', explanation: 'Scales a vector to a magnitude of 1.', testFn: () => HAL.Primitives.VECTOR_NORMALIZATION([3, 4]) },
            { name: 'MATRIX_ADDITION', explanation: 'Performs element-wise addition of two matrices.', testFn: () => HAL.Primitives.MATRIX_ADDITION([[1,2],[3,4]], [[5,6],[7,8]]) },
            { name: 'MATRIX_MULTIPLICATION', explanation: 'Performs matrix multiplication.', testFn: () => HAL.Primitives.MATRIX_MULTIPLICATION([[1,2],[3,4]], [[5,6],[7,8]]) },
            { name: 'MATRIX_TRANSPOSE', explanation: 'Flips a matrix over its diagonal.', testFn: () => HAL.Primitives.MATRIX_TRANSPOSE([[1,2,3],[4,5,6]]) },
            { name: 'MATRIX_DETERMINANT', explanation: 'Calculates the determinant of a 2x2 matrix.', testFn: () => HAL.Primitives.MATRIX_DETERMINANT([[4, 6], [3, 8]]) },
            { 
                name: 'JACOBIAN_MATRIX_CALCULATION', 
                explanation: 'Numerically computes the Jacobian for f([x,y]) = [x²y, 5x + sin(y)] at [1, π/2] via central difference.', 
                testFn: () => HAL.Primitives.JACOBIAN_MATRIX_CALCULATION(
                    (args) => {
                        const x = args[0], y = args[1];
                        return [x * x * y, 5 * x + Math.sin(y)];
                    }, 
                    [1, Math.PI / 2]
                ) 
            },
            { name: 'VECTOR_MAGNITUDE', explanation: 'Calculates the length of a vector.', testFn: () => HAL.Primitives.VECTOR_MAGNITUDE([3, 4]) },
            { name: 'VECTOR_DISTANCE', explanation: 'Calculates Euclidean distance between two vectors.', testFn: () => HAL.Primitives.VECTOR_DISTANCE([1, 2], [4, 6]) },
            { name: 'MATRIX_SCALAR_MULTIPLICATION', explanation: 'Multiplies a matrix by a scalar.', testFn: () => HAL.Primitives.MATRIX_SCALAR_MULTIPLICATION([[1,2],[3,4]], 10) },
            { name: 'MATRIX_TRACE', explanation: 'Calculates the sum of the diagonal elements.', testFn: () => HAL.Primitives.MATRIX_TRACE([[1,2,3],[4,5,6],[7,8,9]]) },
            { name: 'IDENTITY_MATRIX', explanation: 'Creates an identity matrix of size 3.', testFn: () => HAL.Primitives.IDENTITY_MATRIX(3) },
            { name: 'OUTER_PRODUCT', explanation: 'Calculates the outer product of two vectors.', testFn: () => HAL.Primitives.OUTER_PRODUCT([1,2], [3,4,5]) },
            { name: 'HADAMARD_PRODUCT', explanation: 'Performs element-wise matrix multiplication.', testFn: () => HAL.Primitives.HADAMARD_PRODUCT([[1,2],[3,4]], [[5,6],[7,8]]) },
            { name: 'VECTOR_ANGLE', explanation: 'Computes the angle between two vectors in radians.', testFn: () => HAL.Primitives.VECTOR_ANGLE([1,0], [0,1]) },
            { name: 'ZERO_MATRIX', explanation: 'Creates a 2x3 matrix of zeros.', testFn: () => HAL.Primitives.ZERO_MATRIX(2,3) },
            { name: 'MATRIX_SCALAR_ADDITION', explanation: 'Adds a scalar to each element of a matrix.', testFn: () => HAL.Primitives.MATRIX_SCALAR_ADDITION([[1,2],[3,4]], 10) },
            // NEW
            { name: 'MATRIX_PSEUDOINVERSE', explanation: 'Computes the Moore-Penrose inverse of a matrix.', testFn: () => HAL.Primitives.MATRIX_PSEUDOINVERSE([[1, 2], [3, 4], [5, 6]]) },
            { name: 'LU_DECOMPOSITION_PIVOT', explanation: 'Performs LU decomposition with partial pivoting.', testFn: () => HAL.Primitives.LU_DECOMPOSITION_PIVOT([[0, 1], [1, 1]]) },
            { name: 'QR_DECOMPOSITION_HOUSEHOLDER', explanation: 'Performs QR decomposition using Householder reflections.', testFn: () => HAL.Primitives.QR_DECOMPOSITION_HOUSEHOLDER([[12, -51], [6, 167], [-4, 24]]) },
            { name: 'CHOLESKY_UPDATE', explanation: 'Updates a Cholesky factorization with a rank-1 update.', testFn: () => HAL.Primitives.CHOLESKY_UPDATE([[2, 0], [1, 1]], [1, 1]) },
            { name: 'VECTOR_PROJECTION_PLANE', explanation: 'Projects a vector onto a plane defined by a normal.', testFn: () => HAL.Primitives.VECTOR_PROJECTION_PLANE([3, 3, 3], [0, 0, 1]) },
        ]},
        // --- CATEGORY 2: Advanced Linear Algebra & Decomposition ---
        { name: 'Category 2: Advanced Linear Algebra & Decomposition', modules: [
            { name: 'EIGENVALUE_DECOMPOSITION', explanation: 'Decomposes a symmetric matrix using QR Algorithm.', testFn: () => HAL.Primitives.EIGENVALUE_DECOMPOSITION([[2, 1], [1, 2]]) },
            { name: 'SINGULAR_VALUE_DECOMPOSITION', explanation: 'Full SVD Factorization (U, S, V).', testFn: () => HAL.Primitives.SINGULAR_VALUE_DECOMPOSITION([[3, 2, 2], [2, 3, -2]]) },
            { name: 'CHOLESKY_DECOMPOSITION', explanation: 'Decomposes a 2x2 symmetric, positive-definite matrix.', testFn: () => HAL.Primitives.CHOLESKY_DECOMPOSITION([[4, 12], [12, 37]]) },
            { name: 'QR_DECOMPOSITION', explanation: 'Decomposes a 2x2 matrix into Q and R matrices.', testFn: () => HAL.Primitives.QR_DECOMPOSITION([[12, -51], [6, 167]]) },
            { name: 'GAUSSIAN_ELIMINATION', explanation: 'Solves a 2x2 system of linear equations.', testFn: () => HAL.Primitives.GAUSSIAN_ELIMINATION([[2, 1], [1, 3]], [5, 5]) },
            { name: 'PRINCIPAL_COMPONENT_ANALYSIS', explanation: 'Performs PCA on 2D data.', testFn: () => HAL.Primitives.PRINCIPAL_COMPONENT_ANALYSIS([[1,2,3,4],[2,4,6,8]]) },
            { name: 'LU_DECOMPOSITION', explanation: 'Performs LU decomposition on a 2x2 matrix.', testFn: () => HAL.Primitives.LU_DECOMPOSITION([[4,3],[6,3]]) },
            { name: 'SOLVE_LINEAR_SYSTEM', explanation: 'Solves Ax=b using Gaussian elimination.', testFn: () => HAL.Primitives.SOLVE_LINEAR_SYSTEM([[2,1],[1,3]], [5,5]) },
            { name: 'POWER_ITERATION', explanation: 'Finds the dominant eigenvalue of a 2x2 matrix.', testFn: () => HAL.Primitives.POWER_ITERATION([[2, -1], [-1, 2]]) },
            { name: 'GRAM_SCHMIDT', explanation: 'Orthogonalizes two 2D vectors.', testFn: () => HAL.Primitives.GRAM_SCHMIDT([[3,0], [2,2]]) },
            { name: 'MATRIX_RANK', explanation: 'Calculates the rank of a 2x2 matrix.', testFn: () => HAL.Primitives.MATRIX_RANK([[1,2],[2,4]]) },
            { name: 'IS_ORTHOGONAL', explanation: 'Checks if a matrix is orthogonal.', testFn: () => HAL.Primitives.IS_ORTHOGONAL([[0,1],[-1,0]]) },
            { name: 'IS_SYMMETRIC', explanation: 'Checks if a matrix is symmetric.', testFn: () => HAL.Primitives.IS_SYMMETRIC([[1,2],[2,1]]) },
            { name: 'PROJECT_VECTOR', explanation: 'Projects vector v onto vector u.', testFn: () => HAL.Primitives.PROJECT_VECTOR([1,2], [3,1]) },
            { name: 'DIAGONALIZE_MATRIX_2X2', explanation: 'Diagonalizes a 2x2 symmetric matrix.', testFn: () => HAL.Primitives.DIAGONALIZE_MATRIX_2X2([[1,2],[2,1]]) },
            { name: 'MATRIX_EXPONENTIAL', explanation: 'Calculates e^A using Scaling and Squaring.', testFn: () => HAL.Primitives.MATRIX_EXPONENTIAL([[0, 1], [-1, 0]]) },
            // NEW
            { name: 'POINT_IN_POLYGON_WINDING', explanation: 'Checks if point is inside polygon.', testFn: () => HAL.Primitives.POINT_IN_POLYGON_WINDING([0.5, 0.5], [[0,0], [1,0], [1,1], [0,1]]) },
            { name: 'LINE_SEGMENT_INTERSECTION', explanation: 'Finds intersection of two line segments.', testFn: () => HAL.Primitives.LINE_SEGMENT_INTERSECTION([0,0], [1,1], [0,1], [1,0]) },
            { name: 'DOUGLAS_PEUCKER_SIMPLIFICATION', explanation: 'Simplifies a polyline.', testFn: () => HAL.Primitives.DOUGLAS_PEUCKER_SIMPLIFICATION([[0,0], [1,0.1], [2,0]], 0.2) },
            { name: 'BEZIER_CUBIC_EVALUATE', explanation: 'Evaluates a cubic Bezier curve at t=0.5.', testFn: () => HAL.Primitives.BEZIER_CUBIC_EVALUATE(0.5, [0,0], [0,1], [1,1], [1,0]) },
            { name: 'VORONOI_RELAXATION_STEP', explanation: 'Relaxes points on a 10x10 grid using Lloyd\'s algorithm.', testFn: () => HAL.Primitives.VORONOI_RELAXATION_STEP([[2,2], [8,8]], 10, 10) },
        ]},
        // --- CATEGORY 3: Signal, Image, & Video Processing ---
        { name: 'Category 3: Signal, Image, & Video Processing', modules: [
            { name: 'FAST_FOURIER_TRANSFORM', explanation: 'Calculates the DFT of a simple signal.', testFn: () => HAL.Primitives.FAST_FOURIER_TRANSFORM([1, 0, 1, 0]) },
            { name: 'INVERSE_FOURIER_TRANSFORM', explanation: 'Calculates the I-DFT of a frequency spectrum.', testFn: () => HAL.Primitives.INVERSE_FOURIER_TRANSFORM([2, 0, 2, 0], [0, 0, 0, 0]) },
            { name: 'CONVOLUTION_2D', explanation: 'Applies a 2D convolution.', testFn: () => HAL.Primitives.CONVOLUTION_2D([[1,1,1],[1,1,1],[1,1,1]], [[1,0],[0,1]]) },
            { name: 'CROSS_CORRELATION', explanation: 'Measures similarity of two signals via cross-correlation.', testFn: () => HAL.Primitives.CROSS_CORRELATION([1, 2, 3, 4], [1, 2]) },
            { name: 'WAVELET_TRANSFORM', explanation: 'Performs a simplified Haar wavelet transform.', testFn: () => HAL.Primitives.WAVELET_TRANSFORM([9, 7, 3, 5]) },
            { name: 'LOW_PASS_FILTER', explanation: 'Applies a simple moving average filter.', testFn: () => HAL.Primitives.LOW_PASS_FILTER([1, 2, 10, 2, 1]) },
            { name: 'HIGH_PASS_FILTER', explanation: 'Applies a simple difference filter to detect changes.', testFn: () => HAL.Primitives.HIGH_PASS_FILTER([1, 1, 10, 10, 10]) },
            { name: 'SOBEL_EDGE_DETECTION', explanation: 'Applies Sobel operators to find gradients.', testFn: () => HAL.Primitives.SOBEL_EDGE_DETECTION([[3,3,3],[3,1,3],[3,3,3]]) },
            { name: 'GRAYSCALE_CONVERSION', explanation: 'Converts an RGB color to grayscale.', testFn: () => HAL.Primitives.GRAYSCALE_CONVERSION(100, 150, 200) },
            { name: 'FRAME_DIFFERENCING', explanation: 'Calculates the absolute difference between two frames.', testFn: () => HAL.Primitives.FRAME_DIFFERENCING([10, 50, 100], [20, 40, 120]) },
            { name: 'SPECTROGRAM_GENERATION', explanation: 'Generates a simple spectrogram.', testFn: () => HAL.Primitives.SPECTROGRAM_GENERATION([1,2,3,4,5,6,7,8], 4) },
            { name: 'WAVELET_DENOISING', explanation: 'Denoises a signal using wavelet thresholding.', testFn: () => HAL.Primitives.WAVELET_DENOISING([9, 7, 3, 5, 1, 0, 0.5, 0.2], 1.5) },
            // NEW
            { name: 'MEDIAN_FILTER_2D', explanation: 'Applies a median filter to a 2D image.', testFn: () => HAL.Primitives.MEDIAN_FILTER_2D([[1,1,1],[1,100,1],[1,1,1]], 3) },
            { name: 'HOUGH_TRANSFORM_LINES', explanation: 'Detects lines in a binary edge image.', testFn: () => HAL.Primitives.HOUGH_TRANSFORM_LINES([[0,0,1],[0,1,0],[1,0,0]]) },
            { name: 'BILINEAR_INTERPOLATION', explanation: 'Interpolates pixel value at (0.5, 0.5).', testFn: () => HAL.Primitives.BILINEAR_INTERPOLATION([[0,10],[10,20]], 0.5, 0.5) },
            { name: 'HISTOGRAM_EQUALIZATION', explanation: 'Equalizes histogram of a grayscale image.', testFn: () => HAL.Primitives.HISTOGRAM_EQUALIZATION([[10, 20], [30, 40]]) },
            { name: 'DCT_II', explanation: 'Calculates the Type-II Discrete Cosine Transform.', testFn: () => HAL.Primitives.DCT_II([1, 2, 3, 4]) },
        ]},
        // --- CATEGORY 4: Statistics & Probabilistic Methods ---
        { name: 'Category 4: Statistics & Probabilistic Methods', modules: [
            { name: 'VECTOR_MEAN', explanation: 'Calculates the mean of a vector.', testFn: () => HAL.Primitives.VECTOR_MEAN([10, 20, 30, 40]) },
            { name: 'VECTOR_STD_DEV', explanation: 'Calculates the standard deviation of a vector.', testFn: () => HAL.Primitives.VECTOR_STD_DEV([10, 20, 30, 40]) },
            { name: 'PEARSON_CORRELATION', explanation: 'Calculates the Pearson correlation coefficient.', testFn: () => HAL.Primitives.PEARSON_CORRELATION([1,2,3], [2,4,6.5]) },
            { name: 'COVARIANCE_MATRIX', explanation: 'Computes the covariance matrix for a set of vectors.', testFn: () => HAL.Primitives.COVARIANCE_MATRIX([[1,5,6], [4,3,9]]) },
            { name: 'SHANNON_ENTROPY', explanation: 'Calculates the Shannon entropy of a probability distribution.', testFn: () => HAL.Primitives.SHANNON_ENTROPY([0.5, 0.25, 0.25]) },
            { name: 'T_TEST_STATISTIC', explanation: 'Calculates the t-statistic for two independent samples.', testFn: () => HAL.Primitives.T_TEST_STATISTIC([2,3,4], [5,6,7]) },
            { name: 'LINEAR_REGRESSION_FIT', explanation: 'Fits a simple linear regression model.', testFn: () => HAL.Primitives.LINEAR_REGRESSION_FIT([1,2,3,4], [2,4,5,7]) },
            { name: 'LOGISTIC_REGRESSION_PREDICT', explanation: 'Predicts probability using a logistic regression model.', testFn: () => HAL.Primitives.LOGISTIC_REGRESSION_PREDICT([1, 2], [0.5, -0.5], 0.1) },
            { name: 'BAYESIAN_INFERENCE_UPDATE', explanation: 'Performs a simple Bayesian update. P(H|E) = (P(E|H) * P(H)) / P(E)', testFn: () => HAL.Primitives.BAYESIAN_INFERENCE_UPDATE(0.5, 0.8, 0.6) },
            { name: 'VECTOR_MEDIAN', explanation: 'Finds the median of a vector.', testFn: () => HAL.Primitives.VECTOR_MEDIAN([1, 5, 2, 8, 7]) },
            { name: 'VECTOR_MODE', explanation: 'Finds the mode of a vector.', testFn: () => HAL.Primitives.VECTOR_MODE([1, 2, 2, 3, 4, 4, 4, 5]) },
            { name: 'VECTOR_VARIANCE', explanation: 'Calculates the variance of a vector.', testFn: () => HAL.Primitives.VECTOR_VARIANCE([1, 2, 3, 4, 5]) },
            { name: 'COVARIANCE', explanation: 'Calculates the covariance between two vectors.', testFn: () => HAL.Primitives.COVARIANCE([1,2,3], [2,3,5]) },
            { name: 'NORMAL_DISTRIBUTION_PDF', explanation: 'PDF for normal distribution (μ=0, σ=1) at x=0.5.', testFn: () => HAL.Primitives.NORMAL_DISTRIBUTION_PDF(0.5, 0, 1) },
            { name: 'POISSON_DISTRIBUTION_PMF', explanation: 'PMF for Poisson distribution (λ=4) at k=3.', testFn: () => HAL.Primitives.POISSON_DISTRIBUTION_PMF(3, 4) },
            { name: 'CHI_SQUARED_TEST', explanation: 'Calculates Chi-Squared statistic.', testFn: () => HAL.Primitives.CHI_SQUARED_TEST([10,10,20], [12,8,20]) },
            { name: 'F_STATISTIC_CALCULATION', explanation: 'Calculates an F-statistic.', testFn: () => HAL.Primitives.F_STATISTIC_CALCULATION([1,2,3], [2,3,4]) },
            { name: 'MONTE_CARLO_PI', explanation: 'Estimates Pi using Monte Carlo method (10000 samples).', testFn: () => HAL.Primitives.MONTE_CARLO_PI(10000) },
            { name: 'MARKOV_CHAIN_TRANSITION', explanation: 'Simulates a state transition in a Markov chain.', testFn: () => HAL.Primitives.MARKOV_CHAIN_TRANSITION(0, [[0.1, 0.9], [0.5, 0.5]]) },
            // NEW
            { name: 'KULLBACK_LEIBLER_DIVERGENCE', explanation: 'Calculates KL Divergence.', testFn: () => HAL.Primitives.KULLBACK_LEIBLER_DIVERGENCE([0.1, 0.9], [0.2, 0.8]) },
            { name: 'SPEARMAN_RANK_CORRELATION', explanation: 'Calculates Spearman Rank Correlation.', testFn: () => HAL.Primitives.SPEARMAN_RANK_CORRELATION([10, 20, 30], [2, 5, 6]) },
            { name: 'F1_SCORE_CALCULATION', explanation: 'Calculates F1 score from Precision and Recall.', testFn: () => HAL.Primitives.F1_SCORE_CALCULATION(0.8, 0.9) },
            { name: 'ROC_CURVE_GENERATION', explanation: 'Generates ROC points.', testFn: () => HAL.Primitives.ROC_CURVE_GENERATION([0, 0, 1, 1], [0.1, 0.4, 0.35, 0.8]) },
            { name: 'GMM_EM_STEP', explanation: 'Performs one EM step for GMM.', testFn: () => HAL.Primitives.GMM_EM_STEP([1, 2, 10, 12], [1.5, 11], [0.5, 0.5], [0.5, 0.5]) },
        ]},
        // --- CATEGORY 5: Machine Learning: Foundational Primitives ---
        { name: 'Category 5: Machine Learning: Foundational Primitives', modules: [
             { name: 'RELU_ACTIVATION', explanation: 'Applies the Rectified Linear Unit (ReLU) activation function.', testFn: () => HAL.Primitives.RELU_ACTIVATION([-2, -1, 0, 1, 2]) },
             { name: 'SIGMOID_ACTIVATION', explanation: 'Applies the sigmoid activation function.', testFn: () => HAL.Primitives.SIGMOID_ACTIVATION(0.5) },
             { name: 'TANH_ACTIVATION', explanation: 'Applies the hyperbolic tangent activation function.', testFn: () => HAL.Primitives.TANH_ACTIVATION(-1) },
             { name: 'MAX_POOLING_2D', explanation: 'Performs a 2x2 max pooling operation.', testFn: () => HAL.Primitives.MAX_POOLING_2D([[1,2,3,4],[5,6,7,8],[9,1,2,3],[4,5,6,7]], 2) },
             { name: 'AVERAGE_POOLING_2D', explanation: 'Performs a 2x2 average pooling operation.', testFn: () => HAL.Primitives.AVERAGE_POOLING_2D([[1,2,3,4],[5,6,7,8],[9,1,2,3],[4,5,6,7]], 2) },
             { name: 'BATCH_NORMALIZATION', explanation: 'Normalizes a layer activation.', testFn: () => HAL.Primitives.BATCH_NORMALIZATION([1,2,3,4,5], 1, 0) },
             { name: 'DROPOUT_LAYER', explanation: 'Implements dropout regularization (rate=0.5).', testFn: () => HAL.Primitives.DROPOUT_LAYER([1,1,1,1,1,1,1,1], 0.5) },
             { name: 'SGD_UPDATE_STEP', explanation: 'Executes one SGD update step.', testFn: () => HAL.Primitives.SGD_UPDATE_STEP(0.8, 0.2, 0.1) },
             { name: 'TOKENIZE_TEXT', explanation: 'Splits text into tokens.', testFn: () => HAL.Primitives.TOKENIZE_TEXT("Aura is a symbiotic AGI.") },
             { name: 'L1_REGULARIZATION', explanation: 'Calculates the L1 norm of a vector.', testFn: () => HAL.Primitives.L1_REGULARIZATION([-1, 2, -3]) },
             { name: 'L2_REGULARIZATION', explanation: 'Calculates the L2 norm of a vector.', testFn: () => HAL.Primitives.L2_REGULARIZATION([3, 4]) },
             { name: 'CROSS_ENTROPY_LOSS', explanation: 'Calculates cross-entropy loss.', testFn: () => HAL.Primitives.CROSS_ENTROPY_LOSS([0.1, 0.9], [0, 1]) },
             { name: 'MEAN_SQUARED_ERROR', explanation: 'Calculates Mean Squared Error.', testFn: () => HAL.Primitives.MEAN_SQUARED_ERROR([1,2,3], [1.1, 2.2, 2.9]) },
             { name: 'SOFTMAX', explanation: 'Applies the softmax function.', testFn: () => HAL.Primitives.SOFTMAX([1, 2, 3]) },
             { name: 'ONE_HOT_ENCODE', explanation: 'Performs one-hot encoding.', testFn: () => HAL.Primitives.ONE_HOT_ENCODE(1, 3) },
             { name: 'TF_IDF_CALCULATION', explanation: 'Calculates TF-IDF score.', testFn: () => HAL.Primitives.TF_IDF_CALCULATION(2, 10, 5) },
             { name: 'N_GRAM_GENERATION', explanation: 'Generates bi-grams from text.', testFn: () => HAL.Primitives.N_GRAM_GENERATION("aura is an ai", 2) },
             { name: 'WORD_EMBEDDING_LOOKUP', explanation: 'Simulates looking up a word embedding.', testFn: () => HAL.Primitives.WORD_EMBEDDING_LOOKUP('aura', {'aura': [0.1, 0.2], 'ai': [0.3, 0.4]}) },
             { name: 'BAG_OF_WORDS_VECTORIZATION', explanation: 'Converts text to a Bag-of-Words vector.', testFn: () => HAL.Primitives.BAG_OF_WORDS_VECTORIZATION("the cat sat on the mat", ["the", "cat", "sat", "on", "mat"]) },
             // NEW
             { name: 'AUTOCORRELATION_FUNCTION', explanation: 'Calculates autocorrelation of a signal.', testFn: () => HAL.Primitives.AUTOCORRELATION_FUNCTION([1, 2, 3, 4, 5], 1) },
             { name: 'MACD_CALCULATION', explanation: 'Calculates Moving Average Convergence Divergence.', testFn: () => HAL.Primitives.MACD_CALCULATION(new Array(30).fill(0).map((_,i)=>i)) },
             { name: 'RSI_CALCULATION', explanation: 'Calculates Relative Strength Index.', testFn: () => HAL.Primitives.RSI_CALCULATION(new Array(20).fill(0).map((_,i)=>i%2?10:20)) },
             { name: 'FAST_DTW', explanation: 'Calculates approximated DTW distance.', testFn: () => HAL.Primitives.FAST_DTW([1,2,3,4], [1,2,2,3,4]) },
             { name: 'HURST_EXPONENT', explanation: 'Estimates the Hurst Exponent.', testFn: () => HAL.Primitives.HURST_EXPONENT([1, 2, 4, 7, 11, 16]) },
        ]},
        // --- CATEGORY 6: Machine Learning: Advanced Models & Optimization ---
        { name: 'Category 6: Machine Learning: Advanced Models & Optimization', modules: [
            { name: 'ADAM_OPTIMIZER_STEP', explanation: 'Executes one ADAM optimizer update step.', testFn: () => HAL.Primitives.ADAM_OPTIMIZER_STEP(0.5, 0.1, 0, 0, 1) },
            { name: 'ATTENTION_MECHANISM_SCORE', explanation: 'Calculates a simplified dot-product attention score.', testFn: () => HAL.Primitives.ATTENTION_MECHANISM_SCORE([0.1, 0.5, 0.2], [0.8, 0.1, 0.3]) },
            { name: 'K_MEANS_CLUSTERING_STEP', explanation: 'Assigns points to the nearest centroids.', testFn: () => HAL.Primitives.K_MEANS_CLUSTERING_STEP([[1,1],[1,2],[6,7],[7,8]], [[0,0],[9,9]]) },
            { name: 'COSINE_SIMILARITY', explanation: 'Calculates the cosine similarity between two vectors.', testFn: () => HAL.Primitives.COSINE_SIMILARITY([1, 2, 3], [4, 5, 6]) },
            { name: 'RECURRENT_NEURAL_UNIT', explanation: 'Simulates a simplified RNN (GRU-like) unit.', testFn: () => HAL.Primitives.RECURRENT_NEURAL_UNIT(0.5, 0.1, 0.8, 0.2, -0.1) },
            { name: 'SVM_TRAIN_STEP', explanation: 'Simulates an SVM training step.', testFn: () => HAL.Primitives.SVM_TRAIN_STEP([1, -1], 0, [1, 2], 1, 0.1, 1) },
            { name: 'NAIVE_BAYES_CLASSIFIER', explanation: 'Simulates a Naive Bayes prediction.', testFn: () => HAL.Primitives.NAIVE_BAYES_CLASSIFIER({'sports':{'prior':0.5, 'cond':{'fast':0.8, 'loan':0.1}}, 'finance':{'prior':0.5, 'cond':{'fast':0.2, 'loan':0.9}}}, ['fast', 'loan']) },
            { name: 'DECISION_TREE_SPLIT_GAIN', explanation: 'Calculates information gain for a split.', testFn: () => HAL.Primitives.DECISION_TREE_SPLIT_GAIN([1,1,0,0], [1,1], [0,0]) },
            { name: 'DYNAMIC_TIME_WARPING', explanation: 'Calculates DTW distance between two sequences.', testFn: () => HAL.Primitives.DYNAMIC_TIME_WARPING([1,2,3], [1,2,2,3]) },
            { name: 'REINFORCEMENT_LEARNING_UPDATE', explanation: 'Simulates a Q-learning update.', testFn: () => HAL.Primitives.REINFORCEMENT_LEARNING_UPDATE(0.5, 1, 0, 0.1, 0.9) },
            { name: 'GENETIC_ALGORITHM_CROSSOVER', explanation: 'Performs a single-point crossover.', testFn: () => HAL.Primitives.GENETIC_ALGORITHM_CROSSOVER([1,1,1,1,1], [0,0,0,0,0]) },
            { name: 'GENETIC_ALGORITHM_MUTATION', explanation: 'Performs a bit-flip mutation.', testFn: () => HAL.Primitives.GENETIC_ALGORITHM_MUTATION([0,0,0,0,0], 0.2) },
        ]},
        // --- CATEGORY 7: Algorithms & Data Structures ---
        { name: 'Category 7: Algorithms & Data Structures', modules: [
            { name: 'QUICKSORT_VECTOR', explanation: 'Sorts a vector using Quicksort.', testFn: () => HAL.Primitives.QUICKSORT_VECTOR([5, 3, 8, 1, 9, 4]) },
            { name: 'MERGESORT_VECTOR', explanation: 'Sorts a vector using Mergesort.', testFn: () => HAL.Primitives.MERGESORT_VECTOR([5, 3, 8, 1, 9, 4]) },
            { name: 'CRC32_HASH', explanation: 'Computes a 32-bit CRC hash.', testFn: () => HAL.Primitives.CRC32_HASH('hello world') },
            { name: 'LEVENSHTEIN_DISTANCE', explanation: 'Calculates the edit distance between two strings.', testFn: () => HAL.Primitives.LEVENSHTEIN_DISTANCE('saturday', 'sunday') },
            { name: 'BINARY_SEARCH', explanation: 'Finds an item in a sorted array.', testFn: () => HAL.Primitives.BINARY_SEARCH([1,3,5,7,9], 7) },
            { name: 'HEAP_INSERTION', explanation: 'Inserts into a min-heap.', testFn: () => HAL.Primitives.HEAP_INSERTION([3, 8, 5], 2) },
            { name: 'TRIE_INSERTION', explanation: 'Inserts a word into a trie.', testFn: () => HAL.Primitives.TRIE_INSERTION({}, "cat") },
            { name: 'SIMULATED_ANNEALING_ACCEPTANCE', explanation: 'Calculates acceptance probability.', testFn: () => HAL.Primitives.SIMULATED_ANNEALING_ACCEPTANCE(10, 12, 1) },
            // NEW
            { name: 'KMP_SEARCH', explanation: 'Searches for a substring using KMP algorithm.', testFn: () => HAL.Primitives.KMP_SEARCH("abxabcabcaby", "abcaby") },
            { name: 'LONGEST_COMMON_SUBSEQUENCE', explanation: 'Finds LCS of two strings.', testFn: () => HAL.Primitives.LONGEST_COMMON_SUBSEQUENCE("AGGTAB", "GXTXAYB") },
            { name: 'JARO_WINKLER_DISTANCE', explanation: 'Calculates string similarity.', testFn: () => HAL.Primitives.JARO_WINKLER_DISTANCE("MARTHA", "MARHTA") },
            { name: 'BURROWS_WHEELER_TRANSFORM', explanation: 'Computes BWT of a string.', testFn: () => HAL.Primitives.BURROWS_WHEELER_TRANSFORM("banana") },
            { name: 'TF_IDF_VECTORIZER', explanation: 'Computes TF-IDF vectors for a corpus.', testFn: () => HAL.Primitives.TF_IDF_VECTORIZER(["the cat sat", "the dog sat"]) },
        ]},
        // --- CATEGORY 8: Graph Theory & Network Analysis ---
        { name: 'Category 8: Graph Theory & Network Analysis', modules: [
            { name: 'PAGE_RANK_ITERATION', explanation: 'Performs one iteration of the PageRank algorithm.', testFn: () => HAL.Primitives.PAGE_RANK_ITERATION([[0,1,0],[0,0,1],[1,0,0]], [1,1,1]) },
            { name: 'SHORTEST_PATH_DIJKSTRA', explanation: 'Finds the shortest path in a graph using Dijkstra.', testFn: () => HAL.Primitives.SHORTEST_PATH_DIJKSTRA([[0,1,4,0],[0,0,2,5],[0,0,0,1],[0,0,0,0]], 0) },
            { name: 'BREADTH_FIRST_SEARCH', explanation: 'Performs a BFS traversal.', testFn: () => HAL.Primitives.BREADTH_FIRST_SEARCH([[0,1,1,0],[0,0,0,1],[0,0,0,0],[0,0,0,0]], 0) },
            { name: 'DEPTH_FIRST_SEARCH', explanation: 'Performs a DFS traversal.', testFn: () => HAL.Primitives.DEPTH_FIRST_SEARCH([[0,1,1,0],[0,0,0,1],[0,0,0,0],[0,0,0,0]], 0) },
            { name: 'MINIMUM_SPANNING_TREE_KRUSKAL', explanation: 'Finds an MST using Kruskal\'s algorithm.', testFn: () => HAL.Primitives.MINIMUM_SPANNING_TREE_KRUSKAL([[0,1,3],[1,0,2],[3,2,0]]) },
            { name: 'GRAPH_CENTRALITY_DEGREE', explanation: 'Calculates degree centrality.', testFn: () => HAL.Primitives.GRAPH_CENTRALITY_DEGREE([[0,1,0],[1,0,1],[0,1,0]]) },
            // NEW
            { name: 'FLOYD_WARSHALL', explanation: 'Computes all-pairs shortest paths.', testFn: () => HAL.Primitives.FLOYD_WARSHALL([[0, 5, Infinity], [Infinity, 0, 2], [Infinity, Infinity, 0]]) },
            { name: 'TOPOLOGICAL_SORT', explanation: 'Sorts a DAG topologically.', testFn: () => HAL.Primitives.TOPOLOGICAL_SORT([[0,0,1],[0,0,1],[0,0,0]]) },
            { name: 'MAX_FLOW_EDMONDS_KARP', explanation: 'Calculates max flow in a network.', testFn: () => HAL.Primitives.MAX_FLOW_EDMONDS_KARP([[0, 10, 10, 0], [0, 0, 2, 8], [0, 0, 0, 9], [0, 0, 0, 0]], 0, 3) },
            { name: 'STRONGLY_CONNECTED_COMPONENTS', explanation: 'Finds SCCs in a graph.', testFn: () => HAL.Primitives.STRONGLY_CONNECTED_COMPONENTS([[0,1,0,0], [0,0,1,0], [1,0,0,1], [0,0,0,0]]) },
            { name: 'GRAPH_ISOMORPHISM_VF2', explanation: 'Checks if two small graphs are isomorphic.', testFn: () => HAL.Primitives.GRAPH_ISOMORPHISM_VF2([[0,1],[1,0]], [[0,1],[1,0]]) },
        ]},
        // --- CATEGORY 9: Cryptography & Security ---
        { name: 'Category 9: Cryptography & Security', modules: [
             { name: 'SHA256_HASH', explanation: 'Computes a SHA-256 hash.', testFn: () => HAL.Primitives.SHA256_HASH('aura is self-aware') },
             // NEW
             { name: 'HUFFMAN_ENCODING_TREE', explanation: 'Generates Huffman codes.', testFn: () => HAL.Primitives.HUFFMAN_ENCODING_TREE({'a': 5, 'b': 9, 'c': 12, 'd': 13, 'e': 16, 'f': 45}) },
             { name: 'LZW_COMPRESSION', explanation: 'Compresses a string using LZW.', testFn: () => HAL.Primitives.LZW_COMPRESSION("TOBEORNOTTOBEORTOBEORNOT") },
             { name: 'SHANNON_FANO_CODING', explanation: 'Generates Shannon-Fano codes.', testFn: () => HAL.Primitives.SHANNON_FANO_CODING({'a': 5, 'b': 9, 'c': 12, 'd': 13, 'e': 16, 'f': 45}) },
             { name: 'HAMMING_DISTANCE', explanation: 'Calculates Hamming distance.', testFn: () => HAL.Primitives.HAMMING_DISTANCE("karolin", "kathrin") },
             { name: 'BLOOM_FILTER_ADD_CHECK', explanation: 'Simulates a Bloom filter check (stateful).', testFn: () => HAL.Primitives.BLOOM_FILTER_ADD_CHECK(Array(20).fill(0), 3, "test") },
        ]},
        // --- CATEGORY 10: Numerical & Scientific Simulation ---
        { name: 'Category 10: Numerical & Scientific Simulation', modules: [
            { name: 'RUNGE_KUTTA_4TH_ORDER_STEP', explanation: 'Performs one RK4 step for an ODE.', testFn: () => HAL.Primitives.RUNGE_KUTTA_4TH_ORDER_STEP((t: number, y: number) => t * Math.sqrt(y), 0, 1, 0.1) },
            { name: 'NEWTON_RAPHSON_ROOT_FINDING', explanation: "Finds the root of f(x) = x^2 - 2.", testFn: () => HAL.Primitives.NEWTON_RAPHSON_ROOT_FINDING((x: number) => x**2 - 2, (x: number) => 2*x, 1) },
            { name: 'SIMPSONS_RULE_INTEGRATION', explanation: "Integrates f(x) = x^2 from 0 to 1.", testFn: () => HAL.Primitives.SIMPSONS_RULE_INTEGRATION((x: number) => x**2, 0, 1) },
            { name: 'EULER_METHOD_STEP', explanation: 'Performs one Euler method step for an ODE.', testFn: () => HAL.Primitives.EULER_METHOD_STEP((t: number, y: number) => t * y, 0, 1, 0.1) },
            { name: 'KALMAN_FILTER_UPDATE', explanation: 'Performs a 1D Kalman Filter update step.', testFn: () => HAL.Primitives.KALMAN_FILTER_UPDATE(60, 10, 65, 4) },
            { name: 'LORENTZ_ATTRACTOR_STEP', explanation: 'Simulates one step of the Lorenz system.', testFn: () => HAL.Primitives.LORENTZ_ATTRACTOR_STEP(1,1,1,0.1) },
            { name: 'N_BODY_FORCE_CALCULATION', explanation: 'Calculates 2-body gravitational force.', testFn: () => HAL.Primitives.N_BODY_FORCE_CALCULATION(10,10,[0,0],[3,4]) },
            { name: 'FINITE_DIFFERENCE_METHOD_STEP', explanation: 'Solves 1D heat equation for one step.', testFn: () => HAL.Primitives.FINITE_DIFFERENCE_METHOD_STEP([0,50,100,50,0], 0.1) },
            { name: 'BLACK_SCHOLES_MODEL', explanation: 'Calculates a Black-Scholes option price.', testFn: () => HAL.Primitives.BLACK_SCHOLES_MODEL(100, 100, 1, 0.05, 0.2) },
            { name: 'SIMPLE_MOVING_AVERAGE', explanation: 'Calculates a 3-period SMA.', testFn: () => HAL.Primitives.SIMPLE_MOVING_AVERAGE([1,2,3,4,5,6], 3) },
            { name: 'EXPONENTIAL_SMOOTHING_UPDATE', explanation: 'Performs an exponential smoothing update.', testFn: () => HAL.Primitives.EXPONENTIAL_SMOOTHING_UPDATE(10, 12, 0.5) },
            // NEW
            { name: 'PERMUTATIONS_LEXICOGRAPHIC', explanation: 'Finds next lexicographic permutation.', testFn: () => HAL.Primitives.PERMUTATIONS_LEXICOGRAPHIC([0, 1, 2]) },
            { name: 'POWER_SET', explanation: 'Generates power set.', testFn: () => HAL.Primitives.POWER_SET([1, 2]) },
            { name: 'CARTESIAN_PRODUCT', explanation: 'Generates Cartesian product.', testFn: () => HAL.Primitives.CARTESIAN_PRODUCT([1, 2], ['a', 'b']) },
            { name: 'CATALAN_NUMBER', explanation: 'Calculates the 5th Catalan number.', testFn: () => HAL.Primitives.CATALAN_NUMBER(5) },
            { name: 'PARTITIONS_INTEGER', explanation: 'Calculates partitions of 5.', testFn: () => HAL.Primitives.PARTITIONS_INTEGER(5) },
            { name: 'VERLET_INTEGRATION', explanation: 'Performs Verlet integration step.', testFn: () => HAL.Primitives.VERLET_INTEGRATION(10, 9.8, -9.8, 0.1) },
            { name: 'FLUID_SPH_DENSITY', explanation: 'Calculates SPH density.', testFn: () => HAL.Primitives.FLUID_SPH_DENSITY(0, 2, 1) },
            { name: 'RIGID_BODY_COLLISION_2D', explanation: 'Calculates collision impulse.', testFn: () => HAL.Primitives.RIGID_BODY_COLLISION_2D(1, 1, [1,0], [-1,0], [1,0], 1) },
            { name: 'PERLIN_NOISE_2D', explanation: 'Generates noise value.', testFn: () => HAL.Primitives.PERLIN_NOISE_2D(10.5, 10.5) },
            { name: 'BARNES_HUT_FORCE', explanation: 'Approximates gravitational force.', testFn: () => HAL.Primitives.BARNES_HUT_FORCE(10, 100, [0,0], [10,0]) },
        ]},
        // --- CATEGORY 11: Robotics & Control Systems ---
        { name: 'Category 11: Robotics & Control Systems', modules: [
            { name: 'PID_CONTROLLER_UPDATE', explanation: 'Calculates the output of a PID controller.', testFn: () => HAL.Primitives.PID_CONTROLLER_UPDATE(5, 4, 10, 0.1, 0.5, 0.1, 0.2, 0) },
            { name: 'CONVEX_HULL_GRAHAM_SCAN', explanation: 'Finds the convex hull of a set of points.', testFn: () => HAL.Primitives.CONVEX_HULL_GRAHAM_SCAN([[0, 3], [2, 2], [1, 1], [2, 1], [3, 0], [0, 0], [3, 3]]) },
        ]},
        // --- CATEGORY 12: Bioinformatics & Genomics ---
        { name: 'Category 12: Bioinformatics & Genomics', modules: [
            { name: 'DNA_TO_RNA_TRANSCRIPTION', explanation: 'Transcribes DNA to RNA.', testFn: () => HAL.Primitives.DNA_TO_RNA_TRANSCRIPTION("GATTACA") },
            { name: 'RNA_TO_PROTEIN_TRANSLATION', explanation: 'Translates RNA to an amino acid sequence.', testFn: () => HAL.Primitives.RNA_TO_PROTEIN_TRANSLATION("AUGGCCAUGGCGCCCAGAACUGAGAUCAAUAGUACCCGUAUUAACGGGUGA") },
            { name: 'SEQUENCE_ALIGNMENT_DOT_PLOT', explanation: 'Generates a dot plot matrix for sequences.', testFn: () => HAL.Primitives.SEQUENCE_ALIGNMENT_DOT_PLOT("AGTC", "AGGC") },
            { name: 'OPEN_READING_FRAME_FIND', explanation: 'Finds open reading frames in DNA.', testFn: () => HAL.Primitives.OPEN_READING_FRAME_FIND("AGCCATGTAGCTAACTCAGGTTAC") },
            { name: 'GC_CONTENT_CALCULATION', explanation: 'Calculates GC content of a DNA sequence.', testFn: () => HAL.Primitives.GC_CONTENT_CALCULATION("AGCTGCGG") },
        ]},
        // --- CATEGORY 13: Geospatial Analysis ---
        { name: 'Category 13: Geospatial Analysis', modules: [
            { name: 'HAVERSINE_DISTANCE_CALCULATION', explanation: 'Calculates distance between two lat/lon points.', testFn: () => HAL.Primitives.HAVERSINE_DISTANCE_CALCULATION(48.8, 2.3, 40.7, -74.0) },
        ]},
        // --- CATEGORY 14: Symbolic AI & Logic ---
        { name: 'Category 14: Symbolic AI & Logic', modules: [
            { name: 'PROPOSITIONAL_LOGIC_SOLVER', explanation: 'Solves a simple propositional logic formula.', testFn: () => HAL.Primitives.PROPOSITIONAL_LOGIC_SOLVER('(true and (false or true))') },
        ]},
        // --- CATEGORY 15: Generative Methods ---
        { name: 'Category 15: Generative Methods', modules: [
            { name: 'L_SYSTEM_GRAMMAR_EXPANSION', explanation: 'Expands an L-system grammar string.', testFn: () => HAL.Primitives.L_SYSTEM_GRAMMAR_EXPANSION('A', {'A': 'AB', 'B': 'A'}) },
            { name: 'MARKOV_CHAIN_TEXT_GENERATION', explanation: 'Generates a word from a Markov model.', testFn: () => HAL.Primitives.MARKOV_CHAIN_TEXT_GENERATION('the', {'the': {'cat': 1}}) },
            { name: 'WORLEY_NOISE', explanation: 'Calculates 2D Worley noise.', testFn: () => HAL.Primitives.WORLEY_NOISE([0.5, 0.5], [[0.1,0.1],[0.8,0.8]]) },
            { name: 'MAZE_GENERATION_DFS', explanation: 'Generates a maze using DFS.', testFn: () => HAL.Primitives.MAZE_GENERATION_DFS(5, 5) },
            { name: 'DE_BRUIJN_SEQUENCE', explanation: 'Generates a de Bruijn sequence for k=2, n=3.', testFn: () => HAL.Primitives.DE_BRUIJN_SEQUENCE(2, 3) },
            { name: 'SOUND_SYNTHESIS_SINE_WAVE', explanation: 'Generates a sine wave sample.', testFn: () => HAL.Primitives.SOUND_SYNTHESIS_SINE_WAVE(440, 0.5, 44100) },
            { name: 'RANDOM_WALK', explanation: 'Performs a 2D random walk step.', testFn: () => HAL.Primitives.RANDOM_WALK([0,0]) },
        ]},
        // --- CATEGORY 16: Topology ---
        { name: 'Category 16: Topology', modules: [
            { name: 'EULER_CHARACTERISTIC', explanation: 'Calculates V-E+F for a cube.', testFn: () => HAL.Primitives.EULER_CHARACTERISTIC(8, 12, 6) },
            { name: 'GENUS_OF_SURFACE', explanation: 'Calculates the genus for a torus.', testFn: () => HAL.Primitives.GENUS_OF_SURFACE(16, 32, 16) },
        ]},
        // --- CATEGORY 17: Geometry ---
        { name: 'Category 17: Geometry', modules: [
            { name: 'VECTOR_CROSS_PRODUCT_3D', explanation: 'Calculates 3D vector cross product.', testFn: () => HAL.Primitives.VECTOR_CROSS_PRODUCT_3D([1,0,0], [0,1,0]) },
            { name: 'ROTATE_POINT_2D', explanation: 'Rotates a 2D point by 90 degrees.', testFn: () => HAL.Primitives.ROTATE_POINT_2D([1,0], Math.PI/2) },
            { name: 'TRIANGLE_CENTROID', explanation: 'Finds the centroid of a triangle.', testFn: () => HAL.Primitives.TRIANGLE_CENTROID([0,0],[3,0],[0,3]) },
            { name: 'DISTANCE_POINT_TO_LINE', explanation: 'Calculates distance from point to line.', testFn: () => HAL.Primitives.DISTANCE_POINT_TO_LINE([0,0], [1,1], [1, -1]) },
            { name: 'POLYGON_AREA_SHOELACE', explanation: 'Calculates polygon area.', testFn: () => HAL.Primitives.POLYGON_AREA_SHOELACE([[0,0],[2,0],[2,2],[0,2]]) },
            { name: 'POLYGON_CENTROID', explanation: 'Calculates the centroid of a polygon.', testFn: () => HAL.Primitives.POLYGON_CENTROID([[0,0],[2,0],[2,2],[0,2]]) },
            { name: 'LINE_INTERSECTION_2D', explanation: 'Finds the intersection of two lines.', testFn: () => HAL.Primitives.LINE_INTERSECTION_2D([0,0], [1,1], [0,1], [1,0]) },
        ]},
    ], [t]);

    const allModules = useMemo(() => categories.flatMap(cat => cat.modules), [categories]);

    const runBenchmark = useCallback(async () => {
        setIsBenchmarking(true);
        setBenchmarkStats(null);
        let totalOps = 0;
        let passCount = 0;
        const ITERATIONS = 1000;
        const startTime = performance.now();

        for (const module of allModules) {
            try {
                // Run once to verify
                await module.testFn();
                passCount++;
                // Run loop
                for(let i=0; i<ITERATIONS; i++) {
                    await module.testFn();
                }
                totalOps += ITERATIONS;
            } catch (e) {
                // Fail silently during benchmark
            }
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        setBenchmarkStats({
            totalOps,
            timeMs: duration,
            opsPerSec: (totalOps / (duration / 1000)),
            passRate: (passCount / allModules.length) * 100
        });

        setIsBenchmarking(false);
    }, [allModules]);

    const runAllTests = useCallback(async () => {
        setResults({}); // Clear previous results
        for (const module of allModules) {
            setResults(prev => ({ ...prev, [module.name]: { status: 'running' } }));
            await new Promise(resolve => setTimeout(resolve, 10)); // Allow UI to update
            try {
                const result = await module.testFn();
                setResults(prev => ({ ...prev, [module.name]: { status: 'success', result: JSON.stringify(result, null, 2) } }));
            } catch (e) {
                setResults(prev => ({ ...prev, [module.name]: { status: 'error', error: (e as Error).message } }));
            }
        }
    }, [allModules]);

    useEffect(() => {
        runAllTests();
    }, [runAllTests]);

    const summary = useMemo(() => {
        const total = allModules.length;
        const passed = Object.values(results).filter((r: TestResult) => r.status === 'success').length;
        const failed = Object.values(results).filter((r: TestResult) => r.status === 'error').length;
        const running = Object.values(results).filter((r: TestResult) => r.status === 'running').length;
        return { total, passed, failed, running };
    }, [results, allModules]);

    return (
        <div className="side-panel">
            <p className="reason-text">
                Running automated tests on all implemented hardware primitive modules.
            </p>

            <div className="synaptic-metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)', margin: '1rem 0' }}>
                <div className="metric-item"><span className="metric-label">Total</span><span className="metric-value">{summary.total}</span></div>
                <div className="metric-item"><span className="metric-label">Passed</span><span className="metric-value" style={{color: 'var(--success-color)'}}>{summary.passed}</span></div>
                <div className="metric-item"><span className="metric-label">Failed</span><span className="metric-value" style={{color: 'var(--failure-color)'}}>{summary.failed}</span></div>
                <div className="metric-item"><span className="metric-label">Running</span><span className="metric-value" style={{color: 'var(--warning-color)'}}>{summary.running}</span></div>
            </div>

             <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button className="control-button" onClick={runAllTests} disabled={summary.running > 0 || isBenchmarking}>
                    {summary.running > 0 ? 'Testing...' : 'Re-run All Tests'}
                </button>
                <button className="control-button" onClick={runBenchmark} disabled={summary.running > 0 || isBenchmarking}>
                    {isBenchmarking ? 'Benchmarking...' : 'Run Benchmark (1000x)'}
                </button>
            </div>
            
            {benchmarkStats && (
                <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)', marginBottom: '1rem' }}>
                    <div className="mod-log-header">
                        <span className="mod-log-type">Benchmark Report</span>
                        <span className="mod-log-status" style={{ color: 'var(--success-color)' }}>Complete</span>
                    </div>
                    <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '0.5rem', textAlign: 'left' }}>
                         <div className="metric-item"><span className="metric-label">Total Ops</span><span className="metric-value">{benchmarkStats.totalOps.toLocaleString()}</span></div>
                         <div className="metric-item"><span className="metric-label">Duration</span><span className="metric-value">{benchmarkStats.timeMs.toFixed(0)}ms</span></div>
                         <div className="metric-item"><span className="metric-label">Throughput</span><span className="metric-value" style={{color: 'var(--accent-color)'}}>{Math.floor(benchmarkStats.opsPerSec).toLocaleString()} ops/sec</span></div>
                         <div className="metric-item"><span className="metric-label">Pass Rate</span><span className="metric-value">{benchmarkStats.passRate.toFixed(1)}%</span></div>
                    </div>
                </div>
            )}

            {categories.map(category => (
                <Accordion key={category.name} title={`${category.name} (${category.modules.length})`} defaultOpen={false}>
                    {category.modules.map(module => (
                        <TestResultDisplay
                            key={module.name}
                            name={module.name}
                            explanation={module.explanation}
                            testResult={results[module.name] || { status: 'idle' }}
                        />
                    ))}
                </Accordion>
            ))}
        </div>
    );
};
