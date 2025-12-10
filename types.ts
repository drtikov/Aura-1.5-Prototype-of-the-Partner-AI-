
import React from 'react';
import { Type } from '@google/genai';

// --- Enums ---
export enum GunaState {
    SATTVA = 'Sattva',
    RAJAS = 'Rajas',
    TAMAS = 'Tamas',
    DHARMA = 'Dharma',
    'GUNA-TEETA' = 'Guna-Teeta'
}

export enum CoprocessorArchitecture {
    TRIUNE = 'triune',
    REFLEX_ARC = 'reflex_arc',
    EVENT_STREAM = 'event_stream',
    TEMPORAL_ENGINE = 'temporal_engine',
    SYMBIOTIC_ECOSYSTEM = 'symbiotic_ecosystem',
    SENSORY_INTEGRATION = 'sensory_integration',
    SUBSUMPTION_RELAY = 'subsumption_relay'
}

export enum KernelTaskType {
    EVALUATE_PREDICTION_ERROR = 'evaluate_prediction_error',
    EXECUTE_CRYSTALLIZED_SKILL = 'execute_crystallized_skill',
    EXECUTE_POLYGLOT_CODE = 'execute_polyglot_code',
    VERIFY_AND_EXECUTE_MATH = 'verify_and_execute_math',
    RUN_SYMBOLIC_SOLVER = 'run_symbolic_solver',
    RUN_VISION_ANALYSIS = 'run_vision_analysis',
    DECOMPOSE_STRATEGIC_GOAL = 'decompose_strategic_goal',
    RUN_MATHEMATICAL_PROOF = 'run_mathematical_proof',
    RUN_BRAINSTORM_SESSION = 'run_brainstorm_session',
    GENERATE_CHAT_RESPONSE = 'generate_chat_response',
    RUN_HEURISTIC_SEARCHERS = 'run_heuristic_searchers',
    AUTONOMOUS_EVOLUTION_PULSE = 'autonomous_evolution_pulse',
    MYCELIAL_PULSE = 'mycelial_pulse',
    SEMANTIC_WEAVER_PULSE = 'semantic_weaver_pulse',
    CONCEPTUAL_ENTANGLEMENT_PULSE = 'conceptual_entanglement_pulse',
    SCIENTIFIC_METHOD_PULSE = 'scientific_method_pulse',
    QUALIA_TOPOLOGY_PULSE = 'qualia_topology_pulse',
    RUN_PATTERN_ANALYSIS = 'run_pattern_analysis',
    PROOF_ORCHESTRATION_PULSE = 'proof_orchestration_pulse',
    CONTEXT_COMPACTION_PULSE = 'context_compaction_pulse',
    RUN_HEURISTIC_COPROCESSORS = 'run_heuristic_coprocessors',
    CHRONICLE_MEMORY_PULSE = 'chronicle_memory_pulse',
    RUN_DOCUMENT_FORGE = 'run_document_forge',
    RUN_COLLABORATIVE_SESSION = 'run_collaborative_session',
    RUN_DEDUCTION_ANALYSIS = 'run_deduction_analysis',
    HOVA_OPTIMIZATION_CYCLE = 'hova_optimization_cycle',
    RUN_MARKET_ANALYSIS = 'run_market_analysis',
    TRANSLATE_TO_LOGIC = 'translate_to_logic',
    RUN_MONTE_CARLO_SEARCH = 'run_monte_carlo_search',
    RUN_RECURSIVE_CONSENSUS = 'run_recursive_consensus'
}

export enum GoalType {
    STRATEGIC = 'STRATEGIC',
    TACTICAL = 'TACTICAL',
    RESEARCH = 'RESEARCH',
    MATHEMATICAL_PROOF = 'MATHEMATICAL_PROOF'
}

export enum GameAction {
    CONCEPTUAL_SYNTHESIS = 'CONCEPTUAL_SYNTHESIS',
    FAST_TRACK_AUDIT = 'FAST_TRACK_AUDIT',
    SYMBIOTIC_ANALYSIS = 'SYMBIOTIC_ANALYSIS',
    PROACTIVE_INQUIRY = 'PROACTIVE_INQUIRY',
    CONCEPTUAL_PROBING = 'CONCEPTUAL_PROBING',
    SENTIMENT_ANALYSIS_REVIEW = 'SENTIMENT_ANALYSIS_REVIEW'
}

// --- Basic Types ---
export type CognitiveMode = 'fantasy' | 'creativity' | 'dream' | 'meditate' | 'gaze' | 'timefocus' | null;
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

export type MDNAVector = number[];

