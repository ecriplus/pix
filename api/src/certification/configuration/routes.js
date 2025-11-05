import * as attachTargetProfile from './application/attach-target-profile-route.js';
import * as certificationVersion from './application/certification-version-route.js';
import * as complementaryCertification from './application/complementary-certification-route.js';
import * as scoWhitelist from './application/sco-whitelist-route.js';

const attachTargetProfileRoutes = [attachTargetProfile];
const certificationConfigurationRoutes = [certificationVersion, complementaryCertification];
const scoWhitelistRoutes = [scoWhitelist];

export { attachTargetProfileRoutes, certificationConfigurationRoutes, scoWhitelistRoutes };
