import * as scenarioSimulatorRoutes from '../evaluation/application/scenario-simulator-route.js';
import * as certificationAdminRoutes from './application/certification-admin-route.js';
import * as certificationCourseRoutes from './application/certification-course-route.js';
import * as certificationRescoringRoutes from './application/certification-rescoring-route.js';
import * as companionAlertRoutes from './application/companion-alert-route.js';
import * as liveAlertRoutes from './application/live-alert-route.js';
import * as scoringAndCapacitySimulatorRoutes from './application/scoring-and-capacity-simulator-route.js';

const certificationEvaluationRoutes = [
  companionAlertRoutes,
  liveAlertRoutes,
  certificationCourseRoutes,
  certificationAdminRoutes,
  certificationRescoringRoutes,
  scenarioSimulatorRoutes,
  scoringAndCapacitySimulatorRoutes,
];

export { certificationEvaluationRoutes };