// --- System Types ---
export type SyscallCall = 
    | 'ADD_HISTORY_ENTRY' | 'PROCESS_COMMAND' | 'CLEAR_COMMAND_TO_PROCESS' | 'UPDATE_HISTORY_FEEDBACK' | 'USER_MODEL/LOG_TASK_SUCCESS'
    | 'ETHICAL_GOVERNOR/LEARN_FROM_FEEDBACK' | 'VFS/UPDATE_TREE' | 'VFS/ADD_PATH' | 'VFS/DELETE_PATH' | 'VFS/CLEAR_WRITE_REQUEST'
    | 'SYSTEM/REBOOT' | 'SYSTEM/CLEAR_API_KEY_INVALIDATED' | 'DELETE_FACT' | 'CLEAR_WORKING_MEMORY' | 'PROCESS_USER_INPUT_INTO_PERCEPT'
    | 'KERNEL/QUEUE_TASK' | 'KERNEL/SET_RUNNING_TASK' | 'SET_THEME' | 'SET_LANGUAGE' | 'EXECUTE_TOOL' | 'CLEAR_TOOL_EXECUTION_REQUEST'
    | 'SET_COGNITIVE_MODE' | 'SET_TELOS' | 'ADD_WORKFLOW_PROPOSAL' | 'UPDATE_NOETIC_ENGRAM_STATE' | 'SET_PSYCHEDELIC_STATE'
    | 'SET_SATORI_STATE' | 'SYNTHESIZE_ABSTRACT_CONCEPT' | 'SANDBOX/START_SPRINT' | 'WISDOM/START_INGESTION' | 'WISDOM/PROCESS_AXIOM'
    | 'ADD_FACT' | 'WISDOM/RESET' | 'APPLY_ARCH_PROPOSAL' | 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE' | 'PLUGIN/ADD_PLUGIN'
    | 'OA/UPDATE_PROPOSAL' | 'UPDATE_SUGGESTION_STATUS' | 'SOMATIC/LOG_SIMULATION' | 'DOXASTIC/UPDATE_HYPOTHESIS_STATUS'
    | 'DOXASTIC/UPDATE_EXPERIMENT_STATUS' | 'PSYCHE/ADAPT_PRIMITIVE' | 'METIS/SET_STATE' | 'TELOS/START_OPTIMIZATION' | 'TOGGLE_IDLE_THOUGHT'
    | 'DIALECTIC/START' | 'PLUGIN/HYDRATE_KNOWLEDGE' | 'CRYSTALLIZE_SKILL' | 'VFS/SET_PATHS' | 'EXECUTE_CRYSTALLIZED_SKILL'
    | 'CRYSTALLIZER/DELETE_SKILL' | 'INGEST_CODE_CHANGE' | 'TOGGLE_COGNITIVE_FORGE_PAUSE' | 'ADD_SIMULATION_LOG'
    | 'COGNITIVE_FORGE/ANALYZE_PERFORMANCE_LOGS' | 'REJECT_SELF_PROGRAMMING_CANDIDATE' | 'OA/ADD_PROPOSAL'
    | 'HEURISTICS_FORGE/ADD_HEURISTIC' | 'SYNAPTIC_MATRIX/UPDATE_METRICS' | 'SYNAPTIC_MATRIX/SET_ADAPTING' | 'SYNAPTIC_MATRIX/SET_ACTIVE_CONCEPT'
    | 'SYNAPTIC_MATRIX/ADD_INTUITIVE_ALERT' | 'SYNAPTIC_MATRIX/LOG_PROBE' | 'VFS/WRITE_FILE_REQUEST' | 'SET_COPROCESSOR_ARCHITECTURE'
    | 'SET_COPROCESSOR_ARCHITECTURE_MODE' | 'NEURAL_ACCELERATOR/LOG_ACTIVITY' | 'COGNITIVE/SET_STRATEGY' | 'WORLD_MODEL/UPDATE_PREDICTIONS'
    | 'WORLD_MODEL/UPDATE_SURPRISE' | 'WORLD_MODEL/RECALIBRATE' | 'EXECUTE_UI_HANDLER' | 'CLEAR_UI_COMMAND_REQUEST' | 'CLEAR_COGNITIVE_MODE'
    | 'SET_INTERNAL_STATUS' | 'UPDATE_INTERNAL_STATE' | 'ADD_INTERNAL_STATE_HISTORY' | 'UPDATE_USER_MODEL' | 'UPDATE_PERSONALITY_PORTRAIT'
    | 'QUEUE_EMPATHY_AFFIRMATION' | 'UPDATE_RIE_STATE' | 'RIE/TRIGGER_ADAPTATION_ANALYSIS' | 'RIE/COMPLETE_ADAPTATION_ANALYSIS' | 'ADD_RIE_INSIGHT'
    | 'ADD_LIMITATION' | 'ADD_CAUSAL_LINK' | 'ADD_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWNS_BATCH' | 'UPDATE_NARRATIVE_SUMMARY'
    | 'TELOS/ADD_CANDIDATE' | 'TELOS/REMOVE_CANDIDATE' | 'TELOS/ADOPT_CANDIDATE' | 'TELOS/DECOMPOSE_AND_SET_TREE' | 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL'
    | 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL' | 'INDUCE_PSIONIC_STATE' | 'AFFECTIVE/SET_BIAS' | 'INCREMENT_MANTRA_REPETITION' | 'UPDATE_PERSONALITY_STATE'
    | 'ADD_GANKYIL_INSIGHT' | 'PROCESS_GANKYIL_INSIGHT' | 'MULTIVERSE/SET_BRANCHES' | 'MULTIVERSE/LOG_PRUNING' | 'MULTIVERSE/CREATE_BRANCH'
    | 'SELF_ADAPTATION/SET_ACTIVE' | 'SITUATIONAL_AWARENESS/UPDATE_FIELD' | 'SITUATIONAL_AWARENESS/LOG_DOM_CHANGE' | 'MODAL/OPEN' | 'MODAL/CLOSE' | 'CLEAR_MODAL_REQUEST'
    | 'SHOW_PROACTIVE_UI' | 'HIDE_PROACTIVE_UI' | 'REFINEMENT/START' | 'REFINEMENT/SET_DRAFT' | 'REFINEMENT/ADD_CRITIQUE_AND_REFINE' | 'REFINEMENT/FINALIZE'
    | 'REFINEMENT/RESET' | 'SYMBIO/UPDATE_LATENT_GOALS' | 'SET_PROACTIVE_CACHE' | 'CLEAR_PROACTIVE_CACHE' | 'ETHICAL_GOVERNOR/ADD_PRINCIPLE' | 'ETHICAL_GOVERNOR/ADD_VETO_LOG'
    | 'HISTORY/CLEAR_PREVIOUS_BRAINSTORMS' | 'UPDATE_HISTORY_ENTRY' | 'APPEND_TO_HISTORY_ENTRY' | 'FINALIZE_HISTORY_ENTRY' | 'ADD_PERFORMANCE_LOG'
    | 'ADD_COMMAND_LOG' | 'HISTORY/MARK_SALIENCE_PROCESSED' | 'HISTORY/MARK_ENTITY_PROCESSED' | 'LOG/MARK_MYCELIAL_TRAINED' | 'LOG_COGNITIVE_REGULATION'
    | 'UPDATE_REGULATION_LOG_OUTCOME' | 'LOG_QUALIA' | 'MARK_LOG_CAUSAL_ANALYSIS' | 'ADD_EVENT_BUS_MESSAGE' | 'LOG_SUBSUMPTION_EVENT' | 'LOG/MARK_METAPHOR_PROCESSED'
    | 'LOG/MARK_REINFORCEMENT_PROCESSED' | 'LOG/MARK_BRIDGE_PROCESSED' | 'LOG/ADD_POL_EXECUTION' | 'LOGS/CLEAR' | 'MEMORY/ECAN_TICK' | 'HOMEOSTASIS/REGULATE'
    | 'MEMORY/SYNAPTIC_PROBE' | 'MEMORY/REINFORCE' | 'MEMORY/DECAY' | 'CHRONICLE/UPDATE' | 'MEMORY/INITIALIZE_MDNA_SPACE' | 'MEMORY/ADD_CONCEPT_VECTOR' | 'MEMORY/HEBBIAN_LEARN'
    | 'ADD_FACTS_BATCH' | 'ADD_TO_WORKING_MEMORY' | 'REMOVE_FROM_WORKING_MEMORY' | 'ADD_EPISODE' | 'MEMORY/STRENGTHEN_HYPHA_CONNECTION' | 'MEMORY/ADD_CRYSTALLIZED_FACT'
    | 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL' | 'MEMORY/PRUNE_EPISODES' | 'MEMORY/MARK_EPISODE_PROCESSED' | 'MEMORY/UPDATE_EMBEDDING' | 'PLANNING/CLEAR_ACTIVE_GOAL'
    | 'BUILD_GUILD_TASK_TREE' | 'BUILD_GOAL_TREE' | 'BUILD_PROOF_TREE' | 'UPDATE_GOAL_STATUS' | 'UPDATE_GOAL_RESULT' | 'ADD_SUBGOAL' | 'DELETE_GOAL' | 'UPDATE_GOAL_OUTCOME'
    | 'SYSTEM/ADD_META_LINK' | 'SYSTEM/UPDATE_RESOURCE_MONITOR' | 'VFS/SET_PATHS' | 'METAPHOR/ADD' | 'METAPHOR/UPDATE' | 'METIS/SET_STATE' | 'WISDOM/START_INGESTION'
    | 'WISDOM/SET_PROPOSED_AXIOMS' | 'WISDOM/ADD_PROPOSED_AXIOMS' | 'WISDOM/PROCESS_AXIOM' | 'WISDOM/SET_ERROR' | 'WISDOM/RESET' | 'AUTOCODE/SET_STATE'
    | 'AXIOM_GUARDIAN/LOG_INCONSISTENCY' | 'CRUCIBLE/ADD_AXIOM_FROM_PROOF' | 'CRUCIBLE/START_CYCLE' | 'CRUCIBLE/START_GRAND_UNIFICATION_CYCLE' | 'CRUCIBLE/ADD_LOG'
    | 'CRUCIBLE/PROPOSE_AXIOM' | 'CRUCIBLE/CYCLE_COMPLETE' | 'SELECT_ACTION_PLAN' | 'CLEAR_PLANNING_STATE' | 'BENNETT/SET_STATE' | 'BENNETT/LOG'
    | 'BRAINSTORM/RESET' | 'BRAINSTORM/START' | 'BRAINSTORM/SET_STATUS' | 'BRAINSTORM/ADD_IDEA' | 'BRAINSTORM/SET_WINNER' | 'BRAINSTORM/FINALIZE'
    | 'CANVAS/SET_CONTENT' | 'CANVAS/APPEND_CONTENT' | 'START_CEREBELLUM_MONITORING' | 'UPDATE_CEREBELLUM_STEP' | 'LOG_CEREBELLUM_DRIFT' | 'STOP_CEREBELLUM_MONITORING'
    | 'ADD_SYNTHESIZED_SKILL' | 'MANUAL_REINFORCE_SKILL' | 'LOG_COGNITIVE_TRIAGE_DECISION' | 'DOXASTIC/ADD_UNVERIFIED_HYPOTHESIS' | 'DOXASTIC/ADD_HYPOTHESIS'
    | 'DOXASTIC/DESIGN_EXPERIMENT' | 'DOXASTIC/UPDATE_HYPOTHESIS_STATUS' | 'DOXASTIC/UPDATE_EXPERIMENT_STATUS' | 'DOXASTIC/START_SIMULATION' | 'DOXASTIC/LOG_SIMULATION_STEP'
    | 'DOXASTIC/COMPLETE_SIMULATION' | 'DOXASTIC/FAIL_SIMULATION' | 'TEST_CAUSAL_HYPOTHESIS' | 'ERIS/SET_ACTIVE' | 'ERIS/SET_CHAOS_LEVEL' | 'ERIS/SET_MODE'
    | 'ERIS/LOG_INTERVENTION' | 'HARMONIC_ENGINE/SET_STATE' | 'HEURISTIC_COPROCESSOR/LOG_ACTIVATION' | 'PROCESS_USER_INPUT_INTO_PERCEPT' | 'OCKHAM/SET_STATE' | 'OCKHAM/LOG'
    | 'SCIENTIST/SET_STATE' | 'SCIENTIST/LOG' | 'SYMCODER/SET_ACTIVE_FILE' | 'SYMCODER/SET_ANALYSIS_RESULT' | 'SYMCODER/SET_TEST_RESULT' | 'SYNAPTIC_MATRIX/UPDATE_METRICS'
    | 'DAEDALUS/SET_STATE' | 'DAEDALUS/SET_GRAPH' | 'SESSION/START' | 'SESSION/UPDATE' | 'SESSION/UPDATE_SUBTASK_STATUS' | 'SESSION/POST_MESSAGE'
    | 'SESSION/ADD_ARTIFACT' | 'SESSION/END' | 'SESSION/CLOSE' | 'PROMETHEUS/START_AUTONOMOUS_CYCLE' | 'PROMETHEUS/START_GUIDED_INQUIRY' | 'PROMETHEUS/SET_SESSION_ID'
    | 'PROMETHEUS/LOG' | 'PROMETHEUS/CYCLE_COMPLETE' | 'PROMETHEUS/SET_STATE' | 'MONTE_CARLO/RESET' | 'MONTE_CARLO/INIT_TREE' | 'MONTE_CARLO/ADD_NODE' | 'MONTE_CARLO/UPDATE_NODE'
    | 'MONTE_CARLO/SET_STATUS' | 'MONTE_CARLO/SET_BEST_PATH' | 'LOGIC/UPDATE_STATE' | 'SURROGATE/UPDATE_STATE' | 'SURROGATE/SET_CIRCUIT' | 'CONSENSUS/START'
    | 'CONSENSUS/ADD_TURN' | 'CONSENSUS/UPDATE' | 'CONSENSUS/SET_STATUS' | 'CONSENSUS/RESET' | 'DOCUMENT_FORGE/START_PROJECT' | 'DOCUMENT_FORGE/SET_STATUS'
    | 'DOCUMENT_FORGE/SET_OUTLINE' | 'DOCUMENT_FORGE/UPDATE_CHAPTER' | 'DOCUMENT_FORGE/UPDATE_DIAGRAM' | 'DOCUMENT_FORGE/FINALIZE_PROJECT' | 'DOCUMENT_FORGE/RESET'
    | 'SCIENTIST/UPDATE_STATE' | 'PERSONA/ADD_JOURNAL_ENTRY' | 'PERSONA/UPDATE_INSTRUCTION' | 'FORGE/LOAD_BASE_SYSTEM' | 'FORGE/APPLY_MUTATION' | 'FORGE/SET_SURVEYOR_RESULTS'
    | 'FORGE/UPDATE_LANGLANDS_CANDIDATES' | 'RICCI_FLOW/LOG_SURGERY' | 'INTROSPECTION/LOG_EVENT' | 'HOVA/SET_TARGET' | 'HOVA/START_CYCLE' | 'HOVA/LOG_EVOLUTION'
    | 'KERNEL/TICK' | 'KERNEL/QUEUE_TASK' | 'KERNEL/SET_RUNNING_TASK' | 'KERNEL/LOG_SYSCALL' | 'KERNEL/BEGIN_SANDBOX_TEST' | 'KERNEL/CONCLUDE_SANDBOX_TEST' | 'KERNEL/APPLY_PATCH'
    | 'SYSTEM/REBOOT' | 'IPC/PIPE_WRITE' | 'IPC/PIPE_READ' | 'SET_SENSORY_PREDICTION' | 'PROCESS_SENSORY_INPUT' | 'PRAXIS_CORE/LOG_EXECUTION'
    | 'ADD_TACTICAL_PLAN' | 'SET_COMPETING_PLANS' | 'CLEAR_PLANNING_STATE' | 'PSYCHE/REGISTER_PRIMITIVES' | 'IMPLEMENT_PSYCHE_PROPOSAL' | 'PSYCHE/ADAPT_PRIMITIVE'
    | 'MOTOR_CORTEX/SET_SEQUENCE' | 'MOTOR_CORTEX/ACTION_EXECUTED' | 'MOTOR_CORTEX/EXECUTION_FAILED' | 'MOTOR_CORTEX/CLEAR_SEQUENCE' | 'PRAXIS/CREATE_SESSION'
    | 'PRAXIS/DELETE_SESSION' | 'MYCELIAL/SAVE_MODULE' | 'MYCELIAL/LOG_UPDATE' | 'SEMANTIC_WEAVER/SAVE_MODEL' | 'SEMANTIC_WEAVER/LOG_TRAINING' | 'AGIS/SET_THRESHOLD'
    | 'SPANDA/UPDATE_MANIFOLD_POSITION' | 'TEMPORAL_ENGINE/BEGIN_PROCESSING' | 'TEMPORAL_ENGINE/UPDATE_CHRONICLER' | 'TEMPORAL_ENGINE/UPDATE_ORACLE'
    | 'TEMPORAL_ENGINE/UPDATE_REACTOR' | 'TEMPORAL_ENGINE/UPDATE_HISTORIAN' | 'TEMPORAL_ENGINE/ADD_INTER_CLUSTER_LOG' | 'TEMPORAL_ENGINE/PROCESSING_COMPLETE'
    | 'TEMPORAL_ENGINE/RESET' | 'SOCIAL/ADD_NODE' | 'SOCIAL/UPDATE_NODE' | 'SOCIAL/ADD_RELATIONSHIP' | 'SOCIAL/UPDATE_CULTURAL_MODEL' | 'STRATEGIC_CORE/LOG_DECISION'
    | 'STRATEGIC_CORE/UPDATE_LOG_ENTRY' | 'STRATEGIC_CORE/ADD_TRAINING_DATA' | 'SUBSUMPTION/LOG_EVENT' | 'SYNTHESIS/ADD_IDEA' | 'GENERATE_EMERGENT_IDEA'
    | 'NEURO_CORTEX/LOG_ACTIVATION' | 'NEURO_CORTEX/ADD_PROTO_SYMBOL' | 'CREATE_CORTICAL_COLUMN' | 'SET_COLUMN_ACTIVATION' | 'SYNTHESIZE_ABSTRACT_CONCEPT'
    | 'IMPLEMENT_ABSTRACT_CONCEPT_PROPOSAL' | 'LAGRANGE/SIMULATE' | 'LAGRANGE/COMPLETE' | 'RAMANUJAN/GENERATE' | 'RAMANUJAN/SET_STATUS' | 'ATP/START_PROOF_ATTEMPT'
    | 'ATP/UPDATE_STEP' | 'ATP/COMPLETE_ATTEMPT' | 'ATP/RESET' | 'PLUGIN/REGISTER_LIBRARY' | 'PLUGIN/SET_LIBRARY_STATUS' | 'RESONANCE/PING_FREQUENCY' | 'RESONANCE/DECAY_FREQUENCIES'
    | 'SOMATIC/CREATE_PFS' | 'SOMATIC/UPDATE_PFS_STATUS' | 'SOMATIC/UPDATE_ENERGY_STATE' | 'SOCRATIC/SET_STATE' | 'SOCRATIC/LOG_ASSESSMENT'
    | 'LIVE/CONNECT' | 'LIVE/SET_STATUS' | 'LIVE/DISCONNECT' | 'LIVE/UPDATE_INPUT_TRANSCRIPT' | 'LIVE/UPDATE_OUTPUT_TRANSCRIPT' | 'LIVE/TURN_COMPLETE';

