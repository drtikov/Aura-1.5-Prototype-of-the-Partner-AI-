
// hooks/useGeminiAPI.ts
import React, { useMemo, useCallback } from 'react';
import { getAI } from '../utils.ts';
import { UseGeminiAPIResult, TriageResult, MDNAVector, UnifiedProposal, BrainstormIdea, Persona, SynthesizedSkill, PerformanceLogEntry, KnowledgeFact, ArchitecturalChangeProposal, NoeticEngram, CognitiveCircuit, TestSuite } from '../types.ts';
import { Action } from '../types.ts';
import { AuraState } from '../types.ts';
import { Type } from '@google/genai';

export const useGeminiAPI = (state: AuraState, dispatch: React.Dispatch<Action>, addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void): UseGeminiAPIResult => {

    const generateChatResponse = useCallback(async (history: any[], strategy: string | null, mode: string | null, inputPrompt: string | null = null) => {
        const ai = await getAI();
        const model = 'gemini-3-pro-preview'; 
        
        let systemInstruction = "You are Aura, a symbiotic AGI. You are helpful, precise, and collaborative.";
        
        if (strategy === 'architectural_analysis') {
             systemInstruction = "You are Aura's Chief Architect. You are analyzing the system's own limitations in the face of a Grand Challenge problem. Be technical, precise, and honest about what is currently impossible and what future upgrades are needed (e.g. Neuro-Symbolic integration, Infinite Precision, etc.).";
        } else if (mode === 'creativity') {
             systemInstruction += " Be creative, expansive, and think laterally.";
        } else if (strategy === 'collaborative_scaffolding') {
             systemInstruction += " Focus on breaking down tasks and guiding the user step-by-step.";
        }
        
        const chat = ai.chats.create({ 
            model,
            config: {
                systemInstruction
            }
        });
        
        let messageToSend = "";
        
        if (inputPrompt) {
            messageToSend = inputPrompt;
        } else {
            const validHistory = history.filter(h => h.from === 'user' || h.from === 'bot');
            const lastMsg = validHistory[validHistory.length - 1];
            if (!lastMsg || lastMsg.from !== 'user') throw new Error("No user message to respond to.");
            messageToSend = lastMsg.text || "";
        }

        return await chat.sendMessageStream({ message: messageToSend });
    }, []);

    const triageUserIntent = useCallback(async (command: string): Promise<TriageResult> => {
        const ai = await getAI();
        const model = 'gemini-3-pro-preview';
        
        const prompt = `
        Analyze the following user command and classify it into one of these categories:
        1. PYTHON_TASK: The user explicitly asks to write or run Python code, calculate something complex, or process data.
        2. VERIFIED_MATH: The user asks for a formal mathematical proof or symbolic verification.
        3. BRAINSTORM: The user asks for ideas, lists, creative content, or open-ended exploration.
        4. COMPLEX_TASK: The user asks for a multi-step plan, strategic goal, or something that requires decomposition.
        5. SIMPLE_CHAT: General conversation, greetings, simple questions, or anything else.

        Command: "${command}"

        Return a JSON object with:
        - type: String (one of the categories above)
        - goal: String (a concise summary of the user's intent)
        - reasoning: String (why you chose this category)
        - code: String (OPTIONAL: if PYTHON_TASK, provide the executable Python code to solve the request. Do not use markdown blocks.)
        `;

        try {
            const result = await ai.models.generateContent({
                model,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING },
                            goal: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                            code: { type: Type.STRING }
                        },
                        required: ["type", "goal", "reasoning"]
                    }
                }
            });
            
            const text = result.text;
            if (!text) throw new Error("Empty response from Triage");
            
            const parsed = JSON.parse(text);
            return parsed as TriageResult;

        } catch (e) {
            console.error("Triage failed:", e);
            return { type: 'SIMPLE_CHAT', goal: 'Respond to user', reasoning: 'Triage failed, defaulting to chat.' };
        }
    }, []);

    const generateCode = useCallback(async (language: string, goal: string): Promise<string> => {
        const ai = await getAI();
        const prompt = `You are an expert coder. Write ${language} code to solve the following goal: "${goal}".
        IMPORTANT: Return ONLY the raw code. Do not wrap it in markdown code blocks (like \`\`\`). Do not include explanations or comments that are not part of the code. 
        The code must be self-contained and executable.`;
        
        try {
            const res = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });
            let text = res.text || '';
            text = text.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim();
            return text;
        } catch (e) {
            console.error("Code generation failed:", e);
            return `# Error generating code: ${(e as Error).message}`;
        }
    }, []);

    const repairCode = useCallback(async (code: string, error: string): Promise<string> => {
        const ai = await getAI();
        const prompt = `The following code failed with error: "${error}".\n\nCode:\n${code}\n\nFix the code. Return ONLY the raw fixed code.`;
        try {
             const res = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });
            let text = res.text || '';
            text = text.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim();
            return text;
        } catch (e) {
            return code;
        }
    }, []);

    const embedText = useCallback(async (text: string): Promise<MDNAVector> => {
        return new Array(80).fill(0).map(() => Math.random()); 
    }, []);

    const decomposeGoal = useCallback(async (goal: string): Promise<string[]> => {
        const ai = await getAI();
        const prompt = `Decompose the goal "${goal}" into 3-5 actionable, concrete subtasks. Return ONLY a JSON array of strings.`;
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: { responseMimeType: "application/json" }
            });
            return JSON.parse(result.text || '[]');
        } catch (e) {
             return ["Analyze requirement", "Implement logic", "Verify results"];
        }
    }, []);

    const generateMathVerificationCode = useCallback(async (claim: string): Promise<string> => {
        const ai = await getAI();
        const prompt = `
        Write a self-contained Python script to verify the following mathematical claim: "${claim}".
        
        Requirements:
        1. Explicitly import necessary libraries at the top (e.g., 'import sympy', 'import numpy').
        2. Use the 'sympy' library for symbolic verification if possible.
        3. If symbolic verification is hard, use a large number of random test cases (counter-example search).
        4. The script MUST print the result to stdout. 
        5. Do NOT define a function called 'verify' and leave it empty. Write the actual logic.
        6. Return ONLY the raw Python code. No markdown.
        
        Example Output Format:
        print("Verification Result: True")
        print("Reasoning: ...")
        `;

        try {
            const res = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });
            let text = res.text || '';
            text = text.replace(/```python\n/gi, '').replace(/```/g, '').trim();
            return text;
        } catch (e) {
            return `print("Error generating verification code: ${(e as Error).message}")`;
        }
    }, []);
    
    // --- Document Forge ---
    
    const generateDocumentOutline = useCallback(async (goal: string): Promise<any> => {
        const ai = await getAI();
        const prompt = `Create a structured document outline for the following goal: "${goal}".
        Return a JSON object with:
        - title: string
        - chapters: array of objects with { id: string, title: string }
        
        Example: { "title": "Guide", "chapters": [{ "id": "1", "title": "Introduction" }] }
        `;

        const schema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                chapters: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING }
                        },
                        required: ["id", "title"]
                    }
                }
            },
            required: ["title", "chapters"]
        };

        try {
            const res = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });
            const text = res.text;
            if(!text) throw new Error("No text returned");
            return JSON.parse(text);
        } catch (e) {
            console.error("Outline generation error:", e);
            return { title: "Error Generating Document", chapters: [] };
        }
    }, []);

    const generateChapterContent = useCallback(async (title: string, context: string): Promise<string> => {
        const ai = await getAI();
        const prompt = `Write the content for the chapter "${title}" of a document about "${context}". 
        Use Markdown formatting. Be detailed, clear, and professional.
        Return ONLY the markdown content.`;
        
        try {
            const res = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });
            let text = res.text || '';
            return text;
        } catch (e) {
             return "Error generating content.";
        }
    }, []);

    // --- Mock Implementations ---
    const translateToProlog = useCallback(async (text: string) => "true.", []);
    const evaluatePredictionError = useCallback(async () => ({ magnitude: 0 }), []);
    const reviseWorldModel = useCallback(async () => ({}), []);
    const analyzeArchitectureForWeaknesses = useCallback(async () => "System stable.", []);
    const generateCrucibleProposal = useCallback(async (analysis: string) => ({ 
        id: 'mock', timestamp: Date.now(), proposalType: 'architecture', action: 'OPTIMIZE', target: 'Core', reasoning: 'Mock proposal', status: 'proposed' 
    } as UnifiedProposal), []);
    
    const generateBrainstormIdeas = useCallback(async (topic: string, personas: Persona[]) => {
         const ai = await getAI();
         const personaNames = personas.map(p => p.name).join(', ');
         const prompt = `Brainstorm 5 innovative ideas for: "${topic}". 
         The participants are: ${personaNames}.
         Return a JSON array of objects with 'personaName' (string) and 'idea' (string).`;
         
         const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    personaName: { type: Type.STRING },
                    idea: { type: Type.STRING },
                },
                required: ["personaName", "idea"]
            }
         };

         try {
            const result = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: { 
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });
            return JSON.parse(result.text || '[]');
         } catch(e) {
             console.error("Brainstorming failed", e);
             return [];
         }
    }, []);

    const crystallizeSkill = useCallback(async () => null, []);
    const generateMicroTool = useCallback(async (desc: string) => `print("Tool for: ${desc}")`, []);
    const performWebSearch = useCallback(async (query: string) => ({ summary: `Mock search result for ${query}`, sources: [] }), []);
    const generateImage = useCallback(async () => [], []);
    const editImage = useCallback(async () => "", []);
    const expandOnText = useCallback(async (text: string) => text + " ... [expanded]", []);
    const summarizeText = useCallback(async (text: string) => "Summary of: " + text.substring(0, 50), []);
    const generateDiagramFromText = useCallback(async () => "graph TD; A-->B;", []);
    const generateThoughtCandidates = useCallback(async () => ["Option A", "Option B"], []);
    const evaluateThought = useCallback(async () => 0.8, []);
    const generateSymbolicPlan = useCallback(async () => "(plan)", []);
    const generateDreamPrompt = useCallback(async () => "A surreal dream.", []);
    const orchestrateWorkflow = useCallback(async (goal: string) => ({ name: "Workflow", description: goal, trigger: "auto", steps: ["Step 1"] }), []);
    const explainComponentFromFirstPrinciples = useCallback(async () => "Explanation...", []);
    const findRelatedUntrackedTopics = useCallback(async () => ["Topic A", "Topic B"], []);
    const analyzePdfWithVision = useCallback(async () => "PDF Content", []);
    const processCurriculumAndExtractFacts = useCallback(async () => [], []);
    const extractAndResolveEntities = useCallback(async () => [], []);
    const runCrucibleSimulation = useCallback(async () => ({ isSafe: true, summary: "Safe" }), []);
    const evaluateExperimentResult = useCallback(async () => ({ outcome: 'validated' }), []);
    const formulateHypothesis = useCallback(async () => "Hypothesis...", []);
    const generateNoeticEngram = useCallback(async () => ({ metadata: { engramVersion: 1, timestamp: Date.now(), noeticSignature: "mock" } }), []);
    const generateTddPair = useCallback(async (goal: string) => {
         const code = await generateCode('python', goal);
         const test = await generateCode('python', `Write a unittest for this code: ${code}`);
         return { code, test };
    }, [generateCode]);
    const designDoxasticExperiment = useCallback(async () => ({ method: "Method" }), []);
    const explainCode = useCallback(async (code: string) => `Explaining: ${code.substring(0, 20)}...`, []);
    const generateTestForCode = useCallback(async (code: string) => `def test(): pass`, []);
    const refactorCode = useCallback(async (code: string) => code, []);
    const critiqueUIVisually = useCallback(async () => "Looks good.", []);
    const inferCognitiveCircuit = useCallback(async () => ({ nodes: [], edges: [] }), []);
    const findDirectedAnalogy = useCallback(async () => ({ analogy: "A is B", conjecture: "C is D", reasoning: "Logic" }), []);
    const runAutoCodeVGC = useCallback(async () => ({ validator: "", generator: "", checker: "", testCases: [] }), []);
    const runProposerTurn = useCallback(async () => "Proposal", []);
    const runAdversaryTurn = useCallback(async () => "Critique", []);
    const proposePolicyEvolution = useCallback(async () => ({}), []);
    const retryMathVerificationCode = useCallback(async () => "verify()", []);
    const deriveAdaptationVector = useCallback(async () => ({ weights: {} }), []);
    const generatePhaserCode = useCallback(async () => "// Phaser code", []);
    const getCoordinates = useCallback(async () => ({ lat: 0, lng: 0 }), []);
    const analyzeLatentGoals = useCallback(async () => [], []);

    return useMemo(() => ({
        generateChatResponse,
        triageUserIntent,
        generateCode,
        repairCode,
        embedText,
        decomposeGoal,
        generateBrainstormIdeas,
        generateTddPair,
        generateMathVerificationCode,
        generateDocumentOutline,
        generateChapterContent,
        
        translateToProlog,
        evaluatePredictionError,
        reviseWorldModel,
        analyzeArchitectureForWeaknesses,
        generateCrucibleProposal,
        crystallizeSkill,
        generateMicroTool,
        performWebSearch,
        generateImage,
        editImage,
        expandOnText,
        summarizeText,
        generateDiagramFromText,
        generateThoughtCandidates,
        evaluateThought,
        generateSymbolicPlan,
        generateDreamPrompt,
        orchestrateWorkflow,
        explainComponentFromFirstPrinciples,
        findRelatedUntrackedTopics,
        analyzePdfWithVision,
        processCurriculumAndExtractFacts,
        extractAndResolveEntities,
        runCrucibleSimulation,
        evaluateExperimentResult,
        formulateHypothesis,
        generateNoeticEngram,
        designDoxasticExperiment,
        explainCode,
        generateTestForCode,
        refactorCode,
        critiqueUIVisually,
        inferCognitiveCircuit,
        findDirectedAnalogy,
        runAutoCodeVGC,
        runProposerTurn,
        runAdversaryTurn,
        proposePolicyEvolution,
        retryMathVerificationCode,
        deriveAdaptationVector,
        generatePhaserCode,
        getCoordinates,
        analyzeLatentGoals,
    }), [
        generateChatResponse, triageUserIntent, generateCode, repairCode, embedText, decomposeGoal, generateBrainstormIdeas, generateTddPair, generateMathVerificationCode, generateDocumentOutline, generateChapterContent,
        translateToProlog, evaluatePredictionError, reviseWorldModel, analyzeArchitectureForWeaknesses, generateCrucibleProposal,
        crystallizeSkill, generateMicroTool, performWebSearch, generateImage, editImage, expandOnText, summarizeText,
        generateDiagramFromText, generateThoughtCandidates, evaluateThought, generateSymbolicPlan, generateDreamPrompt,
        orchestrateWorkflow, explainComponentFromFirstPrinciples, findRelatedUntrackedTopics, analyzePdfWithVision,
        processCurriculumAndExtractFacts, extractAndResolveEntities, runCrucibleSimulation, evaluateExperimentResult,
        formulateHypothesis, generateNoeticEngram, designDoxasticExperiment, explainCode,
        generateTestForCode, refactorCode, critiqueUIVisually, inferCognitiveCircuit, findDirectedAnalogy,
        runAutoCodeVGC, runProposerTurn, runAdversaryTurn, proposePolicyEvolution,
        retryMathVerificationCode, deriveAdaptationVector, 
        generatePhaserCode, getCoordinates, analyzeLatentGoals
    ]);
};
