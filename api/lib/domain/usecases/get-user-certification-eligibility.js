const CertificationEligibility = require('../read-models/CertificationEligibility');
const { PIX_EMPLOI_CLEA_V1 } = require('../models/Badge').keys;
const { getLabelByBadgeKey } = require('../read-models/CertifiableBadgeLabels');

module.exports = async function getUserCertificationEligibility({
  userId,
  placementProfileService,
  certificationBadgesService,
}) {
  const now = new Date();
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate: now });
  const pixCertificationEligible = placementProfile.isCertifiable();

  if (!pixCertificationEligible) {
    return CertificationEligibility.notCertifiable({ userId });
  }

  const stillValidBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
    userId,
  });

  const eligibleComplementaryCertifications = stillValidBadgeAcquisitions.map(({ badgeKey }) =>
    getLabelByBadgeKey(badgeKey)
  );

  const hasStillValidCleaBadge = await certificationBadgesService.hasStillValidCleaBadgeAcquisition({ userId });

  if (hasStillValidCleaBadge) {
    eligibleComplementaryCertifications.unshift(getLabelByBadgeKey(PIX_EMPLOI_CLEA_V1));
  }

  return new CertificationEligibility({
    id: userId,
    pixCertificationEligible,
    eligibleComplementaryCertifications,
  });
};
