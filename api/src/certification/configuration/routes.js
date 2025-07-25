import * as complementaryCertification from './application/complementary-certification-route.js';
import * as flashAssessmentConfiguration from './application/flash-assessment-configuration-route.js';
import * as scoWhitelist from './application/sco-whitelist-route.js';

const certificationConfigurationRoutes = [complementaryCertification];
const scoWhitelistRoutes = [scoWhitelist];
const flashAssessmentConfigurationRoutes = [flashAssessmentConfiguration];

export { certificationConfigurationRoutes, flashAssessmentConfigurationRoutes, scoWhitelistRoutes };
