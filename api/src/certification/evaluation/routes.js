import * as companionAlert from '../evaluation/application/companion-alert-route.js';
import * as certificationCourseRoutes from './application/certification-course-route.js';
import * as certificationRoutes from './application/certification-route.js';

const certificationEvaluationRoutes = [companionAlert, certificationCourseRoutes, certificationRoutes];

export { certificationEvaluationRoutes };
