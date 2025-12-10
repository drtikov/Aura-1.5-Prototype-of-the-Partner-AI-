
// hooks/useToolExecution.ts
import { useEffect } from 'react';
import { HAL } from '../core/hal';
import { ToolExecutionRequest, SyscallCall, AuraState, UseGeminiAPIResult, TscError, ProofResult } from '../types';

export interface UseToolExecutionProps {
    syscall: (call: SyscallCall, args: any) => void;
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    toolExecutionRequest: ToolExecutionRequest | null;
    state: AuraState;
    geminiAPI: UseGeminiAPIResult;
}

export const useToolExecution = ({
    syscall,
    addToast,
    toolExecutionRequest,
    state,
    geminiAPI,
}: UseToolExecutionProps) => {
    useEffect(() => {
        if (!toolExecutionRequest) {
            return;
        }

        const execute = async () => {
            const { id, toolName, args } = toolExecutionRequest;
            try {
                let result: any;

                switch (toolName) {
                    // HAL Math/Logic Tools
                    case 'calculate':
                        result = await HAL.MathJS.execute('simplify', args.expression);
                        break;
                    case 'symbolic_math':
                        result = await HAL.MathJS.execute(args.command, args.expression, args.variable);
                        break;
                    case 'numerical_computation':
                        result = await HAL.NumericJS.matrixMultiply(args.matrixA, args.matrixB);
                        break;
                    case 'formal_proof_assistant':
                        result = await HAL.Lean.prove(args.statement_to_prove, args.proof_steps || [], args.action);
                        break;

                    // HAL Code Tools
                    case 'typescript_check_types':
                        // FIX: Pass the entire VFS tree (DirectoryNode) to the HAL tool.
                        const vfs = state.selfProgrammingState.virtualFileSystem;
                        const filePath = args.filePath;
                        // We don't check existence here because the HAL tool handles resolution and flattening.
                        result = await HAL.Tools.typescript_check_types(vfs, [filePath]);
                        break;
                    
                    // HAL Geometry Tools
                    case 'geometry_boolean_op':
                        result = await HAL.Geometry.runBooleanOp(args.polygonA, args.polygonB, args.operation);
                        break;
                    case 'mesh_analysis':
                        result = await HAL.Geometry.runMeshAnalysis(args.meshType, args.parameters);
                        break;
                    
                    // Gemini Delegated Tools
                    case 'math_knowledge_retrieval':
                         const searchResult = await geminiAPI.performWebSearch(`${args.topic}: ${args.keywords.join(' ')}`);
                         result = searchResult;
                         break;
                    
                    default:
                        // Check if it's a Host Bridge tool
                        if (toolName in HAL.Host) {
                            const hostArgs = args.command ? [args.command, args.commandArgs] : [args.filePath, args.content];
                            result = await (HAL.Host as any)[toolName](...hostArgs);
                        } else {
                            throw new Error(`Tool not found or not implemented in HAL/useToolExecution: ${toolName}`);
                        }
                }
                
                // Add result to history
                syscall('ADD_HISTORY_ENTRY', {
                    from: 'tool',
                    toolName: toolName,
                    args,
                    toolResult: { toolName, result }
                });

            } catch (e) {
                const errorMessage = `Tool execution failed for ${toolName}: ${(e as Error).message}`;
                addToast(errorMessage, 'error');
                syscall('ADD_HISTORY_ENTRY', {
                    from: 'system',
                    text: `[TOOL ERROR] ${errorMessage}`
                });
            } finally {
                syscall('CLEAR_TOOL_EXECUTION_REQUEST', {});
            }
        };

        execute();

    }, [toolExecutionRequest, syscall, addToast, state, geminiAPI]);
};
