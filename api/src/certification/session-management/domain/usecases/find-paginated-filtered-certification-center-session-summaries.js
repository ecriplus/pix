import { ForbiddenAccess } from '../../../../../src/shared/domain/errors.js';

const findPaginatedFilteredCertificationCenterSessionSummaries = async function ({
  userId,
  certificationCenterId,
  filters,
  page,
  sessionSummaryRepository,
  userRepository,
}) {
  const hasAccess = await userRepository.isUserAllowedToAccessCertificationCenter(userId, certificationCenterId);
  if (!hasAccess) {
    throw new ForbiddenAccess(`User ${userId} is not a member of certification center ${certificationCenterId}`);
  }

  return sessionSummaryRepository.findPaginatedFilteredByCertificationCenterId({
    certificationCenterId,
    filters,
    page,
  });
};

export { findPaginatedFilteredCertificationCenterSessionSummaries };
