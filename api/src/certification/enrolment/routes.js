import * as attendanceSheet from './application/attendance-sheet-route.js';
import * as certificationCandidate from './application/certification-candidate-route.js';
import * as certificationCenter from './application/certification-center-route.js';
import * as certificationCentersGetDivisions from './application/certification-centers-get-divisions-route.js';
import * as enrolment from './application/enrolment-route.js';
import * as sessionMassImport from './application/session-mass-import-route.js';
import * as session from './application/session-route.js';
import * as subscription from './application/subscription-route.js';
import * as user from './application/user-route.js';

const certificationEnrolmentRoutes = [
  attendanceSheet,
  certificationCandidate,
  enrolment,
  session,
  sessionMassImport,
  certificationCenter,
  certificationCentersGetDivisions,
  subscription,
  user,
];

export { certificationEnrolmentRoutes };
