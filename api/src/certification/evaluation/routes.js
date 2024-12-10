import * as companionAlert from '../evaluation/application/companion-alert-route.js';
import * as certificationAdminRoutes from './application/certification-admin-route.js';
import * as certificationCourseRoutes from './application/certification-course-route.js';

const certificationEvaluationRoutes = [companionAlert, certificationCourseRoutes, certificationAdminRoutes];

export { certificationEvaluationRoutes };
