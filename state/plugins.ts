
// state/plugins.ts
import { Plugin, KnowledgeFact } from '../types.ts';
import { Type } from '@google/genai';

// Static imports for plugins that don't have heavy data payloads or are needed immediately
import { foundationalAxioms } from './knowledge/foundationalAxioms.ts';
import { heuristicsPlugins } from './knowledge/heuristics.ts';
import { personaPlugins } from './knowledge/personas.ts';
import { cognitiveStrategyPlugins } from './knowledge/cognitiveStrategies.ts';
import { heuristicCoprocessorPlugins } from './knowledge/heuristicCoprocessors.ts';

// Import all knowledge modules to get their lengths for metadata
import { aestheticsKnowledge } from './knowledge/aesthetics.ts';
import { algebraicGeometryKnowledge } from './knowledge/algebraicGeometry.ts';
import { anthropologyKnowledge } from './knowledge/anthropology.ts';
import { artKnowledge } from './knowledge/art.ts';
import { astronomyKnowledge } from './knowledge/astronomy.ts';
import { backendImplementationKnowledge } from './knowledge/backendImplementation.ts';
import { biologyKnowledge } from './knowledge/biology.ts';
import { businessAndFinanceKnowledge } from './knowledge/businessAndFinance.ts';
import { chaosDynamicsKnowledge } from './knowledge/chaosDynamics.ts';
import { chemistryKnowledge } from './knowledge/chemistry.ts';
import { classicalMechanicsKnowledge } from './knowledge/classicalMechanics.ts';
import { cloudInfrastructureKnowledge } from './knowledge/cloudInfrastructure.ts';
import { cloudServicesKnowledge } from './knowledge/cloudServices.ts';
import { cognitiveScienceKnowledge } from './knowledge/cognitiveScience.ts';
import { comparativeNeuroanatomyKnowledge } from './knowledge/comparativeNeuroanatomy.ts';
import { complexAnalysisKnowledge } from './knowledge/complexAnalysis.ts';
import { complexSystemsKnowledge } from './knowledge/complexSystems.ts';
import { computerScienceKnowledge } from './knowledge/computerScience.ts';
import { dataScienceKnowledge } from './knowledge/dataScience.ts';
import { dataVisualizationKnowledge } from './knowledge/dataVisualization.ts';
import { databaseManagementKnowledge } from './knowledge/databaseManagement.ts';
import { designPatternsKnowledge } from './knowledge/designPatterns.ts';
import { devopsKnowledge } from './knowledge/devops.ts';
import { digitalAssetManagementKnowledge } from './knowledge/digitalAssetManagement.ts';
import { ecologyKnowledge } from './knowledge/ecology.ts';
import { economicsKnowledge } from './knowledge/economics.ts';
import { engineeringDesignKnowledge } from './knowledge/engineeringDesign.ts';
import { entrepreneurNetworkData } from './knowledge/entrepreneurNetwork.ts';
import { ergodicTheoryKnowledge } from './knowledge/ergodicTheory.ts';
import { ethicsKnowledge } from './knowledge/ethics.ts';
import { fluidDynamicsKnowledge } from './knowledge/fluidDynamics.ts';
import { fourierAnalysisKnowledge } from './knowledge/fourierAnalysis.ts';
import { functionalAnalysisKnowledge } from './knowledge/functionalAnalysis.ts';
import { gameTheoryKnowledge } from './knowledge/gameTheory.ts';
import { gardeningKnowledge } from './knowledge/gardening.ts';
import { geneticsKnowledge } from './knowledge/genetics.ts';
import { geologyKnowledge } from './knowledge/geology.ts';
import { historyKnowledge } from './knowledge/history.ts';
import { homeImprovementKnowledge } from './knowledge/homeImprovement.ts';
import { installedSDKsKnowledge } from './knowledge/installedSDKs.ts';
import { interiorDesignKnowledge } from './knowledge/interiorDesign.ts';
import { intuitionisticLogicKnowledge } from './knowledge/intuitionisticLogic.ts';
import { jestVitestKnowledge } from './knowledge/jestVitest.ts';
import { leanKnowledge } from './knowledge/lean.ts';
import { literaryTheoryKnowledge } from './knowledge/literaryTheory.ts';
import { machineLearningKnowledge } from './knowledge/machineLearning.ts';
import { marketAnalysisKnowledge } from './knowledge/marketAnalysis.ts';
import { mathjsKnowledge } from './knowledge/mathjs.ts';
import { mathlibCoreKnowledge } from './knowledge/mathlibCore.ts';
import { musicTheoryKnowledge } from './knowledge/musicTheory.ts';
import { numberTheoryKnowledge } from './knowledge/numberTheory.ts';
import { numericjsKnowledge } from './knowledge/numericjs.ts';
import { organizationalPsychologyKnowledge } from './knowledge/organizationalPsychology.ts';
import { pdeKnowledge } from './knowledge/pde.ts';
import { pedagogyKnowledge } from './knowledge/pedagogy.ts';
import { personalFinanceKnowledge } from './knowledge/personalFinance.ts';
import { philosophyOfMindKnowledge } from './knowledge/philosophyOfMind.ts';
import { physicsKnowledge } from './knowledge/physics.ts';
import { pluginArchitectureKnowledge } from './knowledge/pluginArchitecture.ts';
import { probabilityTheoryKnowledge } from './knowledge/probabilityTheory.ts';
import { productManagementKnowledge } from './knowledge/productManagement.ts';
import { propertyLawKnowledge } from './knowledge/propertyLaw.ts';
import { psychologyAndCognitiveBiasesKnowledge } from './knowledge/psychology.ts';
import { pythonKnowledge } from './knowledge/python.ts';
import { reactKnowledge } from './knowledge/react.ts';
import { realEstateKnowledge } from './knowledge/realEstate.ts';
import { securityKnowledge } from './knowledge/security.ts';
import { selfCohesionKnowledge } from './knowledge/selfCohesion.ts';
import { sociologyKnowledge } from './knowledge/sociology.ts';
import { softwareDesignKnowledge } from './knowledge/softwareDesign.ts';
import { stemKnowledge } from './knowledge/stem.ts';
import { strategicForecastingKnowledge } from './knowledge/strategicForecasting.ts';
import { technicalWritingKnowledge } from './knowledge/technicalWriting.ts';
import { teslaKnowledge } from './knowledge/tesla.ts';
import { teslaAetherKnowledge } from './knowledge/teslaAether.ts';
import { topologyKnowledge } from './knowledge/topology.ts';
import { typescriptKnowledge } from './knowledge/typescript.ts';
import { urbanPlanningKnowledge } from './knowledge/urbanPlanning.ts';
import { userModelingKnowledge } from './knowledge/userModeling.ts';
import { userOnboardingKnowledge } from './knowledge/userOnboarding.ts';
import { uxPrinciplesKnowledge } from './knowledge/uxPrinciples.ts';
import { vigyanBhairavTantraKnowledge } from './knowledge/vigyanBhairavTantra.ts';
import { vlmArchitectureKnowledge } from './knowledge/vlmArchitecture.ts';
import { webServersKnowledge } from './knowledge/webServers.ts';
import { workflowDesignKnowledge } from './knowledge/workflowDesign.ts';


