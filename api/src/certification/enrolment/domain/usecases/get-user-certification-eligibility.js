/**
 * @typedef {import ('./index.js').ComplementaryCertificationBadgeWithOffsetVersionRepository} ComplementaryCertificationBadgeWithOffsetVersionRepository
 */

import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';
import { CertificationEligibility, UserCertificationEligibility } from '../read-models/UserCertificationEligibility.js';

/**
 * @param {Object} params
 * @param {ComplementaryCertificationBadgeWithOffsetVersionRepository} params.complementaryCertificationBadgeWithOffsetVersionRepository
 */
const getUserCertificationEligibility = async function ({
  userId,
  limitDate = new Date(),
  placementProfileService,
  certificationBadgesService,
  complementaryCertificationCourseRepository,
  complementaryCertificationBadgeWithOffsetVersionRepository,
}) {
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate });
  const isCertifiable = placementProfile.isCertifiable();
  let doubleCertificationEligibility = {};

  if (!isCertifiable) {
    return new UserCertificationEligibility({
      id: userId,
      isCertifiable,
      doubleCertificationEligibility,
    });
  }

  const userAcquiredBadges = await certificationBadgesService.findLatestBadgeAcquisitions({
    userId,
    limitDate,
  });

  const [doubleCertificationBadge] = userAcquiredBadges.filter(
    (acquiredBadge) => acquiredBadge.complementaryCertificationKey === ComplementaryCertificationKeys.CLEA,
  );

  if (doubleCertificationBadge) {
    const allComplementaryCertificationBadgesForSameTargetProfile =
      await complementaryCertificationBadgeWithOffsetVersionRepository.getAllWithSameTargetProfile({
        complementaryCertificationBadgeId: doubleCertificationBadge.complementaryCertificationBadgeId,
      });
    const acquiredComplementaryCertificationBadge = allComplementaryCertificationBadgesForSameTargetProfile.find(
      ({ id }) => id === doubleCertificationBadge.complementaryCertificationBadgeId,
    );

    const badgeIsOutdated = acquiredComplementaryCertificationBadge?.offsetVersion !== 0;

    const userComplementaryCertifications = await complementaryCertificationCourseRepository.findByUserId({
      userId,
    });

    const hasvalidatedDoubleCertification = _hasvalidatedDoubleCertification(
      userComplementaryCertifications,
      acquiredComplementaryCertificationBadge,
    );


    const badgeIsOutdatedByOneVersionAndUserHasNoComplementaryCertificationForIt =
      acquiredComplementaryCertificationBadge?.offsetVersion === 1 && !hasvalidatedDoubleCertification;

    if (
      _isEligible({
        badgeIsOutdated,
        badgeIsOutdatedByOneVersionAndUserHasNoComplementaryCertificationForIt,
      })
    ) {
      doubleCertificationEligibility =
        new CertificationEligibility({
          label: doubleCertificationBadge.complementaryCertificationBadgeLabel,
          imageUrl: doubleCertificationBadge.complementaryCertificationBadgeImageUrl,
          isBadgeOutdated: doubleCertificationBadge.isOutdated,
          validatedDoubleCertification: hasvalidatedDoubleCertification,
        });
    }
  }

  return new UserCertificationEligibility({
    id: userId,
    isCertifiable,
    doubleCertificationEligibility,
  });
};

function _isEligible({ badgeIsOutdated, badgeIsOutdatedByOneVersionAndUserHasNoComplementaryCertificationForIt }) {
  return !badgeIsOutdated || badgeIsOutdatedByOneVersionAndUserHasNoComplementaryCertificationForIt;
}

function _hasvalidatedDoubleCertification(
  userComplementaryCertifications,
  acquiredComplementaryCertificationBadge,
) {
  return userComplementaryCertifications.some(
    (userComplementaryCertification) =>
      userComplementaryCertification.isAcquiredExpectedLevelByPixSource() &&
      acquiredComplementaryCertificationBadge?.id === userComplementaryCertification.complementaryCertificationBadgeId,
  );
}

export { getUserCertificationEligibility };