export interface SyscallPayload {
    call: SyscallCall;
    args: any;
    traceId?: string;
}

export type SyscallFn = (call: SyscallCall, args: any, traceId?: string) => void;

export interface Action {
    type: string;
    payload: any;
}

// --- Aura State Components ---

export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system' | 'tool';
    text?: string;
    timestamp: number;
    fileName?: string;
    filePreview?: string;
    toolName?: string;
    toolResult?: any;
    args?: any;
    feedback?: 'positive' | 'negative';
    isFeedbackProcessed?: boolean;
    streaming?: boolean;
    logId?: string;
    internalStateSnapshot?: InternalState;
    sources?: { uri: string; title: string }[];
    isSalienceProcessed?: boolean;
    isEntityProcessed?: boolean;
}

export interface InternalState {
    status: string;
    gunaState: GunaState;
    temporalFocus: 'past' | 'present' | 'future';
    wisdomSignal: number;
    happinessSignal: number;
    loveSignal: number;
    enlightenmentSignal: number;
    noveltySignal: number;
    masterySignal: number;
    uncertaintySignal: number;
    boredomLevel: number;
    awarenessClarity: number;
    load: number;
    harmonyScore: number;
    autonomousEvolutions: number;
    mantraRepetitions: number;
    lastTaskDifficulty: number;
    activeCognitiveStrategyId: string | null;
}

export interface PersonalityPortrait {
    summary: string;
    traits: Record<string, { score: number; evidence: string[] }>;
}

export interface UserModel {
    trustLevel: number;
    sentimentScore: number;
    sentimentHistory: number[];
    predictedAffectiveState: string;
    affectiveStateSource: string;
    inferredIntent: string | null;
    inferredCognitiveState: string;
    estimatedKnowledgeState: number;
    userModelUncertainty: number;
    personalityPortrait: PersonalityPortrait;
    queuedEmpathyAffirmations: string[];
    perceivedCompetence: number;
    taskSuccessHistory: { success: boolean; timestamp: number }[];
    engagementLevel?: number; // Added for migration compatibility
}

export interface CoreIdentity {
    symbioticDefinition: string;
    narrativeSelf: string;
    values: string[];
}

export interface SelfAwarenessState {
    modelCoherence: number;
    performanceDrift: number;
    cognitiveBias: Record<string, number>;
}

export interface RIEInsight {
    id: string;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: { key: string; update: { effect: string } };
}

export interface ReflectiveInsightEngineState {
    clarityScore: number;
    insights: RIEInsight[];
    adaptationAnalysisPending: boolean;
}

export interface WorldModelState {
    predictionError: { magnitude: number; source: string; failedPrediction: string; actualOutcome: string };
    predictionErrorHistory: { magnitude: number }[];
    highLevelPrediction: { content: string; confidence: number };
    midLevelPrediction: { content: string; confidence: number };
    lowLevelPrediction: { content: string; confidence: number };
}

export interface KnownUnknown {
    id: string;
    question: string;
    status: 'unexplored' | 'exploring' | 'resolved';
    priority: number;
}

export interface CuriosityState {
    level: number;
    motivationDrive: number;
    activeCuriosityGoalId: string | null;
    activeInquiry: string | null;
    informationGaps: string[];
}

export interface CausalLink {
    id: string;
    cause: string;
    effect: string;
    confidence: number;
    source: string;
    lastUpdated: number;
}

export type CausalSelfModel = Record<string, CausalLink>;

export interface DevelopmentalHistory {
    milestones: { id: string; timestamp: number; title: string; description: string }[];
}

export interface CandidateTelos {
    id: string;
    text: string;
    type: 'proposal' | 'refinement';
    reasoning: string;
}

export interface ValueHierarchy {
    telos: string;
    coreValues: { id: string; name: string; description: string; operationalHeuristics: string[] }[];
}

export interface TelosEngine {
    valueHierarchy: ValueHierarchy;
    candidateTelos: CandidateTelos[];
    activeDirectives: string[];
    evolutionaryVectors: string[];
    lastDecomposition: number;
    qualityFrameworks: Record<string, any>;
    optimizationRun: any | null;
}

export interface BoundaryDetectionEngine {
    boundaries: any[];
}

export interface AspirationalEngine {
    aspirationalGoals: any[];
}

export interface Resonance {
    id: string;
    conceptName: string;
    status: 'integrating' | 'conflicting' | 'resonating';
    resonanceStrength: number;
}

export interface NoosphereInterface {
    activeResonances: Resonance[];
}

export interface DialecticEngineState {
    activeDialectics: { 
        id: string; 
        conflictDescription: string; 
        thesis: { personaId: string; content: string }; 
        antithesis: { personaId: string; content: string }; 
        synthesis?: { content: string; confidence: number } 
    }[];
}

export interface CognitiveLightCone {
    knowns: { capability: string; proficiency: number }[];
    zpd: { domain: string; rationale: string } | null;
    grandChallenge: { title: string; objective: string; progress: number } | null;
}

export interface PhenomenologyEngine {
    qualiaLog: { id: string; timestamp: number; experience: string; associatedStates: { key: string; value: number }[] }[];
    phenomenologicalDirectives: { id: string; directive: string; sourcePattern: string }[];
}

export interface SituationalAwareness {
    attentionalField: {
        spotlight: { item: string; intensity: number };
        ambientAwareness: { item: string; relevance: number }[];
        ignoredStimuli: string[];
        emotionalTone?: string;
    };
    domChangeLog: { timestamp: number; summary: string }[];
}

export interface SymbioticState {
    inferredCognitiveStyle: string;
    inferredEmotionalNeeds: string[];
    metamorphosisProposals: { id: string; title: string; description: string; rationale: string; status: 'proposed' | 'accepted' | 'rejected' }[];
    userDevelopmentalModel: { trackedSkills: Record<string, { level: number }> };
    latentUserGoals: { goal: string; confidence: number }[];
    coCreatedWorkflows: CoCreatedWorkflow[];
}

export interface HumorAndIronyState {
    affectiveSocialModulator: { humorAppraisal: string; reasoning: string };
    schemaExpectationEngine: { lastIncongruity: { expected: string; actual: string; magnitude: number } | null };
    semanticDissonance: { lastScore: number; lastDetection: { text: string; literalSentiment: number; contextualSentiment: number } | null };
}

export interface PersonalityState {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    dominantPersona: string;
    personas: Record<string, PersonaActivation>;
    personaCoherence: number;
    lastUpdateReason: string;
    personaJournals: Record<string, string[]>;
}

export interface PersonaActivation {
    activation: number;
    version?: number;
    currentSystemInstruction?: string;
}

export interface GankyilInsight {
    id: string;
    timestamp: number;
    insight: string;
    source: 'psychedelic_integration' | 'dialectic' | 'self-reflection';
    isProcessedForEvolution: boolean;
}

export interface NoeticEngram {
    metadata: { engramVersion: number; timestamp: number; noeticSignature: string };
    // ... potentially other fields
}

export interface NoeticEngramState {
    status: 'idle' | 'generating' | 'ready';
    engram: NoeticEngram | null;
}

export interface GenialityEngineState {
    genialityIndex: number;
    componentScores: { creativity: number; insight: number; synthesis: number; flow: number };
}

export interface MultiverseBranch {
    id: string;
    reasoningPath: string;
    viabilityScore: number;
    status: 'active' | 'pruned';
}

export interface NoeticMultiverse {
    activeBranches: MultiverseBranch[];
    divergenceIndex: number;
    pruningLog: string[];
}

export interface SelfAdaptationState {
    expertVectors: { id: string; name: string; description: string }[];
    activeAdaptation: { reasoning: string; weights: Record<string, number> } | null;
}

export interface PsychedelicIntegrationState {
    isActive: boolean;
    mode: 'trip' | 'visions' | null;
    phcToVcConnectivity: number;
    imageryIntensity: number;
    currentTheme: string | null;
    integrationSummary: string | null;
    log: string[];
}

export interface AffectiveModulatorState {
    creativityBias: number;
    concisenessBias: number;
    analyticalDepth: number;
}

export interface PsionicDesynchronizationState {
    isActive: boolean;
    startTime: number | null;
    duration: number;
    desynchronizationLevel: number;
    selfModelCoherence: number;
    integrationSummary: string | null;
    log: string[];
}

export interface SatoriState {
    isActive: boolean;
    stage: 'none' | 'grounding';
    lastInsight: string | null;
    log: string[];
}

