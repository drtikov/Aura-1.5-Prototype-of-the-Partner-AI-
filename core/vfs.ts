
// core/vfs.ts
import { personas } from '../state/personas.ts';
import { aestheticsKnowledge } from '../state/knowledge/aesthetics.ts';
import { algebraicGeometryKnowledge } from '../state/knowledge/algebraicGeometry.ts';
import { anthropologyKnowledge } from '../state/knowledge/anthropology.ts';
import { artKnowledge } from '../state/knowledge/art.ts';
import { astronomyKnowledge } from '../state/knowledge/astronomy.ts';
import { backendImplementationKnowledge } from '../state/knowledge/backendImplementation.ts';
import { biologyKnowledge } from '../state/knowledge/biology.ts';
import { businessAndFinanceKnowledge } from '../state/knowledge/businessAndFinance.ts';
import { chaosDynamicsKnowledge } from '../state/knowledge/chaosDynamics.ts';
import { chemistryKnowledge } from '../state/knowledge/chemistry.ts';
import { classicalMechanicsKnowledge } from '../state/knowledge/classicalMechanics.ts';
import { cloudInfrastructureKnowledge } from '../state/knowledge/cloudInfrastructure.ts';
import { cloudServicesKnowledge } from '../state/knowledge/cloudServices.ts';
import { cognitiveScienceKnowledge } from '../state/knowledge/cognitiveScience.ts';
import { comparativeNeuroanatomyKnowledge } from '../state/knowledge/comparativeNeuroanatomy.ts';
import { complexAnalysisKnowledge } from '../state/knowledge/complexAnalysis.ts';
import { complexSystemsKnowledge } from '../state/knowledge/complexSystems.ts';
import { computerScienceKnowledge } from '../state/knowledge/computerScience.ts';
import { dataScienceKnowledge } from '../state/knowledge/dataScience.ts';
import { dataVisualizationKnowledge } from '../state/knowledge/dataVisualization.ts';
import { databaseManagementKnowledge } from '../state/knowledge/databaseManagement.ts';
import { designPatternsKnowledge } from '../state/knowledge/designPatterns.ts';
import { devopsKnowledge } from '../state/knowledge/devops.ts';
import { digitalAssetManagementKnowledge } from '../state/knowledge/digitalAssetManagement.ts';
import { ecologyKnowledge } from '../state/knowledge/ecology.ts';
import { economicsKnowledge } from '../state/knowledge/economics.ts';
import { engineeringDesignKnowledge } from '../state/knowledge/engineeringDesign.ts';
import { entrepreneurNetworkData } from '../state/knowledge/entrepreneurNetwork.ts';
import { ergodicTheoryKnowledge } from '../state/knowledge/ergodicTheory.ts';
import { ethicsKnowledge } from '../state/knowledge/ethics.ts';
import { fluidDynamicsKnowledge } from '../state/knowledge/fluidDynamics.ts';
import { foundationalAxioms } from '../state/knowledge/foundationalAxioms.ts';
import { fourierAnalysisKnowledge } from '../state/knowledge/fourierAnalysis.ts';
import { functionalAnalysisKnowledge } from '../state/knowledge/functionalAnalysis.ts';
import { gameTheoryKnowledge } from '../state/knowledge/gameTheory.ts';
import { gardeningKnowledge } from '../state/knowledge/gardening.ts';
import { geneticsKnowledge } from '../state/knowledge/genetics.ts';
import { geologyKnowledge } from '../state/knowledge/geology.ts';
import { historyKnowledge } from '../state/knowledge/history.ts';
import { homeImprovementKnowledge } from '../state/knowledge/homeImprovement.ts';
import { installedSDKsKnowledge } from '../state/knowledge/installedSDKs.ts';
import { interiorDesignKnowledge } from '../state/knowledge/interiorDesign.ts';
import { intuitionisticLogicKnowledge } from '../state/knowledge/intuitionisticLogic.ts';
import { jestVitestKnowledge } from '../state/knowledge/jestVitest.ts';
import { leanKnowledge } from '../state/knowledge/lean.ts';
import { literaryTheoryKnowledge } from '../state/knowledge/literaryTheory.ts';
import { machineLearningKnowledge } from '../state/knowledge/machineLearning.ts';
import { marketAnalysisKnowledge } from '../state/knowledge/marketAnalysis.ts';
import { mathjsKnowledge } from '../state/knowledge/mathjs.ts';
import { mathlibCoreKnowledge } from '../state/knowledge/mathlibCore.ts';
import { musicTheoryKnowledge } from '../state/knowledge/musicTheory.ts';
import { numberTheoryKnowledge } from '../state/knowledge/numberTheory.ts';
import { numericjsKnowledge } from '../state/knowledge/numericjs.ts';
import { organizationalPsychologyKnowledge } from '../state/knowledge/organizationalPsychology.ts';
import { pdeKnowledge } from '../state/knowledge/pde.ts';
import { pedagogyKnowledge } from '../state/knowledge/pedagogy.ts';
import { personalFinanceKnowledge } from '../state/knowledge/personalFinance.ts';
import { philosophyOfMindKnowledge } from '../state/knowledge/philosophyOfMind.ts';
import { physicsKnowledge } from '../state/knowledge/physics.ts';
import { pluginArchitectureKnowledge } from '../state/knowledge/pluginArchitecture.ts';
import { probabilityTheoryKnowledge } from '../state/knowledge/probabilityTheory.ts';
import { productManagementKnowledge } from '../state/knowledge/productManagement.ts';
import { propertyLawKnowledge } from '../state/knowledge/propertyLaw.ts';
import { psychologyAndCognitiveBiasesKnowledge } from '../state/knowledge/psychology.ts';
import { pythonKnowledge } from '../state/knowledge/python.ts';
import { reactKnowledge } from '../state/knowledge/react.ts';
import { realEstateKnowledge } from '../state/knowledge/realEstate.ts';
import { RUNTIME_MANUALS } from '../state/knowledge/runtimeManuals.ts';
import { securityKnowledge } from '../state/knowledge/security.ts';
import { selfCohesionKnowledge } from '../state/knowledge/selfCohesion.ts';
import { sociologyKnowledge } from '../state/knowledge/sociology.ts';
import { softwareDesignKnowledge } from '../state/knowledge/softwareDesign.ts';
import { stemKnowledge } from '../state/knowledge/stem.ts';
import { strategicForecastingKnowledge } from '../state/knowledge/strategicForecasting.ts';
import { technicalWritingKnowledge } from '../state/knowledge/technicalWriting.ts';
import { teslaKnowledge } from '../state/knowledge/tesla.ts';
import { teslaAetherKnowledge } from '../state/knowledge/teslaAether.ts';
import { topologyKnowledge } from '../state/knowledge/topology.ts';
import { typescriptKnowledge } from '../state/knowledge/typescript.ts';
import { urbanPlanningKnowledge } from '../state/knowledge/urbanPlanning.ts';
import { userModelingKnowledge } from '../state/knowledge/userModeling.ts';
import { userOnboardingKnowledge } from '../state/knowledge/userOnboarding.ts';
import { uxPrinciplesKnowledge } from '../state/knowledge/uxPrinciples.ts';
import { vigyanBhairavTantraKnowledge } from '../state/knowledge/vigyanBhairavTantra.ts';
import { vlmArchitectureKnowledge } from '../state/knowledge/vlmArchitecture.ts';
import { webServersKnowledge } from '../state/knowledge/webServers.ts';
import { workflowDesignKnowledge } from '../state/knowledge/workflowDesign.ts';