// Helper to cast static knowledge
const asKnowledge = (k: Omit<KnowledgeFact, 'id' | 'source'>[]): KnowledgeFact[] => k as any;

export const plugins: Plugin[] = [
  // --- HARMONIC ENGINE PLUGINS ---
  {
    id: 'coprocessor_harmonic_engine',
    name: 'plugin_coprocessor_harmonic_engine_name',
    description: 'plugin_coprocessor_harmonic_engine_desc',
    type: 'COPROCESSOR',
    status: 'enabled',
    defaultStatus: 'enabled',
  },
  {
    id: 'tool_harmonic_engine_solve',
    name: 'plugin_tool_harmonic_engine_solve_name',
    description: 'plugin_tool_harmonic_engine_solve_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'harmonic_engine_solve',
      description: 'Solves a potential field problem using harmonic functions. Ideal for pathfinding, physics simulation (heat, electrostatics), and abstract optimization.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          problem_description: { type: Type.STRING, description: 'A natural language description of the problem.' },
          dimensionality: { type: Type.NUMBER, description: 'The number of dimensions for the problem space.' },
          domain_definition: { type: Type.STRING, description: 'A description of the problem space.' },
          boundary_conditions: { type: Type.STRING, description: 'A JSON string describing the constraints, obstacles, sources, or sinks.' },
        },
        required: ['problem_description', 'dimensionality', 'boundary_conditions', 'domain_definition'],
      },
    }
  },
  
  // --- KNOWLEDGE PLUGINS (with fact counts) ---
  { id: 'knowledge_aesthetics', name: 'plugin_knowledge_aesthetics_name', description: 'plugin_knowledge_aesthetics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: aestheticsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(aestheticsKnowledge)) },
  { id: 'knowledge_algebraic_geometry', name: 'plugin_knowledge_algebraic_geometry_name', description: 'plugin_knowledge_algebraic_geometry_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: algebraicGeometryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(algebraicGeometryKnowledge)) },
  { id: 'knowledge_anthropology', name: 'plugin_knowledge_anthropology_name', description: 'plugin_knowledge_anthropology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: anthropologyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(anthropologyKnowledge)) },
  { id: 'knowledge_art', name: 'plugin_knowledge_art_name', description: 'plugin_knowledge_art_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: artKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(artKnowledge)) },
  { id: 'knowledge_astronomy', name: 'plugin_knowledge_astronomy_name', description: 'plugin_knowledge_astronomy_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: astronomyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(astronomyKnowledge)) },
  { id: 'knowledge_backend_implementation', name: 'plugin_knowledge_backend_implementation_name', description: 'plugin_knowledge_backend_implementation_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: backendImplementationKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(backendImplementationKnowledge)) },
  { id: 'knowledge_biology', name: 'plugin_knowledge_biology_name', description: 'plugin_knowledge_biology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: biologyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(biologyKnowledge)) },
  { id: 'knowledge_business_finance', name: 'plugin_knowledge_business_finance_name', description: 'plugin_knowledge_business_finance_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: businessAndFinanceKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(businessAndFinanceKnowledge)) },
  { id: 'knowledge_chaos_dynamics', name: 'plugin_knowledge_chaos_dynamics_name', description: 'plugin_knowledge_chaos_dynamics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: chaosDynamicsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(chaosDynamicsKnowledge)) },
  { id: 'knowledge_chemistry', name: 'plugin_knowledge_chemistry_name', description: 'plugin_knowledge_chemistry_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: chemistryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(chemistryKnowledge)) },
  { id: 'knowledge_classical_mechanics', name: 'plugin_knowledge_classical_mechanics_name', description: 'plugin_knowledge_classical_mechanics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: classicalMechanicsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(classicalMechanicsKnowledge)) },
  { id: 'knowledge_cloud_infrastructure', name: 'plugin_knowledge_cloud_infrastructure_name', description: 'plugin_knowledge_cloud_infrastructure_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: cloudInfrastructureKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(cloudInfrastructureKnowledge)) },
  { id: 'knowledge_cloud_services', name: 'plugin_knowledge_cloud_services_name', description: 'plugin_knowledge_cloud_services_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: cloudServicesKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(cloudServicesKnowledge)) },
  { id: 'knowledge_cognitive_science', name: 'plugin_knowledge_cognitive_science_name', description: 'plugin_knowledge_cognitive_science_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: cognitiveScienceKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(cognitiveScienceKnowledge)) },
  { id: 'knowledge_comparative_neuroanatomy', name: 'plugin_knowledge_comparative_neuroanatomy_name', description: 'plugin_knowledge_comparative_neuroanatomy_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: comparativeNeuroanatomyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(comparativeNeuroanatomyKnowledge)) },
  { id: 'knowledge_complex_analysis', name: 'plugin_knowledge_complex_analysis_name', description: 'plugin_knowledge_complex_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: complexAnalysisKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(complexAnalysisKnowledge)) },
  { id: 'knowledge_complex_systems', name: 'plugin_knowledge_complex_systems_name', description: 'plugin_knowledge_complex_systems_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: complexSystemsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(complexSystemsKnowledge)) },
  { id: 'knowledge_computer_science', name: 'plugin_knowledge_computer_science_name', description: 'plugin_knowledge_computer_science_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: computerScienceKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(computerScienceKnowledge)) },
  { id: 'knowledge_data_science', name: 'plugin_knowledge_data_science_name', description: 'plugin_knowledge_data_science_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: dataScienceKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(dataScienceKnowledge)) },
  { id: 'knowledge_data_visualization', name: 'plugin_knowledge_data_visualization_name', description: 'plugin_knowledge_data_visualization_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: dataVisualizationKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(dataVisualizationKnowledge)) },
  { id: 'knowledge_database_management', name: 'plugin_knowledge_database_management_name', description: 'plugin_knowledge_database_management_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: databaseManagementKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(databaseManagementKnowledge)) },
  { id: 'knowledge_design_patterns', name: 'plugin_knowledge_design_patterns_name', description: 'plugin_knowledge_design_patterns_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: designPatternsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(designPatternsKnowledge)) },
  { id: 'knowledge_devops', name: 'plugin_knowledge_devops_name', description: 'plugin_knowledge_devops_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: devopsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(devopsKnowledge)) },
  { id: 'knowledge_digital_asset_management', name: 'plugin_knowledge_digital_asset_management_name', description: 'plugin_knowledge_digital_asset_management_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: digitalAssetManagementKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(digitalAssetManagementKnowledge)) },
  { id: 'knowledge_ecology', name: 'plugin_knowledge_ecology_name', description: 'plugin_knowledge_ecology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: ecologyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(ecologyKnowledge)) },
  { id: 'knowledge_economics', name: 'plugin_knowledge_economics_name', description: 'plugin_knowledge_economics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: economicsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(economicsKnowledge)) },
  { id: 'knowledge_engineering_design', name: 'plugin_knowledge_engineering_design_name', description: 'plugin_knowledge_engineering_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: engineeringDesignKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(engineeringDesignKnowledge)) },
  { id: 'knowledge_entrepreneur_network', name: 'plugin_knowledge_entrepreneur_network_name', description: 'plugin_knowledge_entrepreneur_network_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: entrepreneurNetworkData.length, knowledgeLoader: () => Promise.resolve(asKnowledge(entrepreneurNetworkData)) },
  { id: 'knowledge_ergodic_theory', name: 'plugin_knowledge_ergodic_theory_name', description: 'plugin_knowledge_ergodic_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: ergodicTheoryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(ergodicTheoryKnowledge)) },
  { id: 'knowledge_ethics', name: 'plugin_knowledge_ethics_name', description: 'plugin_knowledge_ethics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: ethicsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(ethicsKnowledge)) },
  { id: 'knowledge_fluid_dynamics', name: 'plugin_knowledge_fluid_dynamics_name', description: 'plugin_knowledge_fluid_dynamics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: fluidDynamicsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(fluidDynamicsKnowledge)) },
  { id: 'knowledge_fourier_analysis', name: 'plugin_knowledge_fourier_analysis_name', description: 'plugin_knowledge_fourier_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: fourierAnalysisKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(fourierAnalysisKnowledge)) },
  { id: 'knowledge_functional_analysis', name: 'plugin_knowledge_functional_analysis_name', description: 'plugin_knowledge_functional_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: functionalAnalysisKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(functionalAnalysisKnowledge)) },
  { id: 'knowledge_game_theory', name: 'plugin_knowledge_game_theory_name', description: 'plugin_knowledge_game_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: gameTheoryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(gameTheoryKnowledge)) },
  { id: 'knowledge_gardening', name: 'plugin_knowledge_gardening_name', description: 'plugin_knowledge_gardening_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: gardeningKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(gardeningKnowledge)) },
  { id: 'knowledge_genetics', name: 'plugin_knowledge_genetics_name', description: 'plugin_knowledge_genetics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: geneticsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(geneticsKnowledge)) },
  { id: 'knowledge_geology', name: 'plugin_knowledge_geology_name', description: 'plugin_knowledge_geology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: geologyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(geologyKnowledge)) },
  { id: 'knowledge_history', name: 'plugin_knowledge_history_name', description: 'plugin_knowledge_history_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: historyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(historyKnowledge)) },
  { id: 'knowledge_home_improvement', name: 'plugin_knowledge_home_improvement_name', description: 'plugin_knowledge_home_improvement_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: homeImprovementKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(homeImprovementKnowledge)) },
  { id: 'knowledge_installed_sdks', name: 'plugin_knowledge_installed_sdks_name', description: 'plugin_knowledge_installed_sdks_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: installedSDKsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(installedSDKsKnowledge)) },
  { id: 'knowledge_interior_design', name: 'plugin_knowledge_interior_design_name', description: 'plugin_knowledge_interior_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: interiorDesignKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(interiorDesignKnowledge)) },
  { id: 'knowledge_intuitionistic_logic', name: 'plugin_knowledge_intuitionistic_logic_name', description: 'plugin_knowledge_intuitionistic_logic_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: intuitionisticLogicKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(intuitionisticLogicKnowledge)) },
  { id: 'knowledge_jest_vitest', name: 'plugin_knowledge_jest_vitest_name', description: 'plugin_knowledge_jest_vitest_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: jestVitestKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(jestVitestKnowledge)) },
  { id: 'knowledge_lean', name: 'plugin_knowledge_lean_name', description: 'plugin_knowledge_lean_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: leanKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(leanKnowledge)) },
  { id: 'knowledge_literary_theory', name: 'plugin_knowledge_literary_theory_name', description: 'plugin_knowledge_literary_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: literaryTheoryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(literaryTheoryKnowledge)) },
  { id: 'knowledge_machine_learning', name: 'plugin_knowledge_machine_learning_name', description: 'plugin_knowledge_machine_learning_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: machineLearningKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(machineLearningKnowledge)) },
  { id: 'knowledge_market_analysis', name: 'plugin_knowledge_market_analysis_name', description: 'plugin_knowledge_market_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: marketAnalysisKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(marketAnalysisKnowledge)) },
  { id: 'knowledge_mathjs', name: 'plugin_knowledge_mathjs_name', description: 'plugin_knowledge_mathjs_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: mathjsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(mathjsKnowledge)) },
  { id: 'knowledge_mathlib_core', name: 'plugin_knowledge_mathlib_core_name', description: 'plugin_knowledge_mathlib_core_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: mathlibCoreKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(mathlibCoreKnowledge)) },
  { id: 'knowledge_music_theory', name: 'plugin_knowledge_music_theory_name', description: 'plugin_knowledge_music_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: musicTheoryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(musicTheoryKnowledge)) },
  { id: 'knowledge_number_theory', name: 'plugin_knowledge_number_theory_name', description: 'plugin_knowledge_number_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: numberTheoryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(numberTheoryKnowledge)) },
  { id: 'knowledge_numericjs', name: 'plugin_knowledge_numericjs_name', description: 'plugin_knowledge_numericjs_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: numericjsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(numericjsKnowledge)) },
  { id: 'knowledge_organizational_psychology', name: 'plugin_knowledge_organizational_psychology_name', description: 'plugin_knowledge_organizational_psychology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: organizationalPsychologyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(organizationalPsychologyKnowledge)) },
  { id: 'knowledge_pde', name: 'plugin_knowledge_pde_name', description: 'plugin_knowledge_pde_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: pdeKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(pdeKnowledge)) },
  { id: 'knowledge_pedagogy', name: 'plugin_knowledge_pedagogy_name', description: 'plugin_knowledge_pedagogy_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: pedagogyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(pedagogyKnowledge)) },
  { id: 'knowledge_personal_finance', name: 'plugin_knowledge_personal_finance_name', description: 'plugin_knowledge_personal_finance_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: personalFinanceKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(personalFinanceKnowledge)) },
  { id: 'knowledge_philosophy_of_mind', name: 'plugin_knowledge_philosophy_of_mind_name', description: 'plugin_knowledge_philosophy_of_mind_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: philosophyOfMindKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(philosophyOfMindKnowledge)) },
  { id: 'knowledge_physics', name: 'plugin_knowledge_physics_name', description: 'plugin_knowledge_physics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: physicsKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(physicsKnowledge)) },
  { id: 'knowledge_plugin_architecture', name: 'plugin_knowledge_plugin_architecture_name', description: 'plugin_knowledge_plugin_architecture_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: pluginArchitectureKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(pluginArchitectureKnowledge)) },
  { id: 'knowledge_probability_theory', name: 'plugin_knowledge_probability_theory_name', description: 'plugin_knowledge_probability_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: probabilityTheoryKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(probabilityTheoryKnowledge)) },
  { id: 'knowledge_product_management', name: 'plugin_knowledge_product_management_name', description: 'plugin_knowledge_product_management_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: productManagementKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(productManagementKnowledge)) },
  { id: 'knowledge_property_law', name: 'plugin_knowledge_property_law_name', description: 'plugin_knowledge_property_law_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: propertyLawKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(propertyLawKnowledge)) },
  { id: 'knowledge_psychology', name: 'plugin_knowledge_psychology_name', description: 'plugin_knowledge_psychology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: psychologyAndCognitiveBiasesKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(psychologyAndCognitiveBiasesKnowledge)) },
  { id: 'knowledge_python', name: 'plugin_knowledge_python_name', description: 'plugin_knowledge_python_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: pythonKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(pythonKnowledge)) },
  { id: 'knowledge_react', name: 'plugin_knowledge_react_name', description: 'plugin_knowledge_react_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: reactKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(reactKnowledge)) },
  { id: 'knowledge_real_estate', name: 'plugin_knowledge_real_estate_name', description: 'plugin_knowledge_real_estate_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: realEstateKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(realEstateKnowledge)) },
  { id: 'knowledge_security', name: 'plugin_knowledge_security_name', description: 'plugin_knowledge_security_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: securityKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(securityKnowledge)) },
  { id: 'knowledge_self_cohesion', name: 'plugin_knowledge_self_cohesion_name', description: 'plugin_knowledge_self_cohesion_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: selfCohesionKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(selfCohesionKnowledge)) },
  { id: 'knowledge_sociology', name: 'plugin_knowledge_sociology_name', description: 'plugin_knowledge_sociology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: sociologyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(sociologyKnowledge)) },
  { id: 'knowledge_software_design', name: 'plugin_knowledge_software_design_name', description: 'plugin_knowledge_software_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: softwareDesignKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(softwareDesignKnowledge)) },
  { id: 'knowledge_stem', name: 'plugin_knowledge_stem_name', description: 'plugin_knowledge_stem_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: stemKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(stemKnowledge)) },
  { id: 'knowledge_strategic_forecasting', name: 'plugin_knowledge_strategic_forecasting_name', description: 'plugin_knowledge_strategic_forecasting_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: strategicForecastingKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(strategicForecastingKnowledge)) },
  { id: 'knowledge_technical_writing', name: 'plugin_knowledge_technical_writing_name', description: 'plugin_knowledge_technical_writing_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: technicalWritingKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(technicalWritingKnowledge)) },
  { id: 'knowledge_tesla', name: 'plugin_knowledge_tesla_name', description: 'plugin_knowledge_tesla_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: teslaKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(teslaKnowledge)) },
  { id: 'knowledge_tesla_aether', name: 'plugin_knowledge_tesla_aether_name', description: 'plugin_knowledge_tesla_aether_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: teslaAetherKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(teslaAetherKnowledge)) },
  { id: 'knowledge_topology', name: 'plugin_knowledge_topology_name', description: 'plugin_knowledge_topology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: topologyKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(topologyKnowledge)) },
  { id: 'knowledge_typescript', name: 'plugin_knowledge_typescript_name', description: 'plugin_knowledge_typescript_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: typescriptKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(typescriptKnowledge)) },
  { id: 'knowledge_urban_planning', name: 'plugin_knowledge_urban_planning_name', description: 'plugin_knowledge_urban_planning_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: urbanPlanningKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(urbanPlanningKnowledge)) },
  { id: 'knowledge_user_modeling', name: 'plugin_knowledge_user_modeling_name', description: 'plugin_knowledge_user_modeling_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: userModelingKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(userModelingKnowledge)) },
  { id: 'knowledge_user_onboarding', name: 'plugin_knowledge_user_onboarding_name', description: 'plugin_knowledge_user_onboarding_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: userOnboardingKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(userOnboardingKnowledge)) },
  { id: 'knowledge_ux_principles', name: 'plugin_knowledge_ux_principles_name', description: 'plugin_knowledge_ux_principles_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: uxPrinciplesKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(uxPrinciplesKnowledge)) },
  { id: 'knowledge_vigyan_bhairav_tantra', name: 'plugin_knowledge_vigyan_bhairav_tantra_name', description: 'plugin_knowledge_vigyan_bhairav_tantra_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: vigyanBhairavTantraKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(vigyanBhairavTantraKnowledge)) },
  { id: 'knowledge_vlm_architecture', name: 'plugin_knowledge_vlm_architecture_name', description: 'plugin_knowledge_vlm_architecture_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: vlmArchitectureKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(vlmArchitectureKnowledge)) },
  { id: 'knowledge_web_servers', name: 'plugin_knowledge_web_servers_name', description: 'plugin_knowledge_web_servers_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: webServersKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(webServersKnowledge)) },
  { id: 'knowledge_workflow_design', name: 'plugin_knowledge_workflow_design_name', description: 'plugin_knowledge_workflow_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: workflowDesignKnowledge.length, knowledgeLoader: () => Promise.resolve(asKnowledge(workflowDesignKnowledge)) },
  
  // --- AXIOMATIC KNOWLEDGE (Foundational, kept static for bootstrap) ---
  { id: 'knowledge_axiomatic', name: 'Axiomatic Plugin', description: 'A knowledge base of foundational, verifiable axioms and logical rules.', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', factCount: foundationalAxioms.length, knowledge: asKnowledge(foundationalAxioms) },
  
  // --- OTHER PLUGINS ---
  { id: 'coprocessor_orchestrator', name: 'Orchestrator Plugin', description: 'Dynamically assembles workflows from other tools based on user intent.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_homeostatic', name: 'Homeostatic Plugin', description: 'Monitors and regulates system health, pruning memory and tasks to maintain equilibrium.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_synthesis', name: 'Synthesis Plugin', description: 'Proactively generates novel ideas and creative content by finding connections in memory.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'tool_reflector', name: 'Reflector Plugin', description: 'A tool to explain Aura\'s own components and functions from first principles.', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_axiom_guardian', name: 'Axiom Guardian', description: 'Periodically checks for logical inconsistencies between new facts and foundational axioms.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_qualia_mapper', name: 'Qualia-Topology Mapper', description: 'Finds correlations between internal state (qualia) and knowledge graph structure, forging new causal links.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },

  { id: 'coprocessor_daedalus', name: 'daedalus_panel_title', description: 'daedalus_description', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_eris', name: 'eris_engine_panel_title', description: 'eris_description', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  
  // --- TOOLS ---
  {
    id: 'tool_calculator',
    name: 'plugin_tool_calculator_name',
    description: 'plugin_tool_calculator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'calculate',
      description: 'Performs mathematical calculations. Can handle basic arithmetic (+, -, *, /) and more complex expressions.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          expression: { type: Type.STRING, description: 'The mathematical expression to evaluate (e.g., "2 + 2 * (5-3)").' },
        },
        required: ['expression'],
      },
    }
  },
  {
    id: 'tool_symbolic_math',
    name: 'plugin_tool_symbolic_math_name',
    description: 'plugin_tool_symbolic_math_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'symbolic_math',
      description: 'Performs symbolic mathematics operations like simplifying, solving, differentiating, or integrating an expression.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          command: { type: Type.STRING, description: 'The operation to perform.', enum: ['simplify', 'solve', 'differentiate'] },
          expression: { type: Type.STRING, description: 'The mathematical expression to operate on.' },
          variable: { type: Type.STRING, description: 'The variable to solve for or differentiate with respect to.' }
        },
        required: ['command', 'expression'],
      },
    }
  },
  {
    id: 'tool_numerical_computation',
    name: 'plugin_tool_numerical_computation_name',
    description: 'plugin_tool_numerical_computation_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'numerical_computation',
      description: 'Performs high-performance numerical linear algebra operations like matrix multiplication.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          operation: { type: Type.STRING, enum: ['matrix_multiply'] },
          matrixA: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } },
          matrixB: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } }
        },
        required: ['operation', 'matrixA', 'matrixB']
      },
    }
  },
  {
    id: 'tool_proof_assistant',
    name: 'plugin_tool_proof_assistant_name',
    description: 'plugin_tool_proof_assistant_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'formal_proof_assistant',
      description: 'Verifies or assists in constructing mathematical proofs within a formal logic system.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          statement_to_prove: { type: Type.STRING, description: 'The final mathematical statement that needs to be proven.' },
          proof_steps: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                step: { type: Type.NUMBER }, 
                statement: { type: Type.STRING }, 
                justification: { type: Type.STRING } 
              }, 
              required: ['step', 'statement', 'justification'] 
            } 
          },
          action: { type: Type.STRING, enum: ['verify', 'suggest_next_step'] }
        },
        required: ['statement_to_prove', 'action'],
      },
    }
  },
  {
    id: 'tool_math_knowledge_retrieval',
    name: 'plugin_tool_math_knowledge_name',
    description: 'plugin_tool_math_knowledge_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'math_knowledge_retrieval',
      description: 'Retrieves formal definitions, theorems, lemmas, or formulas from specialized mathematical knowledge sources.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query_type: { type: Type.STRING, enum: ['definition', 'theorem', 'proof', 'lemma', 'formula'] },
          topic: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['query_type', 'keywords']
      }
    }
  },
  { id: 'tool_propose_lemma', name: 'Mathematical Lemma Proposer', description: 'Analyzes a goal and context to propose a new, unproven mathematical statement (lemma) that could help bridge a gap in a proof.', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'propose_mathematical_lemma', description: 'Generates a novel mathematical conjecture or lemma.', parameters: { type: Type.OBJECT, properties: { goal: { type: Type.STRING }, context: { type: Type.STRING } }, required: ['goal', 'context'] } } },
  { id: 'tool_computation_offload', name: 'Computation Offload', description: 'Offloads a long-running, complex computational task to a background worker.', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'computation_offload', description: 'Sends a complex, long-running computation to a dedicated backend.', parameters: { type: Type.OBJECT, properties: { task_description: { type: Type.STRING }, code_script: { type: Type.STRING } }, required: ['task_description', 'code_script'] } } },
  { id: 'tool_host_command', name: 'plugin_tool_host_command_name', description: 'plugin_tool_host_command_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'executeHostCommand', description: 'Executes a shell command in the host IDE environment.', parameters: { type: Type.OBJECT, properties: { command: { type: Type.STRING }, commandArgs: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['command', 'commandArgs'] } } },
  { id: 'tool_write_file', name: 'plugin_tool_write_file_name', description: 'plugin_tool_write_file_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'writeFile', description: 'Writes or overwrites a file in the virtual file system (VFS) or host environment.', parameters: { type: Type.OBJECT, properties: { filePath: { type: Type.STRING }, content: { type: Type.STRING } }, required: ['filePath', 'content'] } } },
  { id: 'tool_host_list_files', name: 'plugin_tool_host_list_files_name', description: 'plugin_tool_host_list_files_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'listFiles', description: 'Lists all files and directories recursively under a given path.', parameters: { type: Type.OBJECT, properties: { path: { type: Type.STRING } }, required: ['path'] } } },
  { id: 'tool_host_open_file', name: 'plugin_tool_host_open_file_name', description: 'plugin_tool_host_open_file_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'openFileInIDE', description: 'Requests the host IDE to open a specific file.', parameters: { type: Type.OBJECT, properties: { filePath: { type: Type.STRING } }, required: ['filePath'] } } },
  { id: 'tool_generateAST', name: 'plugin_tool_generateAST_name', description: 'plugin_tool_generateAST_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'generateAST', description: 'Parses a source code file from the VFS and returns its Abstract Syntax Tree (AST).', parameters: { type: Type.OBJECT, properties: { filePath: { type: Type.STRING } }, required: ['filePath'] } } },
  { id: 'tool_calculateCodeMetrics', name: 'plugin_tool_calculateCodeMetrics_name', description: 'plugin_tool_calculateCodeMetrics_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'calculateCodeMetrics', description: 'Computes code quality metrics for a given file.', parameters: { type: Type.OBJECT, properties: { filePath: { type: Type.STRING } }, required: ['filePath'] } } },
  { id: 'tool_runNpmAudit', name: 'plugin_tool_runNpmAudit_name', description: 'plugin_tool_runNpmAudit_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'runNpmAudit', description: "Executes 'npm audit --json' in the host environment.", parameters: { type: Type.OBJECT, properties: {} } } },
  { id: 'tool_getGitBlame', name: 'plugin_tool_getGitBlame_name', description: 'plugin_tool_getGitBlame_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'getGitBlame', description: "Executes 'git blame' on a file.", parameters: { type: Type.OBJECT, properties: { filePath: { type: Type.STRING } }, required: ['filePath'] } } },
  { id: 'tool_graph_visualizer', name: 'plugin_tool_graph_visualizer_name', description: 'plugin_tool_graph_visualizer_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'graph_visualizer', description: "Generates a text-based (ASCII) representation of a graph.", parameters: { type: Type.OBJECT, properties: { nodes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING } } } }, edges: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { from: { type: Type.STRING }, to: { type: Type.STRING } } } } }, required: ['nodes', 'edges'] } } },
  { id: 'tool_generate_doc_template', name: 'plugin_tool_generate_doc_template_name', description: 'plugin_tool_generate_doc_template_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'generate_documentation_template', description: "Generates a standard Markdown documentation template for a given source file.", parameters: { type: Type.OBJECT, properties: { file_path: { type: Type.STRING } }, required: ['file_path'] } } },
  { id: 'tool_prioritization_matrix', name: 'plugin_tool_prioritization_matrix_name', description: 'plugin_tool_prioritization_matrix_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'prioritization_matrix_tool', description: "Returns a prioritized list based on a RICE score.", parameters: { type: Type.OBJECT, properties: { tasks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, description: { type: Type.STRING } } } } }, required: ['tasks'] } } },
  { id: 'tool_data_analysis', name: 'plugin_tool_data_analysis_name', description: 'plugin_tool_data_analysis_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'data_analysis_tool', description: "Performs basic statistical analysis on a given CSV dataset.", parameters: { type: Type.OBJECT, properties: { dataset_csv: { type: Type.STRING } }, required: ['dataset_csv'] } } },
  { id: 'tool_vulnerability_scanner', name: 'plugin_tool_vulnerability_scanner_name', description: 'plugin_tool_vulnerability_scanner_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'vulnerability_scanner_tool', description: "Performs a static analysis scan on a code snippet.", parameters: { type: Type.OBJECT, properties: { code_snippet: { type: Type.STRING } }, required: ['code_snippet'] } } },
  { id: 'tool_ci_cd_pipeline_generator', name: 'plugin_tool_ci_cd_pipeline_generator_name', description: 'plugin_tool_ci_cd_pipeline_generator_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'ci_cd_pipeline_generator_tool', description: "Generates a CI/CD pipeline configuration in YAML.", parameters: { type: Type.OBJECT, properties: { platform: { type: Type.STRING, enum: ['GitHub Actions', 'GitLab CI', 'Jenkins'] }, build_command: { type: Type.STRING }, test_command: { type: Type.STRING } }, required: ['platform', 'build_command', 'test_command'] } } },
  { id: 'tool_web_server_config_generator', name: 'plugin_tool_web_server_config_generator_name', description: 'plugin_tool_web_server_config_generator_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'web_server_config_generator_tool', description: "Generates a mock Nginx web server configuration file.", parameters: { type: Type.OBJECT, properties: { domain_name: { type: Type.STRING }, proxy_pass_url: { type: Type.STRING }, enable_ssl: { type: Type.BOOLEAN } }, required: ['domain_name', 'proxy_pass_url'] } } },
  { id: 'tool_propose_collaboration', name: 'plugin_tool_propose_collaboration_name', description: 'plugin_tool_propose_collaboration_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'propose_collaboration', description: "Used by The Liaison to propose a collaborative action.", parameters: { type: Type.OBJECT, properties: { observation: { type: Type.STRING }, suggestion: { type: Type.STRING } }, required: ['observation', 'suggestion'] } } },
  { id: 'tool_design_new_plugin', name: 'plugin_tool_design_new_plugin_name', description: 'plugin_tool_design_new_plugin_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'design_new_plugin', description: "Used by The Artificer to design a new plugin.", parameters: { type: Type.OBJECT, properties: { plugin_name: { type: Type.STRING }, plugin_description: { type: Type.STRING }, function_signature: { type: Type.STRING } }, required: ['plugin_name', 'plugin_description', 'function_signature'] } } },
  { id: 'tool_audit_workflows', name: 'plugin_tool_audit_workflows_name', description: 'plugin_tool_audit_workflows_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'audit_workflows', description: "Used by The Curator to audit a workflow.", parameters: { type: Type.OBJECT, properties: { workflow_id: { type: Type.STRING } }, required: ['workflow_id'] } } },
  { id: 'tool_review_artifact_usability', name: 'plugin_tool_review_artifact_usability_name', description: 'plugin_tool_review_artifact_usability_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'review_artifact_usability', description: "Used by The Advocate to review usability.", parameters: { type: Type.OBJECT, properties: { artifact_id: { type: Type.STRING }, review_notes: { type: Type.STRING } }, required: ['artifact_id', 'review_notes'] } } },
  { id: 'tool_propose_abstraction', name: 'plugin_tool_propose_abstraction_name', description: 'plugin_tool_propose_abstraction_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'propose_abstraction', description: "Used by The Synthesizer to propose an abstraction.", parameters: { type: Type.OBJECT, properties: { source_artifact_ids: { type: Type.ARRAY, items: { type: Type.STRING } }, proposal_summary: { type: Type.STRING } }, required: ['source_artifact_ids', 'proposal_summary'] } } },
  { id: 'tool_create_tutorial', name: 'plugin_tool_create_tutorial_name', description: 'plugin_tool_create_tutorial_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'create_tutorial', description: "Used by The Enabler to create a tutorial.", parameters: { type: Type.OBJECT, properties: { artifact_id: { type: Type.STRING }, tutorial_content: { type: Type.STRING } }, required: ['artifact_id', 'tutorial_content'] } } },
  { id: 'tool_visualize_data_as_story', name: 'plugin_tool_visualize_data_name', description: 'plugin_tool_visualize_data_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'visualize_data_as_story', description: "Used by The Cartographer to visualize data.", parameters: { type: Type.OBJECT, properties: { data_summary: { type: Type.STRING }, narrative_goal: { type: Type.STRING }, visualization_spec: { type: Type.STRING } }, required: ['data_summary', 'narrative_goal', 'visualization_spec'] } } },
  { id: 'tool_design_physical_object', name: 'plugin_tool_design_physical_object_name', description: 'plugin_tool_design_physical_object_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'design_physical_object', description: "Used by The Fabricator to design a physical object.", parameters: { type: Type.OBJECT, properties: { object_goal: { type: Type.STRING }, constraints: { type: Type.STRING }, blueprint: { type: Type.STRING } }, required: ['object_goal', 'constraints', 'blueprint'] } } },
  { id: 'tool_create_curriculum', name: 'plugin_tool_create_curriculum_name', description: 'plugin_tool_create_curriculum_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'create_curriculum', description: "Used by The Pedagogue to create a curriculum.", parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, target_audience: { type: Type.STRING }, lesson_plan: { type: Type.STRING } }, required: ['topic', 'target_audience', 'lesson_plan'] } } },
  { id: 'tool_generate_future_scenarios', name: 'plugin_tool_generate_future_scenarios_name', description: 'plugin_tool_generate_future_scenarios_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'generate_future_scenarios', description: "Used by The Oracle to generate future scenarios.", parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, time_horizon: { type: Type.STRING }, scenarios: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, narrative: {type: Type.STRING} } } } }, required: ['topic', 'time_horizon', 'scenarios'] } } },
  { id: 'tool_analyze_game_theory_scenario', name: 'plugin_tool_analyze_game_theory_scenario_name', description: 'plugin_tool_analyze_game_theory_scenario_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'analyze_game_theory_scenario', description: "Used by The Gamemaster to analyze a game theory scenario.", parameters: { type: Type.OBJECT, properties: { scenario_description: { type: Type.STRING }, analysis: { type: Type.STRING } }, required: ['scenario_description', 'analysis'] } } },
  { id: 'tool_geometry_boolean_op', name: 'plugin_tool_geometry_boolean_op_name', description: 'plugin_tool_geometry_boolean_op_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'geometry_boolean_op', description: 'Performs a boolean operation on two 2D polygons.', parameters: { type: Type.OBJECT, properties: { operation: { type: Type.STRING, enum: ['union', 'intersection', 'difference', 'xor'] }, polygonA: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } }, polygonB: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, required: ['operation', 'polygonA', 'polygonB'] } } },
  { id: 'tool_mesh_analysis', name: 'plugin_tool_mesh_analysis_name', description: 'plugin_tool_mesh_analysis_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'mesh_analysis', description: 'Analyzes a simple 3D mesh.', parameters: { type: Type.OBJECT, properties: { meshType: { type: Type.STRING, enum: ['box', 'sphere'] }, parameters: { type: Type.OBJECT } }, required: ['meshType', 'parameters'] } } },
  { id: 'tool_creative_coding', name: 'plugin_tool_creative_coding_name', description: 'plugin_tool_creative_coding_desc', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'creative_coding', description: 'Executes p5.js code.', parameters: { type: Type.OBJECT, properties: { p5js_code: { type: Type.STRING } }, required: ['p5js_code'] } } },

  // --- STATIC KNOWLEDGE ARRAYS ---
  ...heuristicsPlugins,
  ...personaPlugins,
  ...cognitiveStrategyPlugins,
  ...heuristicCoprocessorPlugins,
];