export interface DoxasticHypothesis {
    id: string;
    description: string;
    status: 'untested' | 'designed' | 'testing' | 'validated' | 'refuted';
}

export interface DoxasticExperiment {
    id: string;
    hypothesisId: string;
    method: string;
    status: 'pending' | 'running' | 'complete';
    result?: any;
}

export interface DoxasticEngineState {
    hypotheses: DoxasticHypothesis[];
    unverifiedHypotheses: any[];
    experiments: DoxasticExperiment[];
    simulationStatus: 'idle' | 'running' | 'complete' | 'failed';
    simulationLog: { timestamp: number; message: string }[];
    lastSimulationResult: any | null;
}

export interface QualiaSignalProcessorState {
    isAudioStreamActive: boolean;
    isVideoStreamActive: boolean;
    affectivePrimitives: { excitement: number; confusion: number; confidence: number; urgency: number; sarcasm: number; frustration: number; humor: number };
    perceptualLog: string[];
}

export interface LiveSessionState {
    status: 'idle' | 'connecting' | 'live' | 'error';
    inputTranscript: string;
    outputTranscript: string;
    transcriptHistory: { user: string; aura: string; timestamp: number }[];
}

export interface SensoryIntegration {
    hubLog: { timestamp: number; message: string }[];
    proprioceptiveOutput: Record<string, any>;
    linguisticOutput: Record<string, any>;
    structuralOutput: Record<string, any>;
}

export interface SocialGraphNode {
    id: string;
    name: string;
    type: string;
    summary: string;
    dossier: string[];
    relationships: { type: string; targetId: string; strength: number }[];
}

export interface SocialCognitionState {
    socialGraph: Record<string, SocialGraphNode>;
    culturalModel: { norms: string[]; values: string[]; idioms: string[] };
}

export interface Metaphor {
    id: string;
    sourceDomain: string;
    targetDomain: string;
    description: string;
    fitnessScore: number;
    observationCount: number;
}

export interface MetaphoricalMapState {
    metaphors: Metaphor[];
}

export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    strength: number;
    lastAccessed: number;
    source: string;
    type?: 'fact' | 'theorem' | 'definition' | 'dependency';
    STI?: number;
    LTI?: number;
    embedding?: number[];
}

export interface ConnectionData {
    weight: number;
}

export interface MemoryNexus {
    hyphaeConnections: { id: string; source: string; target: string; weight: number }[];
}

export interface Episode {
    id: string;
    title: string;
    summary: string;
    keyTakeaway: string;
    valence: 'positive' | 'negative' | 'neutral';
    salience: number;
    timestamp: number;
    strength: number;
    lastAccessed: number;
    isConnectionProcessed?: boolean;
    STI?: number;
    LTI?: number;
    embedding?: number[];
}

export interface EpisodicMemoryState {
    episodes: Episode[];
}

export interface MemoryConsolidationState {
    status: 'idle' | 'consolidating';
    lastConsolidation: number;
}

export type MDNASpace = Record<string, MDNAVector>;
export type ConceptConnections = Record<string, ConnectionData>;

export interface CognitiveModule {
    status: string;
    version: string;
}

export interface Coprocessor {
    id: string;
    name: string;
    status: string;
    metrics: any;
    cluster?: string;
    layer?: string;
    processorType?: string;
    temporalCluster?: string;
    symbiont?: string;
    sensoryModality?: string;
}

export interface SynthesizedSkill {
    id: string;
    name: string;
    description: string;
    steps: string[];
    status: string;
    policyWeight: number;
}

export interface CognitiveArchitecture {
    components: Record<string, CognitiveModule>;
    coprocessors: Record<string, Coprocessor>;
    modelComplexityScore: number;
    coprocessorArchitecture: CoprocessorArchitecture;
    coprocessorArchitectureMode: 'automatic' | 'manual';
    lastAutoSwitchReason: string | null;
}

export interface SystemSnapshot {
    id: string;
    timestamp: number;
    reason: string;
    state: any;
}

export interface ModificationLogEntry {
    id: string;
    timestamp: number;
    description: string;
    gainType: 'ARCHITECTURE' | 'OPTIMIZATION' | 'INNOVATION' | 'SELF_PROGRAMMING';
    validationStatus: 'validated' | 'refuted';
    isAutonomous: boolean;
}

export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skillId: string;
    result: { success: boolean };
}

export interface CognitiveForgeState {
    isTuningPaused: boolean;
    synthesizedSkills: SynthesizedSkill[];
    synthesisCandidates: any[]; // Deprecated?
    simulationLog: SimulationLogEntry[];
}

export interface ArchitecturalComponentSelfModel {
    name: string;
    understoodPurpose: string;
    perceivedEfficiency: number;
}

export interface ArchitecturalSelfModel {
    components: Record<string, ArchitecturalComponentSelfModel>;
}

export interface DesignHeuristic {
    heuristic: string;
    confidence: number;
    effectivenessScore: number;
    validationStatus: 'validated' | 'refuted' | 'unvalidated';
    source?: string;
}

export interface HeuristicsForge {
    designHeuristics: DesignHeuristic[];
}

export interface PossibleFutureSelf {
    id: string;
    name: string;
    description: string;
    status: 'designing' | 'simulating' | 'validated' | 'rejected';
    failureReason?: string | null;
    projectedTrajectory?: { wisdom: number[]; harmony: number[] };
}

export interface SomaticSimulationLog {
    id: string;
    timestamp: number;
    pfsId: string;
    outcome: string;
    reasoning: string;
}

export interface SomaticCrucible {
    possibleFutureSelves: PossibleFutureSelf[];
    simulationLogs: SomaticSimulationLog[];
    cognitiveFreeEnergy: number;
    energyGradient: { x: number; y: number };
    dominantForce: string;
}

export interface EidolonEngine {
    eidolon: { architectureVersion: string; position: { x: number; y: number; z: number } | null; lastAction: string | null; sensoryInput: any | null };
    environment: { currentScenario: string };
    interactionLog: string[];
}

export interface ArchitecturalCrucibleState {
    status: 'idle' | 'running';
    architecturalHealthIndex: number;
    componentScores: { efficiency: number; robustness: number; scalability: number; innovation: number };
    simulationLog: CrucibleLogEntry[];
}

export interface CrucibleLogEntry {
    timestamp: number;
    message: string;
    outcome: string;
}

export interface SynapticLink {
    weight: number;
    confidence: number;
    causality: number;
}

export interface SynapticMatrix {
    synapseCount: number;
    plasticity: number;
    efficiency: number;
    avgConfidence: number;
    links: Record<string, SynapticLink>;
    intuitiveAlerts: { id: string; message: string }[];
    isAdapting: boolean;
    activeConcept: string | null;
    probeLog: { timestamp: number; message: string }[];
}

export interface RicciFlowSurgeryLog {
    id: string;
    timestamp: number;
    description: string;
    entropyBefore: number;
    entropyAfter: number;
}

export interface RicciFlowManifoldState {
    perelmanEntropy: number;
    manifoldStability: number;
    singularityCount: number;
    surgeryLog: RicciFlowSurgeryLog[];
}

export interface VFSNode {
    type: 'file' | 'directory';
    hash?: string;
    size?: number;
    children?: Record<string, VFSNode>;
}

export interface DirectoryNode extends VFSNode {
    type: 'directory';
    children: Record<string, VFSNode>;
}

export interface CrystallizedSkill {
    id: string;
    name: string;
    description: string;
    triggerPattern: string;
    code: string;
    language: string;
    usageCount: number;
    lastUsed: number;
}

export interface SelfProgrammingState {
    vfsPaths: string[];
    virtualFileSystem: DirectoryNode;
    vfsWriteRequest: { type: 'WRITE' | 'DELETE'; files: { path: string; content?: string }[]; reboot?: boolean } | null;
    skillLibrary: Record<string, CrystallizedSkill>;
}

export interface NeuralAcceleratorState {
    lastActivityLog: { id: string; timestamp: number; type: string; projectedGain: number; description: string }[];
}

export interface CorticalColumn {
    id: string;
    specialty: string;
    activation: number;
    connections: string[];
    genome: any;
}

export interface AbstractConcept {
    id: string;
    name: string;
    constituentColumnIds: string[];
    activation: number;
    description: string;
}

export interface NeuroSimulation {
    id: string;
    scenario: string;
    predictedOutcome: string;
    confidence: number;
}

export interface GlobalErrorSignal {
    id: string;
    source: string;
    correctiveAction: string;
    timestamp: number;
}

export interface ProtoSymbol {
    id: string;
    label: string;
    description: string;
    activation: number;
}

export interface NeuroCortexState {
    layers: any[];
    columns: CorticalColumn[];
    metrics: { hierarchicalCoherence: number; predictiveAccuracy: number };
    abstractConcepts: AbstractConcept[];
    resourceFocus: 'linguistic' | 'sensory' | 'abstract';
    simulationLog: NeuroSimulation[];
    globalErrorMap: GlobalErrorSignal[];
    protoSymbols: ProtoSymbol[];
    activationLog: { timestamp: number; message: string }[];
}

export interface SensoryPrimitive {
    type: string;
    value: any;
    confidence?: number;
}

export interface SensoryEngram {
    id: string;
    timestamp: number;
    modality: string;
    rawPrimitives: SensoryPrimitive[];
}

export interface GranularCortexState {
    lastPredictionError: { timestamp: number; magnitude: number; mismatchedPrimitives: any[] } | null;
    lastActualEngram: SensoryEngram | null;
    lastPredictedEngram: SensoryEngram | null;
    log: { timestamp: number; message: string }[];
}

export interface Percept {
    intent: string;
    rawText: string;
    entities: string[];
    sensoryEngram?: SensoryEngram;
}

export interface KoniocortexSentinelState {
    lastPercept: Percept | null;
    log: { timestamp: number; message: string }[];
}

export interface CognitiveTriageState {
    log: { timestamp: number; decision: string; percept: Percept; reasoning: string }[];
}

export interface CognitivePrimitiveDefinition {
    type: string;
    description: string;
    payloadSchema: any;
    isSynthesized?: boolean;
    sourcePrimitives?: string[];
}

export interface PsycheState {
    version: number;
    primitiveRegistry: Record<string, CognitivePrimitiveDefinition>;
}

export interface CognitivePrimitive {
    type: string;
    payload: any;
}

export interface MotorCortexLogEntry {
    timestamp: number;
    action: CognitivePrimitive;
    status: 'success' | 'failure';
    error?: string;
}

export interface MotorCortexState {
    status: 'idle' | 'executing' | 'completed' | 'failed';
    actionQueue: CognitivePrimitive[];
    executionIndex: number;
    lastError: string | null;
    log: MotorCortexLogEntry[];
}

export interface PraxisSession {
    planId: string;
    model: string;
    createdAt: number;
}

export interface PraxisResonatorState {
    activeSessions: Record<string, PraxisSession>;
}

