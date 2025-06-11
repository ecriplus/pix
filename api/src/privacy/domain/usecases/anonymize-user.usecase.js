import { UserAnonymizedEventLoggingJob } from '../../../identity-access-management/domain/models/UserAnonymizedEventLoggingJob.js';
import { config } from '../../../shared/config.js';
import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { anonymizeGeneralizeDate } from '../../../shared/infrastructure/utils/date-utils.js';

/**
 * @param params
 * @param{string} params.userId
 * @param{string} params.anonymizedByUserId
 * @param{string} params.anonymizedByUserRole
 * @param{string} params.client
 * @param{UserRepository} params.userRepository
 * @param{AuthenticationMethodRepository} params.authenticationMethodRepository
 * @param{MembershipRepository} params.membershipRepository
 * @param{CertificationCenterMembershipRepository} params.certificationCenterMembershipRepository
 * @param{LastUserApplicationConnectionsRepository} params.lastUserApplicationConnectionsRepository
 * @param{OrganizationLearnerRepository} params.organizationLearnerRepository
 * @param{RefreshTokenRepository} params.refreshTokenRepository
 * @param{ResetPasswordDemandRepository} params.resetPasswordDemandRepository
 * @param{UserLoginRepository} params.userLoginRepository
 * @param{UserAnonymizedEventLoggingJobRepository} params.userAnonymizedEventLoggingJobRepository
 * @returns {Promise<void>}
 */
const anonymizeUser = withTransaction(async function ({
  userId,
  anonymizedByUserId,
  anonymizedByUserRole,
  client,
  userRepository,
  authenticationMethodRepository,
  membershipRepository,
  certificationCenterMembershipRepository,
  lastUserApplicationConnectionsRepository,
  organizationLearnerRepository,
  refreshTokenRepository,
  resetPasswordDemandRepository,
  userLoginRepository,
  userAnonymizedEventLoggingJobRepository,
  userAcceptanceRepository,
  learnersApiRepository,
  featureTogglesService,
}) {
  const user = await userRepository.get(userId);

  await userRepository.get(anonymizedByUserId);

  await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({ userId });

  await refreshTokenRepository.revokeAllByUserId({ userId });

  if (user.email) {
    await resetPasswordDemandRepository.removeAllByEmail(user.email);
  }

  await certificationCenterMembershipRepository.disableMembershipsByUserId({
    updatedByUserId: anonymizedByUserId,
    userId,
  });

  await _anonymizeOrganizationLearner({
    userId,
    featureTogglesService,
    learnersApiRepository,
    organizationLearnerRepository,
  });

  await _anonymizeMemberships({ membershipRepository, userId, updatedByUserId: anonymizedByUserId });

  await _anonymizeLastUserApplicationConnections(lastUserApplicationConnectionsRepository, userId);

  await _anonymizeCertificationCenterMembershipsLastAccessedAt(certificationCenterMembershipRepository, userId);

  await _anonymizeLastUserApplicationConnections(lastUserApplicationConnectionsRepository, userId);

  await userAcceptanceRepository.removeAllByUserId(userId);

  await _anonymizeUserLogin({ userId, userLoginRepository });

  await _anonymizeUser({ user, anonymizedByUserId, userRepository });

  if (config.auditLogger.isEnabled) {
    await userAnonymizedEventLoggingJobRepository.performAsync(
      new UserAnonymizedEventLoggingJob({
        userId,
        updatedByUserId: anonymizedByUserId,
        client,
        role: anonymizedByUserRole,
      }),
    );
  }
});

async function _anonymizeMemberships({ userId, anonymizedByUserId, membershipRepository }) {
  // Anonymize last accessed at
  const userMemberships = await membershipRepository.findByUserId(userId);

  for (const membership of userMemberships) {
    const anonymizedMembershipLastAccessedAt = anonymizeGeneralizeDate(membership.lastAccessedAt);
    await membershipRepository.updateLastAccessedAt({
      membershipId: membership.id,
      lastAccessedAt: anonymizedMembershipLastAccessedAt,
    });
  }

  // Disable Memberships
  await membershipRepository.disableMembershipsByUserId({ userId, updatedByUserId: anonymizedByUserId });
}

async function _anonymizeCertificationCenterMembershipsLastAccessedAt(certificationCenterMembershipRepository, userId) {
  const userCertificationCenterMemberships = await certificationCenterMembershipRepository.findByUserId(userId);

  for (const certificationCenterMembership of userCertificationCenterMemberships) {
    const anonymizedCertificationCenterMembershipLastAccessedAt = anonymizeGeneralizeDate(
      certificationCenterMembership.lastAccessedAt,
    );
    await certificationCenterMembershipRepository.updateLastAccessedAt({
      certificationCenterMembershipId: certificationCenterMembership.id,
      lastAccessedAt: anonymizedCertificationCenterMembershipLastAccessedAt,
    });
  }
}

async function _anonymizeLastUserApplicationConnections(lastUserApplicationConnectionsRepository, userId) {
  const lastUserApplicationConnections = await lastUserApplicationConnectionsRepository.findByUserId(userId);

  for (const lastUserApplicationConnection of lastUserApplicationConnections) {
    const anonymized = lastUserApplicationConnection.anonymize();
    await lastUserApplicationConnectionsRepository.upsert(anonymized);
  }
}

async function _anonymizeUserLogin({ userId, userLoginRepository }) {
  const userLogin = await userLoginRepository.findByUserId(userId);
  if (!userLogin) return;

  const anonymizedUserLogin = userLogin.anonymize();

  await userLoginRepository.update(anonymizedUserLogin, { preventUpdatedAt: true });
}

async function _anonymizeUser({ user, anonymizedByUserId, userRepository }) {
  const anonymizedUser = user.anonymize(anonymizedByUserId).mapToDatabaseDto();

  await userRepository.updateUserDetailsForAdministration(
    { id: user.id, userAttributes: anonymizedUser },
    { preventUpdatedAt: true },
  );
}

async function _anonymizeOrganizationLearner({
  userId,
  featureTogglesService,
  learnersApiRepository,
  organizationLearnerRepository,
}) {
  const isAnonymizationWithDeletionEnabled = await featureTogglesService.get('isAnonymizationWithDeletionEnabled');
  if (isAnonymizationWithDeletionEnabled) {
    await learnersApiRepository.anonymizeByUserId({ userId });
  } else {
    await organizationLearnerRepository.dissociateAllStudentsByUserId({ userId });
  }
}

export { anonymizeUser };
