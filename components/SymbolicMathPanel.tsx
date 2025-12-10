// components/SymbolicMathPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

type MathAction = 'simplify' | 'solve' | 'differentiate' | 'prove';

export const SymbolicMathPanel = React.memo(() => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [action, setAction] = useState<MathAction>('simplify');
    const [expression, setExpression] = useState('x^2 + 2*x + 1');
    const [expressionB, setExpressionB] = useState('(x+1)^2');
    const [variable, setVariable] = useState('x');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleExecute = () => {
        if (!expression.trim()) {
            addToast('Expression is required.', 'warning');
            return;
        }
        if (action === 'prove' && !expressionB.trim()) {
            addToast('Expression B is required for proof.', 'warning');
            return;
        }

        setIsProcessing(true);
        const args = action === 'prove'
            ? { command: 'prove_equivalence', exprA: expression, exprB: expressionB }
            : { command: action, expression, variable };

        syscall('EXECUTE_TOOL', {
            toolName: 'symbolic_math',
            args: args
        });

        addToast(`Symbolic math command '${action}' dispatched.`, 'info');
        // The result will appear in the chat log. We'll just stop the spinner here.
        setTimeout(() => setIsProcessing(false), 2000);
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('mathTools_description')}</p>
            
            <div className="media-gen-mode-tabs" style={{ marginBottom: '1rem' }}>
                <button className={action === 'simplify' ? 'active' : ''} onClick={() => setAction('simplify')}>Simplify</button>
                <button className={action === 'solve' ? 'active' : ''} onClick={() => setAction('solve')}>Solve</button>
                <button className={action === 'differentiate' ? 'active' : ''} onClick={() => setAction('differentiate')}>Differentiate</button>
                <button className={action === 'prove' ? 'active' : ''} onClick={() => setAction('prove')}>Prove</button>
            </div>

            {action === 'prove' ? (
                 <>
                    <div className="image-gen-control-group">
                        <label htmlFor="math-expression-a">{t('symbolic_math_expr_a')}</label>
                        <input id="math-expression-a" type="text" value={expression} onChange={(e) => setExpression(e.target.value)} disabled={isProcessing} className="vfs-path-input" />
                    </div>
                     <div className="image-gen-control-group">
                        <label htmlFor="math-expression-b">{t('symbolic_math_expr_b')}</label>
                        <input id="math-expression-b" type="text" value={expressionB} onChange={(e) => setExpressionB(e.target.value)} disabled={isProcessing} className="vfs-path-input" />
                    </div>
                </>
            ) : (
                <>
                    <div className="image-gen-control-group">
                        <label htmlFor="math-expression">{t('mathTools_expression')}</label>
                        <input id="math-expression" type="text" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder={t('mathTools_expression_placeholder')} className="vfs-path-input" disabled={isProcessing} />
                    </div>
                    {(action === 'solve' || action === 'differentiate') && (
                        <div className="image-gen-control-group">
                            <label htmlFor="math-variable">{t('mathTools_variable')}</label>
                            <input id="math-variable" type="text" value={variable} onChange={(e) => setVariable(e.target.value)} placeholder={t('mathTools_variable_placeholder')} className="vfs-path-input" disabled={isProcessing} />
                        </div>
                    )}
                </>
            )}

            <button className="control-button" onClick={handleExecute} disabled={isProcessing} style={{ marginTop: '1rem', width: '100%' }}>
                {isProcessing ? 'Processing...' : 'Execute'}
            </button>
            <p className="reason-text" style={{fontSize: '0.8rem', marginTop: '1rem'}}>
                {t('mathTools_results_note')}
            </p>
        </div>
    );
});