
import { PanelConfig } from '../types';
import { VFSExplorerPanel } from './VFSExplorerPanel';
import { VFSManagerPanel } from './VFSManagerPanel';
import { DocumentForgePanel } from './DocumentForgePanel';
import { PluginManagerPanel } from './PluginManagerPanel';
import { CognitiveForgePanel } from './CognitiveForgePanel';
import { SelfEngineeringPanel } from './SelfEngineeringPanel';
import { ReinforcementLearningPanel } from './ReinforcementLearningPanel';
import { HeuristicsForgePanel } from './HeuristicsForgePanel';
import { SymbioticCoderPanel } from './SymbioticCoderPanel';
import { AutoCodeForgePanel } from './AutoCodeForgePanel';
import { PolyglotRuntimesPanel } from './PolyglotRuntimesPanel';
import { TerminalPanel } from './TerminalPanel';
import { TypeScriptCompilerPanel } from './TypeScriptCompilerPanel';
import { WasmRuntimePanel } from './WasmRuntimePanel';
import { DataSuitePanel, ComputerVisionPanel, ModelRuntimePanel, CodeFormatterPanel, AdvancedVisualizationPanel, GameSandboxPanel, GeospatialPanel, SpeechSynthesisPanel } from './SDKPanels';
import { MonteCarloPanel } from './MonteCarloPanel';
import { HardwarePrimitivesPanel } from './HardwarePrimitivesPanel'; 
import { NeuroSymbolicPanel } from './NeuroSymbolicPanel';
import { NeuralSurrogatePanel } from './NeuralSurrogatePanel';
import { RecursiveConsensusPanel } from './RecursiveConsensusPanel';
import { CrystallizerPanel } from './CrystallizerPanel';
import { SpecialModesPanel } from './SpecialModesPanel';
import { CoreControlPanel } from './CoreControlPanel';

// Newly imported panels
import { UnifiedMemoryPanel } from './UnifiedMemoryPanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { ProofLandscapeExplorer } from './ProofLandscapeExplorer';
import { IdeaCartographerPanel } from './IdeaCartographerPanel';
import { AuraMonitorPanel } from './AuraMonitorPanel';
import { SystemLogsPanel } from './SystemLogsPanel';
import { SemanticWeaverPanel } from './SemanticWeaverPanel';
import { MycelialNetworkPanel } from './MycelialNetworkPanel';
import { AgencyOfCoCreationPanel } from './AgencyOfCoCreationPanel';
import { AgencyOfInquiryPanel } from './AgencyOfInquiryPanel';
import { FuturesCouncilPanel } from './FuturesCouncilPanel';
import { StrategicCouncilPanel } from './StrategicCouncilPanel';
import { SciFiAiCouncilPanel } from './SciFiAiCouncilPanel';
import { BusinessNetworkPanel } from './BusinessNetworkPanel';
import { MarketAnalyzerPanel } from './MarketAnalyzerPanel';
import { MortgageCalculatorPanel } from './MortgageCalculatorPanel';
import { InvestmentCalculatorPanel } from './InvestmentCalculatorPanel';
import { NeighborhoodExplorerPanel } from './NeighborhoodExplorerPanel';
import { AffordabilityCalculatorPanel } from './AffordabilityCalculatorPanel';
import { ListingGeneratorPanel } from './ListingGeneratorPanel';
import { HomeBuyingGuidePanel } from './HomeBuyingGuidePanel';
import { ErisEnginePanel } from './ErisEnginePanel';
import { RicciFlowManifoldPanel } from './RicciFlowManifoldPanel';
import { InternalScientistPanel } from './InternalScientistPanel';

// Even MORE imported panels (Guilds, Manuals, Systems)
import { SymbiosisPanel } from './SymbiosisPanel';
import { EpistemicBoundaryPanel } from './EpistemicBoundaryPanel';
import { SelfDevelopmentPanel } from './SelfDevelopmentPanel';
import { EngineeringGuildPanel } from './EngineeringGuildPanel';
import { AcademyOfPedagogyPanel } from './AcademyOfPedagogyPanel';
import { AtelierPanel } from './AtelierPanel';
import { AgoraPanel } from './AgoraPanel';
import { LyceumPanel } from './LyceumPanel';
import { ScienceAgencyPanel } from './ScienceAgencyPanel';
import { SoftwareAgencyPanel } from './SoftwareAgencyPanel';
import { SystemInfoPanel } from './SystemInfoPanel';
import { PersonaManualPanel } from './PersonaManualPanel';
import { VFS_Engineer_Manual } from './VFS_Engineer_Manual';
import { CodebaseIntelligencePanel } from './CodebaseIntelligencePanel';

// Revived Panels
import { CodemodRunnerPanel } from './CodemodRunnerPanel';
import { LintingResultsPanel } from './LintingResultsPanel';
import { PhysicsSimulatorsPanel } from './PhysicsSimulatorsPanel';
import { ATPCoprocessorPanel } from './ATPCoprocessorPanel';
import { LagrangeEnginePanel } from './LagrangeEnginePanel';
import { RamanujanEnginePanel } from './RamanujanEnginePanel';