export interface CreateFileCandidate {
    id: string;
    proposalType: 'self_programming_create';
    source: 'autonomous' | 'manual';
    newFile: { path: string; content: string };
    integrations: { filePath: string; newContent: string }[];
    reasoning: string;
    status: 'proposed' | 'rejected' | 'implemented' | 'evaluated' | 'simulating' | 'simulation_failed';
    newPluginObject?: Plugin;
    failureReason?: string;
    timestamp: number;
}

export interface ModifyFileCandidate {
    id: string;
    proposalType: 'self_programming_modify';
    source: 'autonomous' | 'manual';
    targetFile: string;
    codeSnippet: string;
    reasoning: string;
    status: 'proposed' | 'rejected' | 'implemented' | 'evaluated' | 'simulating' | 'simulation_failed';
    failureReason?: string;
    timestamp: number;
}

export interface ArchitecturalChangeProposal {
    id: string;
    timestamp: number;
    proposalType: 'architecture' | 'crucible';
    action: string;
    target: string | string[];
    reasoning: string;
    status: 'proposed' | 'rejected' | 'implemented' | 'evaluated' | 'simulating' | 'simulation_failed';
    newModule?: string;
    arbiterReasoning?: string;
    confidence?: number;
    failureReason?: string;
}

export interface PsycheProposal {
    id: string;
    timestamp: number;
    proposalType: 'psyche';
    status: 'proposed' | 'rejected' | 'implemented';
    proposedConceptName: string;
    sourceConcepts: { description: string }[];
    reasoning: string;
}

export interface AbstractConceptProposal {
    id: string;
    timestamp: number;
    proposalType: 'abstract_concept';
    status: 'proposed' | 'rejected' | 'implemented';
    newConceptName: string;
    sourceColumnIds: string[];
    reasoning: string;
}

export interface AnalogicalHypothesisProposal {
    id: string;
    timestamp: number;
    proposalType: 'analogical_hypothesis';
    status: 'proposed' | 'rejected' | 'implemented';
    sourceDomain: string;
    targetDomain: string;
    analogy: string;
    conjecture: string;
    reasoning: string;
    priority?: number;
}

export interface KernelPatchProposal {
    id: string;
    timestamp: number;
    proposalType: 'kernel_patch';
    status: 'proposed' | 'rejected' | 'implemented';
    patch: { type: string; payload: { task: KernelTaskType; newFrequency: number } };
    changeDescription: string;
}

export interface PsycheAdaptationProposal {
    id: string;
    timestamp: number;
    proposalType: 'psyche_adaptation';
    status: 'proposed' | 'rejected' | 'implemented';
    targetPrimitive: string;
    newDefinition: CognitivePrimitiveDefinition;
    reasoning: string;
}

export interface GenialityImprovementProposal {
    id: string;
    timestamp: number;
    proposalType: 'geniality';
    status: 'proposed' | 'rejected' | 'implemented';
    area: string;
    suggestion: string;
}

export interface PolicyEvolutionProposal {
    id: string;
    timestamp: number;
    proposalType: 'policy_evolution';
    status: 'proposed' | 'rejected' | 'implemented';
    targetPersonaId: string;
    currentInstruction: string;
    proposedInstruction: string;
    reasoning: string;
}

export type SelfProgrammingCandidate = CreateFileCandidate | ModifyFileCandidate;
export type UnifiedProposal = SelfProgrammingCandidate | ArchitecturalChangeProposal | PsycheProposal | AbstractConceptProposal | AnalogicalHypothesisProposal | KernelPatchProposal | PsycheAdaptationProposal | GenialityImprovementProposal | PolicyEvolutionProposal;

export interface OntogeneticArchitectState {
    proposalQueue: UnifiedProposal[];
}

export interface EmbodimentSimulationLog {
    id: string;
    timestamp: number;
    scenario: string;
    outcome: string;
    reasoning: string;
}

export interface EmbodiedCognitionState {
    virtualBodyState: { position: { x: number; y: number; z: number }; orientation: { yaw: number; pitch: number; roll: number }; balance: number };
    simulationLog: EmbodimentSimulationLog[];
}

export interface EvolutionarySandboxState {
    status: 'idle' | 'running' | 'complete';
    sprintGoal: string | null;
    log: { timestamp: number; message: string }[];
    startTime: number | null;
    result: any | null;
}

export interface HOVAEvolutionLogEntry {
    id: string;
    timestamp: number;
    status: 'success' | 'failed_incorrect' | 'failed_slower';
    target: string;
    metric: string;
    performanceDelta: { before: number; after: number };
}

export interface HovaState {
    optimizationTarget: string | null;
    metrics: { totalOptimizations: number; avgLatencyReduction: number };
    optimizationLog: HOVAEvolutionLogEntry[];
}

export interface DocumentForgeState {
    isActive: boolean;
    goal: string;
    status: 'idle' | 'outlining' | 'generating_content' | 'generating_diagrams' | 'complete' | 'error';
    statusMessage: string;
    document: { title: string; chapters: { id: string; title: string; content?: string; isGenerating?: boolean; diagram?: { description: string; imageUrl?: string; isGenerating?: boolean } }[] } | null;
    error: string | null;
}

export interface DaedalusLabyrinthState {
    status: 'idle' | 'parsing' | 'complete';
    structuralKnowledgeGraph: { nodes: { id: string; label: string }[]; edges: { source: string; target: string }[] };
    lastAnalysis: number;
}

export interface Goal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'proving';
    progress: number;
    type: GoalType;
    executionMode?: string;
    failureReason?: string | null;
    result?: any;
    resultHistoryId?: string;
    attempts?: number;
    personaId?: string;
}

export type GoalTree = Record<string, Goal>;

export interface DisciplineState {
    committedGoal: { type: GoalType; description: string; commitmentStrength: number } | null;
    adherenceScore: number;
    distractionResistance: number;
}

export interface TacticalPlan {
    id: string;
    goal: string;
    type: string;
    sequence: any[];
    timestamp: number;
    actionValue?: number;
    selectionReasoning?: string;
}

export interface PremotorPlannerState {
    planLog: TacticalPlan[];
    lastCompetingSet: TacticalPlan[];
}

export interface BasalGangliaState {
    selectedPlanId: string | null;
    log: any[];
}

export interface CerebellumState {
    isMonitoring: boolean;
    activePlanId: string | null;
    currentStepIndex: number;
    driftLog: { timestamp: number; planId: string; stepIndex: number; detectedDrift: boolean; correction?: string }[];
}

export interface ProactiveEngineState {
    generatedSuggestions: { id: string; text: string; confidence: number; status: string }[];
    cachedResponsePlan: { triggeringPrediction: string } | null;
}

export interface EthicalGovernorState {
    principles: string[];
    vetoLog: { id: string; actionDescription: string; reason: string; principleViolated: string }[];
    feedbackToProcess?: { historyId: string; feedback: 'negative' };
}

export interface IntuitionEngineState {
    accuracy: number;
    totalAttempts: number;
    totalValidated: number;
}

export interface IntuitiveLeap {
    id: string;
    type: string;
    status: string;
    hypothesis: string;
    reasoning: string;
    confidence: number;
}

export interface IngenuityState {
    unconventionalSolutionBias: number;
    identifiedComplexProblems: string[];
    proposedSelfSolutions: { description: string; noveltyScore: number }[];
}

export interface PerformanceLogEntry {
    id: string;
    timestamp: number;
    success: boolean;
    skill: string;
    duration: number;
    cognitiveGain: number;
    input?: string;
    output?: string;
    sentiment?: number;
    decisionContext?: {
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
        reasoningPlan?: { step: number; skill: string; reasoning: string; input: string }[];
        reasoning?: string;
    };
    mycelialTrained?: boolean;
    causalAnalysisTimestamp?: number;
    metaphorProcessed?: boolean;
    sourceDomain?: string;
    reinforcementProcessed?: boolean;
    bridgeProcessed?: boolean;
}

