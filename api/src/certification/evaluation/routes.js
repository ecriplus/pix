import * as companionAlert from '../evaluation/application/companion-alert-route.js';
import * as certificationAdminRoutes from './application/certification-admin-route.js';
import * as certificationCourseRoutes from './application/certification-course-route.js';
import * as certificationRescoringRoutes from './application/certification-rescoring-route.js';

const certificationEvaluationRoutes = [
  companionAlert,
  certificationCourseRoutes,
  certificationAdminRoutes,
  certificationRescoringRoutes,
];

export { certificationEvaluationRoutes };