// Main Control Deck Layout
export const mainControlDeckLayout: PanelConfig[] = [
    {
        id: 'core_controls_group',
        titleKey: 'coreActionsGroup',
        children: [
             { id: 'coreControls', titleKey: 'coreActions', component: CoreControlPanel },
        ]
    },
    {
        id: 'system_engineering_group',
        titleKey: 'systemEngineeringGroup',
        children: [
             { id: 'vfsExplorer', titleKey: 'vfsExplorer', component: VFSExplorerPanel },
             { id: 'vfsManager', titleKey: 'vfsManager', component: VFSManagerPanel },
             { id: 'pluginManager', titleKey: 'pluginManager', component: PluginManagerPanel },
             { id: 'documentForge', titleKey: 'documentForge', component: DocumentForgePanel },
             { id: 'selfDevelopment', titleKey: 'selfDevelopment', component: SelfDevelopmentPanel },
        ]
    },
    {
        id: 'software_engineering_group',
        titleKey: 'softwareEngineeringGroup',
        children: [
            { id: 'terminal', titleKey: 'terminal', component: TerminalPanel },
            { id: 'symbioticCoder', titleKey: 'symbioticCoder', component: SymbioticCoderPanel },
            { id: 'autoCodeForge', titleKey: 'autoCodeForge', component: AutoCodeForgePanel },
            { id: 'softwareAgency', titleKey: 'softwareAgency', component: SoftwareAgencyPanel },
            { id: 'polyglotRuntimes', titleKey: 'polyglotRuntimes', component: PolyglotRuntimesPanel },
            { id: 'typeScriptCompiler', titleKey: 'typeScriptCompiler', component: TypeScriptCompilerPanel },
            { id: 'wasmRuntime', titleKey: 'wasmRuntime', component: WasmRuntimePanel },
            { id: 'codebaseIntelligence', titleKey: 'codebaseIntelligence', component: CodebaseIntelligencePanel },
            { id: 'codemodRunner', titleKey: 'codemodRunner', component: CodemodRunnerPanel },
            { id: 'lintingResults', titleKey: 'lintingResults', component: LintingResultsPanel },
        ]
    }
];

