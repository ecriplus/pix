import * as attachTargetProfile from './application/attach-target-profile-route.js';
import * as certificationFramework from './application/certification-framework-route.js';
import * as certificationVersion from './application/certification-version-route.js';
import * as complementaryCertification from './application/complementary-certification-route.js';
import * as scoBlockedAccessDates from './application/sco-blocked-access-dates-route.js';
import * as scoWhitelist from './application/sco-whitelist-route.js';

const attachTargetProfileRoutes = [attachTargetProfile];
const certificationConfigurationRoutes = [certificationVersion, complementaryCertification, certificationFramework];
const scoBlockedAccessDatesRoutes = [scoBlockedAccessDates];
const scoWhitelistRoutes = [scoWhitelist];

export { attachTargetProfileRoutes, certificationConfigurationRoutes, scoBlockedAccessDatesRoutes, scoWhitelistRoutes };