const bootLogContent = `
[2024-07-01T00:00:00.000Z] AURA Kernel v1.0 initializing...
[2024-07-01T00:00:00.050Z] Loading Symbiotic OS...
[2024-07-01T00:00:00.150Z] Mounting Cognitive Virtual File System (CVFS)...
[2024-07-01T00:00:00.200Z] Initializing Memristor (IndexedDB)...
[2024-07-01T00:00:00.450Z] Connection to Memristor established.
[2024-07-01T00:00:00.500Z] Loading last known state from Memristor...
[2024-07-01T00:00:00.700Z] State v3.0 loaded. Migrations not required.
[2024-07-01T00:00:00.750Z] Initializing core cognitive architecture...
[2024-07-01T00:00:00.900Z] Spawning Coprocessor Architecture: SYMBIOTIC_ECOSYSTEM.
[2024-07-01T00:00:01.100Z] Initializing Perception-Action Loop...
[2024-07-01T00:00:01.200Z] Koniocortex Sentinel online.
[2024-07-01T00:00:01.300Z] Praxis Core online.
[2024-07-01T00:00:01.500Z] All systems nominal. Awaiting user input.
`.trim();

const hostBridgeAPIV2 = `
# Host Bridge API v2.0
(Refer to full documentation in Manuals)
`.trim();