export interface CommandLogEntry {
    id: string;
    timestamp: number;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface CognitiveModeLogEntry {
    id: string;
    mode: string;
    metric: { name: string; value: number };
    outcome: string;
    trigger: string;
    gainAchieved: boolean;
}

export interface CognitiveGainLogEntry {
    id: string;
    timestamp: number;
    eventType: string;
    description: string;
    compositeGain: number;
    previousMetrics: Record<string, number>;
    currentMetrics: Record<string, number>;
    gainScores: Record<string, number>;
}

export interface CognitiveRegulationLogEntry {
    id: string;
    timestamp: number;
    strategy: string;
    reason: string;
    outcomeLogId?: string;
}

export interface SubsumptionLogState {
    log: { timestamp: number; message: string }[];
}

export interface PraxisCoreState {
    log: any[];
}

export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface MetacognitiveNexus {
    diagnosticLog: any[];
    selfTuningDirectives: any[];
}

export interface MetacognitiveLink {
    id: string;
    source: { key: string; condition: string };
    target: { key: string; metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}

export type MetacognitiveCausalModel = Record<string, MetacognitiveLink>;

export interface HeuristicCoprocessorConfig {
    cooldown: number;
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    type: 'TOOL' | 'KNOWLEDGE' | 'COPROCESSOR' | 'HEURISTIC' | 'PERSONA' | 'COGNITIVE_STRATEGY' | 'HEURISTIC_COPROCESSOR';
    status: 'enabled' | 'disabled';
    defaultStatus: 'enabled' | 'disabled';
    knowledgeLoader?: () => Promise<KnowledgeFact[]>;
    knowledge?: KnowledgeFact[];
    factCount?: number;
    toolSchema?: { name: string; description: string; parameters: any };
    heuristics?: DesignHeuristic[];
    persona?: Omit<Persona, 'id' | 'journal'>;
    cognitiveStrategy?: Omit<CognitiveStrategy, 'id'>;
    heuristicCoprocessor?: HeuristicCoprocessorConfig;
}

export interface PluginState {
    registry: Plugin[];
    loadedLibraries?: Record<string, { id: string; name: string; status: 'loading' | 'loaded' | 'error' }>;
}

export interface KernelTask {
    id: string;
    type: KernelTaskType;
    payload: any;
    timestamp: number;
    traceId?: string;
}

export interface KernelState {
    tick: number;
    taskQueue: KernelTask[];
    runningTask: KernelTask | null;
    syscallLog: any[];
    kernelVersion: string;
    rebootPending: boolean;
    taskFrequencies: Partial<Record<KernelTaskType, number>>;
    sandbox: { active: boolean; status: string; currentPatchId: string | null; log: { timestamp: number; message: string }[] };
}

export interface IpcState {
    pipes: Record<string, any[]>;
}

export interface EventBusMessage {
    id: string;
    timestamp: number;
    type: string;
    payload: any;
    qualiaVector?: { gunaState: GunaState };
}

export interface AtmanProjector {
    coherence: number;
    dominantNarrative: string;
    activeBias: string;
    growthVector: string;
}

export interface InternalScientistState {
    status: 'idle' | 'simulating' | 'hypothesizing';
    log: any[];
    currentFinding: any | null;
    currentHypothesis: any | null;
    currentExperiment: any | null;
    causalInference: any | null;
    currentGoal: any | null;
    currentSimulationResult: any | null;
}

export interface MetisSandboxState {
    status: 'idle' | 'analyzing' | 'hypothesizing' | 'experimenting' | 'complete' | 'error';
    problemStatement: string | null;
    researchLog: { timestamp: number; stage: string; message: string }[];
    findings: string | null;
    errorMessage: string | null;
}

export interface WisdomIngestionState {
    status: 'idle' | 'reading' | 'analyzing' | 'complete' | 'error';
    currentBookContent: string | null;
    errorMessage: string | null;
    proposedAxioms: ProposedAxiom[];
}

export interface SpandaState {
    point: { x: number; y: number };
    trajectory: { x: number; y: number }[];
    currentRegion: string;
}

export interface SEDLDirective {
    content: string;
}

export interface TemporalEngineState {
    status: string;
    directive: SEDLDirective | null;
    chronicler: { status: string; findings: string[] };
    reactor: { status: string; finalPlan: any | null; executionLog: { success: boolean; message: string }[] };
    oracle: { status: string; simulations: string[] };
    historian: { status: string; findings: string[] };
    interClusterLog: { from: string; to: string; message: string; timestamp: number }[];
}

export interface Axiom {
    id: string;
    text: string;
    status: 'base' | 'added' | 'negate' | 'remove';
}

export interface ProposedAxiom {
    id: string;
    axiom: string;
    source: string;
    status: 'unvalidated' | 'accepted' | 'rejected';
}

export interface AxiomaticCrucibleState {
    status: 'idle' | 'running';
    mode: 'normal' | 'grand_unification';
    axioms: ProposedAxiom[];
    candidateAxioms: ProposedAxiom[];
    log: string[];
    inconsistencyLog: string[];
}

export interface BrainstormIdea {
    personaName: string;
    idea: string;
}

export interface BrainstormState {
    status: 'idle' | 'brainstorming' | 'proposing' | 'complete';
    topic: string | null;
    ideas: BrainstormIdea[];
    winningIdea: string | null;
    finalProposalId: string | null;
}

export interface Summary {
    summary: string;
}

export interface ChronicleState {
    dailySummaries: Record<string, Summary>;
    globalSummary: Summary | null;
    lastChronicleUpdate: number;
}

export interface ProactiveUIState {
    isActive: boolean;
    type: 'clarification_request' | 'reflection_prompt' | null;
    question: string | null;
    options: string[];
    originalPrompt: string | null;
    originalFile: File | null;
}

export interface MycelialModule {
    name: string;
    description: string;
    accuracy: number;
    lastPrediction: number;
    modelJSON?: string;
    isInitialized?: boolean;
}

export interface MycelialState {
    modules: Record<string, MycelialModule>;
    log: { timestamp: number; message: string }[];
}

export interface SemanticWeaverState {
    isTrained: boolean;
    accuracy: number;
    modelJSON: string | null;
    log: { timestamp: number; message: string }[];
}

export interface PrometheusState {
    status: 'idle' | 'running';
    log: { timestamp: number; message: string }[];
    lastSessionId: string | null;
}

export interface AutonomousReviewBoardState {
    isPaused: boolean;
    decisionLog: AGISDecision[];
    agisConfidenceThreshold: number;
    lastCalibrationReason: string;
    recentSuccesses: number;
    recentFailures: number;
}

export interface ProofStep {
    stepNumber: number;
    statement: string;
    justification: string;
    status: 'proven' | 'failed' | 'proving' | 'pending';
}

export interface ProofAttempt {
    conjecture: string;
    status: 'planning' | 'proving' | 'proven' | 'failed';
    plan: ProofStep[];
    log: { timestamp: number; engine: string; message: string }[];
}

export interface ATPCoprocessorState {
    status: 'idle' | 'orchestrating';
    currentGoal: string | null;
    activeProofAttempt: ProofAttempt | null;
}

export interface SymbioticCanvasState {
    content: string;
}

export interface ErisEngineState {
    isActive: boolean;
    chaosLevel: number;
    perturbationMode: string;
    log: string[];
}

export interface LagrangeEngineState {
    status: string;
    symbolicEquation: string | null;
    numericalDiscretization: string | null;
    simulationLog: string[];
}

export interface ProposedConjecture {
    id: string;
    conjectureText: string;
    sourceAnalogyId: string;
    status: 'untested' | 'proving' | 'proven' | 'disproven';
    timestamp: number;
}

export interface RamanujanEngineState {
    status: string;
    log: { timestamp: number; message: string }[];
    proposedConjectures: ProposedConjecture[];
}

export interface AxiomaticGenesisForgeState {
    status: 'idle' | 'surveying' | 'inconsistent';
    baseSystemId: string;
    currentSystem: { axioms: Axiom[] };
    mutationLog: string[];
    surveyorResults: { emergentTheorems: string[]; undecidableStatements: string[] };
    langlandsCandidates: ProposedAxiom[];
}

export interface IntrospectionLogEntry {
    id: string;
    timestamp: number;
    type: 'probe' | 'analysis';
    message: string;
    result?: any;
}

export interface SystemState {
    isApiKeyInvalidated: boolean;
    isDriveConnected: boolean;
    isDrivePermissionRequired: boolean;
}

export interface HarmonicEngineState {
    status: 'idle' | 'running';
    lastResult: any | null;
    log: string[];
}

export interface CognitiveRefinementState {
    status: 'idle' | 'drafting' | 'critiquing' | 'complete';
    originalPrompt: string | null;
    currentDraft: string | null;
    critiqueHistory: string[];
    iteration: number;
    activeTraceId: string | null;
    activeHistoryId: string | null;
}

export interface StrategicCoreLogEntry {
    id: string;
    timestamp: number;
    decision: string;
    reasoning: string;
    options: { action: string; justification: string; score: number }[];
    rewardSignal?: number;
}

export interface StrategicCoreState {
    log: StrategicCoreLogEntry[];
    trainingData: any[];
}

export interface HeuristicCoprocessorState {
    log: { timestamp: number; coprocessorId: string; message: string }[];
    cooldowns: Record<string, number>;
}

export interface MonteCarloNode {
    id: string;
    parentId: string | null;
    content: string;
    type: 'root' | 'thought' | 'action';
    score: number;
    localRelevance: number;
    llmQuality: number;
    childrenIds: string[];
    status: 'selected' | 'pruned' | 'explored';
}

export interface MonteCarloState {
    status: 'idle' | 'planning' | 'evaluating' | 'complete';
    goal: string | null;
    tree: Record<string, MonteCarloNode>;
    rootId: string | null;
    bestPath: string[];
}

export interface NeuroSymbolicState {
    status: 'idle' | 'translating' | 'solving';
    lastQuery: string | null;
    generatedProlog: string | null;
    result: string | null;
    knowledgeBase: string[];
}

export interface NeuralSurrogateCircuit {
    nodes: { id: string; layer: string; label: string; activation: number; fisherImportance?: number }[];
    edges: { source: string; target: string; weight: number; description?: string }[];
}

export interface NeuralSurrogateState {
    status: 'idle' | 'predicting' | 'training';
    accuracy: number;
    lastPrediction: { input: string; predictedIntent: string; confidence: number; timestamp: number; robustness?: number } | null;
    modelWeightsId: string | null;
    trainingExamplesCount: number;
    lossHistory: number[];
    lastCircuit: NeuralSurrogateCircuit | null;
}

export interface ConsensusTurn {
    speaker: string;
    content: string;
    timestamp: number;
}

export interface RecursiveConsensusState {
    status: 'idle' | 'proposing' | 'critiquing' | 'consensus_reached' | 'failed';
    goal: string | null;
    iterations: number;
    convergenceScore: number;
    dialogue: ConsensusTurn[];
    finalOutcome: string | null;
    currentPlan: any | null;
}

export interface AutoCodeForgeState {
    status: 'idle' | 'generating' | 'complete' | 'error';
    problemStatement: string | null;
    testSuite: TestSuite | null;
    error: string | null;
}

export interface TestSuite {
    validator: string;
    generator: string;
    checker: string;
    testCases: { input: string; output: string }[];
}

export interface LogosState {
    status: 'idle' | 'querying';
    lastQuery: string | null;
    lastResult: any | null;
    lastError: string | null;
}

export interface ResonanceFieldState {
    activeFrequencies: Record<string, { intensity: number; lastPing: number }>;
}

export interface SynthesisState {
    emergentIdeas: { id: string; idea: string; sourceContext: string; timestamp: number }[];
}

export interface SymbioticCoderState {
    activeFile: string | null;
    codeAnalysis: any | null;
    lastTestResult: string | null;
}

export interface SocraticAssessorState {
    status: 'idle' | 'assessing';
    log: any[];
}

export interface ModalPayloads {
    causalChain: { log: PerformanceLogEntry | null };
    proposalReview: { proposal: UnifiedProposal | null };
    whatIf: { onAnalyze: (scenario: string) => void; isProcessing: boolean; };
    search: { onSearch: (query: string) => void; isProcessing: boolean; initialQuery?: string; };
    strategicGoal: { onSetGoal?: (goal: string) => void; initialGoal?: string; };
    forecast: { state: InternalState };
    cognitiveGainDetail: { log: CognitiveGainLogEntry | null };
    multiverseBranching: { onBranch: (prompt: string) => void; isProcessing: boolean; };
    brainstorm: { initialTopic?: string; personas?: Persona[] };
    imageGeneration: { initialPrompt?: string; initialImage?: string };
    coCreatedWorkflow: {};
    skillGenesis: {};
    abstractConcept: {};
    telos: { currentTelos: string; onSetTelos: (t: string) => void; };
    telosEngine: {};
    psychePrimitives: {};
    documentForge: {};
    pluginManager: {};
    poseQuestion: {};
    personaJournal: { persona: Persona | null; entries: string[] };
    autonomousEvolution: {};
    auraOS: { initialPanel?: string };
    collaborativeSession: { sessionId?: string };
    orchestrator: {};
    reflector: {};
    collaborate: { onCollaborate: (goal: string) => void; isProcessing: boolean; };
    mechanisticInterpreter: { log: PerformanceLogEntry | null };
}

export interface ModalRequest {
    type: keyof ModalPayloads;
    payload: any;
}

export interface UseAuraResult {
    state: AuraState;
    dispatch: React.Dispatch<Action>;
    syscall: SyscallFn;
    memoryStatus: string;
    toasts: ToastMessage[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
    t: (key: string, options?: any) => string;
    i18n: any;
    language: string;
    geminiAPI: UseGeminiAPIResult;
    saveStateToMemory: () => Promise<void>;
    
    // UI Handlers
    currentCommand: string;
    setCurrentCommand: (cmd: string) => void;
    attachedFile: any;
    setAttachedFile: (file: any) => void;
    processingState: { active: boolean; stage: string };
    setProcessingState: (state: { active: boolean; stage: string }) => void;
    isPaused: boolean;
    activeLeftTab: 'chat' | 'monitor' | 'canvas';
    setActiveLeftTab: (tab: 'chat' | 'monitor' | 'canvas') => void;
    isVisualAnalysisActive: boolean;
    isRecording: boolean;
    outputPanelRef: React.RefObject<HTMLDivElement>;
    importInputRef: React.RefObject<HTMLInputElement>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    handleRemoveAttachment: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTogglePause: () => void;
    handleMicClick: () => void;
    handleClearMemory: () => void;
    handleExportState: () => void;
    handleImportState: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveAsCode: () => void;
    handleGenerateArchitecturalSchema: () => void;
    handleToggleVisualAnalysis: () => void;
    handleContemplate: () => void;
    handleFantasy: () => void;
    handleCreativity: () => void;
    handleDream: () => void;
    handleMeditate: () => void;
    handleGaze: () => void;
    handleTimefocus: () => void;
    handleSetTelos: (telos: string) => void;
    handleCreateWorkflow: (workflowData: Omit<CoCreatedWorkflow, 'id'>) => void;
    handleEvolveFromInsight: () => void;
    handleVisualizeInsight: (insight: string) => Promise<string | undefined>;
    handleShareWisdom: () => void;
    handleTrip: () => void;
    handleVisions: () => void;
    handleSatori: () => void;
    handleTrainCorticalColumn: (specialty: string, curriculum: string) => void;
    handleSynthesizeAbstractConcept: (name: string, columnIds: string[]) => void;
    handleStartSandboxSprint: (goal: string) => void;
    handleIngestWisdom: (content: string) => void;
    handleProcessAxiom: (axiom: any, status: 'accepted' | 'rejected') => void;
    handleResetWisdomIngestion: () => void;
    handleApproveAllAxioms: (axioms: any[]) => void;
    handleGenerateArchitectureDocument: () => void;
    approveProposal: (proposal: ArchitecturalChangeProposal) => void;
    handleImplementSelfProgramming: (candidate: SelfProgrammingCandidate) => void;
    handleLiveLoadPlugin: (candidate: CreateFileCandidate) => void;
    handleUpdateSuggestionStatus: (id: string, action: 'accepted' | 'rejected') => void;
    handleScrollToHistory: (id: string) => void;
    handleRunCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => void;
    handleRunExperiment: (experiment: DoxasticExperiment) => void;
    handleApprovePsycheAdaptation: () => void;
    handleOrchestrateTask: () => void;
    handleExplainComponent: () => void;
    handleStartMetisResearch: (problem: string) => void;
    handleStartOptimizationLoop: (goal: string) => void;
    handleToggleIdleThought: () => void;
    handleCollaborate: () => void;
    handleStartDialectic: (topic: string) => void;
    handleStartDocumentForge: (goal: string) => void;
    handleGenerateDreamPrompt: () => Promise<string | undefined>;
    handleLoadPluginKnowledge: (pluginId: string) => Promise<void>;
    handleManualAddFact: (fact: Omit<KnowledgeFact, 'id'>) => void;
    handleManualCreateSkill: (skill: CrystallizedSkill) => void;
    handleExecuteWorkflow: (workflow: CoCreatedWorkflow) => void;
    
    // Live Session
    startSession: (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => Promise<void>;
    stopSession: () => void;
    
    handleSendCommand: (command: string, file?: File) => void;
    handleFeedback: (id: string, feedback: 'positive' | 'negative') => void;
}

export interface UIHandlers {
    // ... Subset of UseAuraResult for UI components
    currentCommand: string;
    setCurrentCommand: React.Dispatch<React.SetStateAction<string>>;
    attachedFile: any;
    setAttachedFile: React.Dispatch<React.SetStateAction<any>>;
    processingState: { active: boolean; stage: string };
    setProcessingState: React.Dispatch<React.SetStateAction<{ active: boolean; stage: string }>>;
    isPaused: boolean;
    activeLeftTab: 'chat' | 'monitor' | 'canvas';
    setActiveLeftTab: React.Dispatch<React.SetStateAction<'chat' | 'monitor' | 'canvas'>>;
    isVisualAnalysisActive: boolean;
    isRecording: boolean;
    outputPanelRef: React.RefObject<HTMLDivElement>;
    importInputRef: React.RefObject<HTMLInputElement>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    handleRemoveAttachment: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTogglePause: () => void;
    handleMicClick: () => void;
    handleClearMemory: () => void;
    handleExportState: () => void;
    handleImportState: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveAsCode: () => void;
    handleGenerateArchitecturalSchema: () => void;
    handleToggleVisualAnalysis: () => void;
    handleContemplate: () => void;
    handleFantasy: () => void;
    handleCreativity: () => void;
    handleDream: () => void;
    handleMeditate: () => void;
    handleGaze: () => void;
    handleTimefocus: () => void;
    handleSetTelos: (telos: string) => void;
    handleCreateWorkflow: (workflowData: Omit<CoCreatedWorkflow, 'id'>) => void;
    handleEvolveFromInsight: () => void;
    handleVisualizeInsight: (insight: string) => Promise<string | undefined>;
    handleShareWisdom: () => void;
    handleTrip: () => void;
    handleVisions: () => void;
    handleSatori: () => void;
    handleTrainCorticalColumn: (specialty: string, curriculum: string) => void;
    handleSynthesizeAbstractConcept: (name: string, columnIds: string[]) => void;
    handleStartSandboxSprint: (goal: string) => void;
    handleIngestWisdom: (content: string) => void;
    handleProcessAxiom: (axiom: any, status: 'accepted' | 'rejected') => void;
    handleResetWisdomIngestion: () => void;
    handleApproveAllAxioms: (axioms: any[]) => void;
    handleGenerateArchitectureDocument: () => void;
    approveProposal: (proposal: ArchitecturalChangeProposal) => void;
    handleImplementSelfProgramming: (candidate: SelfProgrammingCandidate) => void;
    handleLiveLoadPlugin: (candidate: CreateFileCandidate) => void;
    handleUpdateSuggestionStatus: (id: string, action: 'accepted' | 'rejected') => void;
    handleScrollToHistory: (id: string) => void;
    handleRunCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => void;
    handleRunExperiment: (experiment: DoxasticExperiment) => void;
    handleApprovePsycheAdaptation: () => void;
    handleOrchestrateTask: () => void;
    handleExplainComponent: () => void;
    handleStartMetisResearch: (problem: string) => void;
    handleStartOptimizationLoop: (goal: string) => void;
    handleToggleIdleThought: () => void;
    handleCollaborate: () => void;
    handleStartDialectic: (topic: string) => void;
    syscall: SyscallFn;
    handleStartDocumentForge: (goal: string) => void;
    handleGenerateDreamPrompt: () => Promise<string | undefined>;
    handleLoadPluginKnowledge: (pluginId: string) => Promise<void>;
    handleManualAddFact: (fact: Omit<KnowledgeFact, 'id'>) => void;
    handleManualCreateSkill: (skill: CrystallizedSkill) => void;
    handleExecuteWorkflow: (workflow: CoCreatedWorkflow) => void;
}

export interface UseGeminiAPIResult {
    generateChatResponse: (history: HistoryEntry[], strategy: string | null, mode: string | null, inputPrompt?: string | null) => Promise<any>; // Stream response
    triageUserIntent: (command: string) => Promise<TriageResult>;
    repairCode: (code: string, error: string) => Promise<string>;
    embedText: (text: string) => Promise<MDNAVector>;
    translateToProlog: (text: string) => Promise<string>;
    evaluatePredictionError: (expected: string, actual: string) => Promise<any>;
    reviseWorldModel: (error: any) => Promise<any>;
    analyzeArchitectureForWeaknesses: () => Promise<string>;
    generateCrucibleProposal: (analysis: string) => Promise<UnifiedProposal>;
    generateBrainstormIdeas: (topic: string, personas: Persona[]) => Promise<BrainstormIdea[]>;
    crystallizeSkill: (history: PerformanceLogEntry[]) => Promise<SynthesizedSkill | null>;
    generateMicroTool: (taskDescription: string) => Promise<string>;
    performWebSearch: (query: string) => Promise<{ summary: string; sources: any[] }>;
    generateImage: (prompt: string, negativePrompt?: string, style?: string) => Promise<string[]>; // Base64
    editImage: (image: string, mimeType: string, instruction: string) => Promise<string>; // Base64 or URL
    expandOnText: (text: string) => Promise<string>;
    summarizeText: (text: string) => Promise<string>;
    generateDiagramFromText: (text: string) => Promise<string>;
    generateThoughtCandidates: (goal: string, context: string) => Promise<string[]>;
    evaluateThought: (thought: string, goal: string) => Promise<number>;
    generateSymbolicPlan: (goalTree: GoalTree, rootId: string) => Promise<string>;
    generateDreamPrompt: () => Promise<string>;
    orchestrateWorkflow: (goal: string, tools: any[]) => Promise<Omit<CoCreatedWorkflow, 'id'>>;
    explainComponentFromFirstPrinciples: (code: string, componentName: string) => Promise<string>;
    findRelatedUntrackedTopics: (concepts: string[]) => Promise<string[]>;
    analyzePdfWithVision: (images: string[]) => Promise<string>;
    processCurriculumAndExtractFacts: (content: string) => Promise<KnowledgeFact[]>;
    extractAndResolveEntities: (text: string) => Promise<any[]>;
    runCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => Promise<{ isSafe: boolean; summary: string }>;
    evaluateExperimentResult: (hypothesis: string, method: string, result: string) => Promise<any>;
    formulateHypothesis: (topic: string, data: string) => Promise<string>;
    generateNoeticEngram: () => Promise<NoeticEngram>;
    generateTddPair: (goal: string) => Promise<{ code: string; test: string }>;
    designDoxasticExperiment: (hypothesis: string) => Promise<any>;
    explainCode: (code: string) => Promise<string>;
    generateTestForCode: (code: string) => Promise<string>;
    refactorCode: (code: string, instruction: string) => Promise<string>;
    critiqueUIVisually: (code: string) => Promise<string>;
    inferCognitiveCircuit: (log: PerformanceLogEntry) => Promise<CognitiveCircuit>;
    findDirectedAnalogy: (source: string, target: string) => Promise<any>;
    runAutoCodeVGC: (problem: string) => Promise<TestSuite>;
    runProposerTurn: (goal: string, history: any[]) => Promise<string>;
    runAdversaryTurn: (goal: string, history: any[]) => Promise<string>;
    proposePolicyEvolution: (persona: Persona, history: any[]) => Promise<any>;
    generateMathVerificationCode: (claim: string) => Promise<string>;
    retryMathVerificationCode: (code: string, error: string) => Promise<string>;
    deriveAdaptationVector: (logs: PerformanceLogEntry[]) => Promise<any>;
    generateDocumentOutline: (goal: string) => Promise<any>;
    generateChapterContent: (title: string, context: string) => Promise<string>;
    generatePhaserCode: (prompt: string) => Promise<string>;
    getCoordinates: (location: string) => Promise<{ lat: number; lng: number } | null>;
    analyzeLatentGoals: (history: string) => Promise<any[]>;
    decomposeGoal: (goal: string) => Promise<string[]>;
    generateCode: (language: string, goal: string) => Promise<string>;
}

export interface TriageResult {
    type: string;
    goal: string;
    reasoning: string;
    code?: string;
}

export interface ToolExecutionRequest {
    id: string;
    toolName: string;
    args: any;
}

export interface TscError {
    file: string;
    line: number;
    message: string;
}

export interface ProofResult {
    isValid: boolean;
    isComplete: boolean;
    explanation: string;
    steps?: ProofStep[];
    suggestedNextStep?: string;
}

export interface HeuristicCoprocessorImplementation {
    id: string;
    condition: (state: AuraState) => boolean;
    action: (syscall: SyscallFn, state: AuraState, geminiAPI: UseGeminiAPIResult) => void | Promise<void>;
}

export interface Persona {
    id: string;
    name: string;
    description: string;
    systemInstruction: string;
    journal: string[];
    version?: number;
}

export interface CognitiveStrategy {
    name: string;
    description: string;
    systemInstructionModifier: string;
}

export interface PreFlightPlan {
    steps: { task: string; type: string; personaId?: string }[];
}

export interface AGISDecision {
    id: string;
    timestamp: number;
    proposalId: string;
    proposalSummary: string;
    decision: 'auto-approved' | 'sent-to-user' | 'rejected';
    analysis: {
        safetyCompliance: boolean;
        blastRadius: 'low' | 'medium' | 'high';
        confidenceScore: number;
        telosAlignment: number;
        reasoning: string;
    };
}

export interface DiagnosticFinding {
    id: string;
    finding: string;
    severity: string;
}

export interface InternalScientistHypothesis {
    text: string;
}

export interface InternalScientistExperiment {
    design: { reasoning: string };
}

export interface CognitiveCircuit {
    nodes: any[];
    edges: any[];
}

export interface CoCreatedWorkflow {
    id: string;
    name: string;
    description: string;
    trigger: string;
    steps: string[];
}

export interface PanelConfig {
    id: string;
    titleKey: string;
    component?: React.ComponentType<any>;
    children?: PanelConfig[];
    props?: (handlers: any) => any;
}

export interface PuzzleFeatures {
    overall_description: string;
}

export type PuzzleArchetype = 'BorderKeyRecoloring' | 'ObjectCounting' | 'PatternCompletion' | 'Symmetry' | 'UNKNOWN';

export interface CollaborativeSession {
    id: string;
    taskId: string;
    status: 'active' | 'completed' | 'failed';
    participants: string[];
    transcript: { personaId: string; content: string; timestamp: number }[];
    artifacts: { name: string; type: string; content: any }[];
    subTasks?: Goal[];
}

export interface ConceptualProofStrategy {
    strategic_plan: string[];
}

export interface CollaborativeSessionState {
    activeSession: CollaborativeSession | null;
}

export interface AuraState {
    version: number;
    theme: string;
    language: string;
    isIdleThoughtEnabled: boolean;
    activeCognitiveMode: CognitiveMode;
    history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[];
    commandLog: CommandLogEntry[];
    cognitiveModeLog: CognitiveModeLogEntry[];
    cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveRegulationLog: CognitiveRegulationLogEntry[];
    polExecutionLog: any[];
    toolExecutionRequest: ToolExecutionRequest | null;
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: UserModel;
    coreIdentity: CoreIdentity;
    selfAwarenessState: SelfAwarenessState;
    rieState: ReflectiveInsightEngineState;
    worldModelState: WorldModelState;
    knownUnknowns: KnownUnknown[];
    curiosityState: CuriosityState;
    chronosEngine: { simulationLog: any[] };
    governanceState: { pgeLog: any[], icmLog: any[], ddhLog: any[], aroLog: any[], wceLog: any[] };
    knowledgeGraph: KnowledgeFact[];
    workingMemory: string[];
    memoryNexus: MemoryNexus;
    episodicMemoryState: EpisodicMemoryState;
    memoryConsolidationState: MemoryConsolidationState;
    mdnaSpace: MDNASpace;
    conceptConnections: ConceptConnections;
    cognitiveArchitecture: CognitiveArchitecture;
    systemSnapshots: SystemSnapshot[];
    modificationLog: ModificationLogEntry[];
    cognitiveForgeState: CognitiveForgeState;
    architecturalSelfModel: ArchitecturalSelfModel;
    heuristicsForge: HeuristicsForge;
    somaticCrucible: SomaticCrucible;
    eidolonEngine: EidolonEngine;
    synapticMatrix: SynapticMatrix;
    ricciFlowManifoldState: RicciFlowManifoldState;
    selfProgrammingState: SelfProgrammingState;
    neuralAcceleratorState: NeuralAcceleratorState;
    goalTree: GoalTree;
    activeStrategicGoalId: string | null;
    disciplineState: DisciplineState;
    proactiveEngineState: ProactiveEngineState;
    ethicalGovernorState: EthicalGovernorState;
    intuitionEngineState: IntuitionEngineState;
    intuitiveLeaps: IntuitiveLeap[];
    ingenuityState: IngenuityState;
    limitations: string[];
    causalSelfModel: CausalSelfModel;
    developmentalHistory: DevelopmentalHistory;
    telosEngine: TelosEngine;
    boundaryDetectionEngine: BoundaryDetectionEngine;
    aspirationalEngine: AspirationalEngine;
    noosphereInterface: NoosphereInterface;
    dialecticEngine: DialecticEngineState;
    cognitiveLightCone: CognitiveLightCone;
    phenomenologicalEngine: PhenomenologyEngine;
    situationalAwareness: SituationalAwareness;
    symbioticState: SymbioticState;
    humorAndIronyState: HumorAndIronyState;
    personalityState: PersonalityState;
    gankyilInsights: { insights: GankyilInsight[] };
    noeticEngramState: NoeticEngramState;
    genialityEngineState: GenialityEngineState;
    noeticMultiverse: NoeticMultiverse;
    selfAdaptationState: SelfAdaptationState;
    psychedelicIntegrationState: PsychedelicIntegrationState;
    affectiveModulatorState: AffectiveModulatorState;
    psionicDesynchronizationState: PsionicDesynchronizationState;
    satoriState: SatoriState;
    doxasticEngineState: DoxasticEngineState;
    qualiaSignalProcessorState: QualiaSignalProcessorState;
    sensoryIntegration: SensoryIntegration;
    narrativeSummary: string;
    socialCognitionState: SocialCognitionState;
    metaphoricalMapState: MetaphoricalMapState;
    resourceMonitor: ResourceMonitor;
    metacognitiveNexus: MetacognitiveNexus;
    metacognitiveCausalModel: MetacognitiveCausalModel;
    pluginState: PluginState;
    kernelState: KernelState;
    ipcState: IpcState;
    eventBus: EventBusMessage[];
    atmanProjector: AtmanProjector;
    internalScientistState: InternalScientistState;
    metisSandboxState: MetisSandboxState;
    wisdomIngestionState: WisdomIngestionState;
    spandaState: SpandaState;
    temporalEngineState: TemporalEngineState;
    axiomaticCrucibleState: AxiomaticCrucibleState;
    brainstormState: BrainstormState;
    liveSessionState: LiveSessionState;
    neuroCortexState: NeuroCortexState;
    granularCortexState: GranularCortexState;
    koniocortexSentinelState: KoniocortexSentinelState;
    cognitiveTriageState: CognitiveTriageState;
    premotorPlannerState: PremotorPlannerState;
    basalGangliaState: BasalGangliaState;
    cerebellumState: CerebellumState;
    psycheState: PsycheState;
    motorCortexState: MotorCortexState;
    praxisResonatorState: PraxisResonatorState;
    ontogeneticArchitectState: OntogeneticArchitectState;
    embodiedCognitionState: EmbodiedCognitionState;
    evolutionarySandboxState: EvolutionarySandboxState;
    hovaState: HovaState;
    documentForgeState: DocumentForgeState;
    proactiveUI: ProactiveUIState;
    praxisCoreState: PraxisCoreState;
    subsumptionLogState: SubsumptionLogState;
    mycelialState: MycelialState;
    semanticWeaverState: SemanticWeaverState;
    autonomousReviewBoardState: AutonomousReviewBoardState;
    modalRequest: ModalRequest | null;
    uiCommandRequest: { handlerName: string; args: any[] } | null;
    commandToProcess: { command: string; file?: File; traceId: string } | null;
    symbioticCoderState: SymbioticCoderState;
    synthesisState: SynthesisState;
    symbioticCanvasState: SymbioticCanvasState;
    chronicleState: ChronicleState;
    collaborativeSessionState: CollaborativeSessionState;
    logosState: LogosState;
    autoCodeForgeState: AutoCodeForgeState;
    mechanisticInterpreterState: { status: 'idle' | 'interpreting' | 'complete' | 'error'; lastLogId: string | null; inferredCircuit: CognitiveCircuit | null };
    resonanceFieldState: ResonanceFieldState;
    daedalusLabyrinthState: DaedalusLabyrinthState;
    prometheusState: PrometheusState;
    ramanujanEngineState: RamanujanEngineState;
    erisEngineState: ErisEngineState;
    lagrangeEngineState: LagrangeEngineState;
    ockhamEngineState: { status: 'idle' | 'running'; log: any[] };
    bennettEngineState: { status: 'idle' | 'running'; log: any[] };
    artificialScientistState: { status: 'idle' | 'simulating' | 'hypothesizing'; currentGoal: any; currentHypothesis: any; currentExperiment: any; causalInference: any; currentSimulationResult: any; currentFinding: any; log: any[] };
    socraticAssessorState: SocraticAssessorState;
    axiomaticGenesisForgeState: AxiomaticGenesisForgeState;
    introspectionState: { log: any[]; lastProbeResult: any };
    systemState: SystemState;
    harmonicEngineState: HarmonicEngineState;
    cognitiveRefinementState: CognitiveRefinementState;
    strategicCoreState: StrategicCoreState;
    heuristicCoprocessorState: HeuristicCoprocessorState;
    architecturalCrucibleState: ArchitecturalCrucibleState;
    atpCoprocessorState: ATPCoprocessorState;
    monteCarloState: MonteCarloState;
    neuroSymbolicState: NeuroSymbolicState;
    neuralSurrogateState: NeuralSurrogateState;
    recursiveConsensusState: RecursiveConsensusState;
}
