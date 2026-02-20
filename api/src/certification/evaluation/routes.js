import * as scenarioSimulatorRoutes from '../evaluation/application/scenario-simulator-route.js';
import * as certificationAdminRoutes from './application/certification-admin-route.js';
import * as certificationCourseRoutes from './application/certification-course-route.js';
import * as certificationRescoringRoutes from './application/certification-rescoring-route.js';
import * as companionAlert from './application/companion-alert-route.js';
import * as scoringAndCapacitySimulator from './application/scoring-and-capacity-simulator-route.js';
import * as scoringConfiguration from './application/scoring-configuration-route.js';

const certificationEvaluationRoutes = [
  companionAlert,
  certificationCourseRoutes,
  certificationAdminRoutes,
  certificationRescoringRoutes,
  scenarioSimulatorRoutes,
  scoringAndCapacitySimulator,
  scoringConfiguration,
];

export { certificationEvaluationRoutes };
