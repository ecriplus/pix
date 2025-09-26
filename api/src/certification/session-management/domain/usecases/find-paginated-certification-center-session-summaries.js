import { ForbiddenAccess } from '../../../../../src/shared/domain/errors.js';

const findPaginatedCertificationCenterSessionSummaries = async function ({
  userId,
  certificationCenterId,
  page,
  sessionSummaryRepository,
  userRepository,
}) {
  const hasAccess = await userRepository.isUserAllowedToAccessCertificationCenter(userId, certificationCenterId);
  if (!hasAccess) {
    throw new ForbiddenAccess(`User ${userId} is not a member of certification center ${certificationCenterId}`);
  }

  return sessionSummaryRepository.findPaginatedByCertificationCenterId({ certificationCenterId, page });
};

export { findPaginatedCertificationCenterSessionSummaries };