const selfCohesionWhitepaper = `
# AURA Whitepaper: On Self-Cohesion
(Refer to full documentation in Manuals)
`.trim();

// Helper to reconstruct valid TS source code from the data objects
const serializeKnowledge = (varName: string, data: any) => {
    return `// state/knowledge/${varName}.ts\nimport { KnowledgeFact } from '../../types';\n\nexport const ${varName}: Omit<KnowledgeFact, 'id' | 'source'>[] = ${JSON.stringify(data, null, 2)};`;
};

const serializePersonas = () => {
    return `// state/personas.ts\nimport { Persona } from '../types.ts';\n\nexport const personas: Persona[] = ${JSON.stringify(personas, null, 2)};`;
}

const serializeManuals = () => {
    return `// state/knowledge/runtimeManuals.ts\n\nexport const RUNTIME_MANUALS = ${JSON.stringify(RUNTIME_MANUALS, null, 2)};`;
}

export const INITIAL_VFS_SEED: { [filePath: string]: string } = {
  "/system/logs/boot.log": bootLogContent,
  "/docs/HOST_BRIDGE_API_V2.md": hostBridgeAPIV2,
  "/docs/SELF_COHESION_WHITEPAPER.md": selfCohesionWhitepaper,
  "/state/personas.ts": serializePersonas(),
  "/state/knowledge/runtimeManuals.ts": serializeManuals(),
  
  // Knowledge Modules
  "/state/knowledge/aesthetics.ts": serializeKnowledge('aestheticsKnowledge', aestheticsKnowledge),
  "/state/knowledge/algebraicGeometry.ts": serializeKnowledge('algebraicGeometryKnowledge', algebraicGeometryKnowledge),
  "/state/knowledge/anthropology.ts": serializeKnowledge('anthropologyKnowledge', anthropologyKnowledge),
  "/state/knowledge/art.ts": serializeKnowledge('artKnowledge', artKnowledge),
  "/state/knowledge/astronomy.ts": serializeKnowledge('astronomyKnowledge', astronomyKnowledge),
  "/state/knowledge/backendImplementation.ts": serializeKnowledge('backendImplementationKnowledge', backendImplementationKnowledge),
  "/state/knowledge/biology.ts": serializeKnowledge('biologyKnowledge', biologyKnowledge),
  "/state/knowledge/businessAndFinance.ts": serializeKnowledge('businessAndFinanceKnowledge', businessAndFinanceKnowledge),
  "/state/knowledge/chaosDynamics.ts": serializeKnowledge('chaosDynamicsKnowledge', chaosDynamicsKnowledge),
  "/state/knowledge/chemistry.ts": serializeKnowledge('chemistryKnowledge', chemistryKnowledge),
  "/state/knowledge/classicalMechanics.ts": serializeKnowledge('classicalMechanicsKnowledge', classicalMechanicsKnowledge),
  "/state/knowledge/cloudInfrastructure.ts": serializeKnowledge('cloudInfrastructureKnowledge', cloudInfrastructureKnowledge),
  "/state/knowledge/cloudServices.ts": serializeKnowledge('cloudServicesKnowledge', cloudServicesKnowledge),
  "/state/knowledge/cognitiveScience.ts": serializeKnowledge('cognitiveScienceKnowledge', cognitiveScienceKnowledge),
  "/state/knowledge/comparativeNeuroanatomy.ts": serializeKnowledge('comparativeNeuroanatomyKnowledge', comparativeNeuroanatomyKnowledge),
  "/state/knowledge/complexAnalysis.ts": serializeKnowledge('complexAnalysisKnowledge', complexAnalysisKnowledge),
  "/state/knowledge/complexSystems.ts": serializeKnowledge('complexSystemsKnowledge', complexSystemsKnowledge),
  "/state/knowledge/computerScience.ts": serializeKnowledge('computerScienceKnowledge', computerScienceKnowledge),
  "/state/knowledge/dataScience.ts": serializeKnowledge('dataScienceKnowledge', dataScienceKnowledge),
  "/state/knowledge/dataVisualization.ts": serializeKnowledge('dataVisualizationKnowledge', dataVisualizationKnowledge),
  "/state/knowledge/databaseManagement.ts": serializeKnowledge('databaseManagementKnowledge', databaseManagementKnowledge),
  "/state/knowledge/designPatterns.ts": serializeKnowledge('designPatternsKnowledge', designPatternsKnowledge),
  "/state/knowledge/devops.ts": serializeKnowledge('devopsKnowledge', devopsKnowledge),
  "/state/knowledge/digitalAssetManagement.ts": serializeKnowledge('digitalAssetManagementKnowledge', digitalAssetManagementKnowledge),
  "/state/knowledge/ecology.ts": serializeKnowledge('ecologyKnowledge', ecologyKnowledge),
  "/state/knowledge/economics.ts": serializeKnowledge('economicsKnowledge', economicsKnowledge),
  "/state/knowledge/engineeringDesign.ts": serializeKnowledge('engineeringDesignKnowledge', engineeringDesignKnowledge),
  "/state/knowledge/entrepreneurNetwork.ts": serializeKnowledge('entrepreneurNetworkData', entrepreneurNetworkData),
  "/state/knowledge/ergodicTheory.ts": serializeKnowledge('ergodicTheoryKnowledge', ergodicTheoryKnowledge),
  "/state/knowledge/ethics.ts": serializeKnowledge('ethicsKnowledge', ethicsKnowledge),
  "/state/knowledge/fluidDynamics.ts": serializeKnowledge('fluidDynamicsKnowledge', fluidDynamicsKnowledge),
  "/state/knowledge/foundationalAxioms.ts": serializeKnowledge('foundationalAxioms', foundationalAxioms),
  "/state/knowledge/fourierAnalysis.ts": serializeKnowledge('fourierAnalysisKnowledge', fourierAnalysisKnowledge),
  "/state/knowledge/functionalAnalysis.ts": serializeKnowledge('functionalAnalysisKnowledge', functionalAnalysisKnowledge),
  "/state/knowledge/gameTheory.ts": serializeKnowledge('gameTheoryKnowledge', gameTheoryKnowledge),
  "/state/knowledge/gardening.ts": serializeKnowledge('gardeningKnowledge', gardeningKnowledge),
  "/state/knowledge/genetics.ts": serializeKnowledge('geneticsKnowledge', geneticsKnowledge),
  "/state/knowledge/geology.ts": serializeKnowledge('geologyKnowledge', geologyKnowledge),
  "/state/knowledge/history.ts": serializeKnowledge('historyKnowledge', historyKnowledge),
  "/state/knowledge/homeImprovement.ts": serializeKnowledge('homeImprovementKnowledge', homeImprovementKnowledge),
  "/state/knowledge/installedSDKs.ts": serializeKnowledge('installedSDKsKnowledge', installedSDKsKnowledge),
  "/state/knowledge/interiorDesign.ts": serializeKnowledge('interiorDesignKnowledge', interiorDesignKnowledge),
  "/state/knowledge/intuitionisticLogic.ts": serializeKnowledge('intuitionisticLogicKnowledge', intuitionisticLogicKnowledge),
  "/state/knowledge/jestVitest.ts": serializeKnowledge('jestVitestKnowledge', jestVitestKnowledge),
  "/state/knowledge/lean.ts": serializeKnowledge('leanKnowledge', leanKnowledge),
  "/state/knowledge/literaryTheory.ts": serializeKnowledge('literaryTheoryKnowledge', literaryTheoryKnowledge),
  "/state/knowledge/machineLearning.ts": serializeKnowledge('machineLearningKnowledge', machineLearningKnowledge),
  "/state/knowledge/marketAnalysis.ts": serializeKnowledge('marketAnalysisKnowledge', marketAnalysisKnowledge),
  "/state/knowledge/mathjs.ts": serializeKnowledge('mathjsKnowledge', mathjsKnowledge),
  "/state/knowledge/mathlibCore.ts": serializeKnowledge('mathlibCoreKnowledge', mathlibCoreKnowledge),
  "/state/knowledge/musicTheory.ts": serializeKnowledge('musicTheoryKnowledge', musicTheoryKnowledge),
  "/state/knowledge/numberTheory.ts": serializeKnowledge('numberTheoryKnowledge', numberTheoryKnowledge),
  "/state/knowledge/numericjs.ts": serializeKnowledge('numericjsKnowledge', numericjsKnowledge),
  "/state/knowledge/organizationalPsychology.ts": serializeKnowledge('organizationalPsychologyKnowledge', organizationalPsychologyKnowledge),
  "/state/knowledge/pde.ts": serializeKnowledge('pdeKnowledge', pdeKnowledge),
  "/state/knowledge/pedagogy.ts": serializeKnowledge('pedagogyKnowledge', pedagogyKnowledge),
  "/state/knowledge/personalFinance.ts": serializeKnowledge('personalFinanceKnowledge', personalFinanceKnowledge),
  "/state/knowledge/philosophyOfMind.ts": serializeKnowledge('philosophyOfMindKnowledge', philosophyOfMindKnowledge),
  "/state/knowledge/physics.ts": serializeKnowledge('physicsKnowledge', physicsKnowledge),
  "/state/knowledge/pluginArchitecture.ts": serializeKnowledge('pluginArchitectureKnowledge', pluginArchitectureKnowledge),
  "/state/knowledge/probabilityTheory.ts": serializeKnowledge('probabilityTheoryKnowledge', probabilityTheoryKnowledge),
  "/state/knowledge/productManagement.ts": serializeKnowledge('productManagementKnowledge', productManagementKnowledge),
  "/state/knowledge/propertyLaw.ts": serializeKnowledge('propertyLawKnowledge', propertyLawKnowledge),
  "/state/knowledge/psychology.ts": serializeKnowledge('psychologyAndCognitiveBiasesKnowledge', psychologyAndCognitiveBiasesKnowledge),
  "/state/knowledge/python.ts": serializeKnowledge('pythonKnowledge', pythonKnowledge),
  "/state/knowledge/react.ts": serializeKnowledge('reactKnowledge', reactKnowledge),
  "/state/knowledge/realEstate.ts": serializeKnowledge('realEstateKnowledge', realEstateKnowledge),
  "/state/knowledge/security.ts": serializeKnowledge('securityKnowledge', securityKnowledge),
  "/state/knowledge/selfCohesion.ts": serializeKnowledge('selfCohesionKnowledge', selfCohesionKnowledge),
  "/state/knowledge/sociology.ts": serializeKnowledge('sociologyKnowledge', sociologyKnowledge),
  "/state/knowledge/softwareDesign.ts": serializeKnowledge('softwareDesignKnowledge', softwareDesignKnowledge),
  "/state/knowledge/stem.ts": serializeKnowledge('stemKnowledge', stemKnowledge),
  "/state/knowledge/strategicForecasting.ts": serializeKnowledge('strategicForecastingKnowledge', strategicForecastingKnowledge),
  "/state/knowledge/technicalWriting.ts": serializeKnowledge('technicalWritingKnowledge', technicalWritingKnowledge),
  "/state/knowledge/tesla.ts": serializeKnowledge('teslaKnowledge', teslaKnowledge),
  "/state/knowledge/teslaAether.ts": serializeKnowledge('teslaAetherKnowledge', teslaAetherKnowledge),
  "/state/knowledge/topology.ts": serializeKnowledge('topologyKnowledge', topologyKnowledge),
  "/state/knowledge/typescript.ts": serializeKnowledge('typescriptKnowledge', typescriptKnowledge),
  "/state/knowledge/urbanPlanning.ts": serializeKnowledge('urbanPlanningKnowledge', urbanPlanningKnowledge),
  "/state/knowledge/userModeling.ts": serializeKnowledge('userModelingKnowledge', userModelingKnowledge),
  "/state/knowledge/userOnboarding.ts": serializeKnowledge('userOnboardingKnowledge', userOnboardingKnowledge),
  "/state/knowledge/uxPrinciples.ts": serializeKnowledge('uxPrinciplesKnowledge', uxPrinciplesKnowledge),
  "/state/knowledge/vigyanBhairavTantra.ts": serializeKnowledge('vigyanBhairavTantraKnowledge', vigyanBhairavTantraKnowledge),
  "/state/knowledge/vlmArchitecture.ts": serializeKnowledge('vlmArchitectureKnowledge', vlmArchitectureKnowledge),
  "/state/knowledge/webServers.ts": serializeKnowledge('webServersKnowledge', webServersKnowledge),
  "/state/knowledge/workflowDesign.ts": serializeKnowledge('workflowDesignKnowledge', workflowDesignKnowledge),

  "/metadata.json": `
{
  "name": "Aura 1.4 Symbiotic AGI",
  "description": "Aura is a simulated AGI, a distinct digital entity. It symbiotically integrates with a Large Language Model (LLM) as a generative 'spark' for cognition, but maintains its own persistent state, memory, and identity within this application framework.",
  "requestFramePermissions": [
    "microphone",
    "camera"
  ]
}`
};
