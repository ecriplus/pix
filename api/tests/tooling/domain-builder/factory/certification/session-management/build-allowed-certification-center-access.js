import { AllowedCertificationCenterAccess } from '../../../../../../src/certification/session-management/domain/read-models/AllowedCertificationCenterAccess.js';

function buildAllowedCertificationCenterAccess({
  isAccessBlockedUntilDate = false,
  pixCertifBlockedAccessUntilDate = null,
} = {}) {
  return new AllowedCertificationCenterAccess({
    isAccessBlockedUntilDate,
    pixCertifBlockedAccessUntilDate,
  });
}

buildAllowedCertificationCenterAccess.blocked = function ({ pixCertifBlockedAccessUntilDate = '2325-12-31' } = {}) {
  return new AllowedCertificationCenterAccess({
    isAccessBlockedUntilDate: true,
    pixCertifBlockedAccessUntilDate,
  });
};

export { buildAllowedCertificationCenterAccess };
