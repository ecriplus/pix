import * as assessmentsRoutes from './application/assessments/index.js';
import * as challengesRoutes from './application/challenges/index.js';
import * as courses from './application/courses/index.js';
import * as featureToggles from './application/feature-toggles/index.js';
import * as healthcheck from './application/healthcheck/index.js';

const sharedRoutes = [healthcheck, assessmentsRoutes, challengesRoutes, courses, featureToggles];

export { sharedRoutes };