// Advanced Controls Layout (AuraOS)
export const advancedControlsLayout: PanelConfig[] = [
    {
        id: 'advanced_cognition_group',
        titleKey: 'advancedCognitionGroup',
        children: [
             { id: 'specialModes', titleKey: 'specialModes', component: SpecialModesPanel },
             { id: 'symbiosis', titleKey: 'symbiosis', component: SymbiosisPanel },
             { id: 'crystallizer', titleKey: 'crystallizer', component: CrystallizerPanel },
             { id: 'recursiveConsensus', titleKey: 'recursiveConsensus', component: RecursiveConsensusPanel },
             { id: 'monteCarlo', titleKey: 'monteCarlo', component: MonteCarloPanel },
             { id: 'neuroSymbolic', titleKey: 'neuroSymbolic', component: NeuroSymbolicPanel }, 
             { id: 'neuralSurrogate', titleKey: 'neuralSurrogate', component: NeuralSurrogatePanel },
             { id: 'cognitiveForge', titleKey: 'cognitiveForge', component: CognitiveForgePanel },
             { id: 'selfEngineering', titleKey: 'selfEngineering', component: SelfEngineeringPanel },
             { id: 'reinforcementLearning', titleKey: 'reinforcementLearning', component: ReinforcementLearningPanel },
             { id: 'heuristicsForge', titleKey: 'heuristicsForge', component: HeuristicsForgePanel },
        ]
    },
    {
        id: 'memory_and_knowledge_group',
        titleKey: 'memoryAndKnowledgeGroup',
        children: [
            { id: 'unifiedMemory', titleKey: 'unifiedMemory', component: UnifiedMemoryPanel },
            { id: 'strategicPlanner', titleKey: 'strategicPlanner', component: StrategicPlannerPanel },
            { id: 'proofLandscape', titleKey: 'proofLandscape', component: ProofLandscapeExplorer },
            { id: 'ideaCartographer', titleKey: 'ideaCartographer', component: IdeaCartographerPanel },
            { id: 'epistemicBoundary', titleKey: 'epistemicBoundary', component: EpistemicBoundaryPanel },
        ]
    },
    {
        id: 'system_monitoring_group',
        titleKey: 'systemMonitoringGroup',
        children: [
            { id: 'auraMonitor', titleKey: 'auraMonitor', component: AuraMonitorPanel },
            { id: 'systemLogs', titleKey: 'systemLogs', component: SystemLogsPanel },
            { id: 'semanticWeaver', titleKey: 'semanticWeaver', component: SemanticWeaverPanel },
            { id: 'mycelialNetwork', titleKey: 'mycelialNetwork', component: MycelialNetworkPanel },
        ]
    },
    {
        id: 'agency_hubs_group',
        titleKey: 'agencyHubsGroup',
        children: [
            { id: 'agencyCoCreation', titleKey: 'agencyCoCreation', component: AgencyOfCoCreationPanel },
            { id: 'agencyInquiry', titleKey: 'agencyInquiry', component: AgencyOfInquiryPanel },
            { id: 'futuresCouncil', titleKey: 'futuresCouncil', component: FuturesCouncilPanel },
            { id: 'strategicCouncil', titleKey: 'strategicCouncil', component: StrategicCouncilPanel },
            { id: 'sciFiCouncil', titleKey: 'sciFiCouncil', component: SciFiAiCouncilPanel },
            { id: 'businessNetwork', titleKey: 'businessNetwork', component: BusinessNetworkPanel },
        ]
    },
    {
        id: 'specialist_guilds_group',
        titleKey: 'specialistGuildsGroup',
        children: [
            { id: 'engineeringGuild', titleKey: 'engineeringGuild', component: EngineeringGuildPanel },
            { id: 'academyPedagogy', titleKey: 'academyPedagogy', component: AcademyOfPedagogyPanel },
            { id: 'atelier', titleKey: 'atelier', component: AtelierPanel },
            { id: 'agora', titleKey: 'agora', component: AgoraPanel },
            { id: 'lyceum', titleKey: 'lyceum', component: LyceumPanel },
            { id: 'scienceAgency', titleKey: 'scienceAgency', component: ScienceAgencyPanel },
        ]
    },
    {
        id: 'real_estate_suite_group',
        titleKey: 'realEstateSuiteGroup',
        children: [
            { id: 'marketAnalyzer', titleKey: 'marketAnalyzer', component: MarketAnalyzerPanel },
            { id: 'mortgageCalculator', titleKey: 'mortgageCalculator', component: MortgageCalculatorPanel },
            { id: 'investmentCalculator', titleKey: 'investmentCalculator', component: InvestmentCalculatorPanel },
            { id: 'neighborhoodExplorer', titleKey: 'neighborhoodExplorer', component: NeighborhoodExplorerPanel },
            { id: 'affordabilityCalculator', titleKey: 'affordabilityCalculator', component: AffordabilityCalculatorPanel },
            { id: 'listingGenerator', titleKey: 'listingGenerator', component: ListingGeneratorPanel },
            { id: 'homeBuyingGuide', titleKey: 'homeBuyingGuide', component: HomeBuyingGuidePanel },
        ]
    },
    {
        id: 'experimental_engines_group',
        titleKey: 'experimentalEnginesGroup',
        children: [
            { id: 'erisEngine', titleKey: 'erisEngine', component: ErisEnginePanel },
            { id: 'ricciFlow', titleKey: 'ricciFlow', component: RicciFlowManifoldPanel },
            { id: 'internalScientist', titleKey: 'internalScientist', component: InternalScientistPanel },
            { id: 'atpCoprocessor', titleKey: 'atpCoprocessor', component: ATPCoprocessorPanel },
            { id: 'lagrangeEngine', titleKey: 'lagrangeEngine', component: LagrangeEnginePanel },
            { id: 'ramanujanEngine', titleKey: 'ramanujanEngine', component: RamanujanEnginePanel },
        ]
    },
    {
        id: 'data_and_sdk_group',
        titleKey: 'dataAndSdkGroup',
        children: [
             { id: 'hardwarePrimitives', titleKey: 'hardwarePrimitives', component: HardwarePrimitivesPanel },
             { id: 'dataSuite', titleKey: 'dataSuite', component: DataSuitePanel },
             { id: 'computerVision', titleKey: 'computerVision', component: ComputerVisionPanel },
             { id: 'modelRuntime', titleKey: 'modelRuntime', component: ModelRuntimePanel },
             { id: 'codeFormatter', titleKey: 'codeFormatter', component: CodeFormatterPanel },
             { id: 'advancedVis', titleKey: 'advancedVis', component: AdvancedVisualizationPanel },
             { id: 'gameSandbox', titleKey: 'gameSandbox', component: GameSandboxPanel },
             { id: 'physicsSimulators', titleKey: 'physicsSimulators', component: PhysicsSimulatorsPanel },
             { id: 'geospatial', titleKey: 'geospatial', component: GeospatialPanel },
             { id: 'speechSynthesis', titleKey: 'speechSynthesis', component: SpeechSynthesisPanel },
        ]
    },
    {
        id: 'documentation_group',
        titleKey: 'documentationGroup',
        children: [
            { id: 'systemInfo', titleKey: 'systemInfo', component: SystemInfoPanel },
            { id: 'personaManual', titleKey: 'personaManual', component: PersonaManualPanel },
            { id: 'vfsManual', titleKey: 'vfsManual', component: VFS_Engineer_Manual },
        ]
    }
];
