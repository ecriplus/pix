import * as attestationRoute from './application/attestation-route.js';
import * as combinedCourseBlueprintRoute from './application/combined-course-blueprint-route.js';
import * as combinedCourseRoute from './application/combined-course-route.js';
import * as questRoute from './application/quest-route.js';
import * as verifiedCodeRoute from './application/verified-code-route.js';

const questRoutes = [
  combinedCourseRoute,
  questRoute,
  verifiedCodeRoute,
  combinedCourseBlueprintRoute,
  attestationRoute,
];

export { questRoutes };
