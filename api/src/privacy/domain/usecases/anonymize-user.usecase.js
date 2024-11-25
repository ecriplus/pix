import { UserAnonymizedEventLoggingJob } from '../../../identity-access-management/domain/models/UserAnonymizedEventLoggingJob.js';
import { config } from '../../../shared/config.js';
import { withTransaction } from '../../../shared/domain/DomainTransaction.js';

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
  organizationLearnerRepository,
  refreshTokenRepository,
  resetPasswordDemandRepository,
  userLoginRepository,
  userAnonymizedEventLoggingJobRepository,
}) {
  const user = await userRepository.get(userId);

  await userRepository.get(anonymizedByUserId);

  await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({ userId });

  await refreshTokenRepository.revokeAllByUserId({ userId });

  if (user.email) {
    await resetPasswordDemandRepository.removeAllByEmail(user.email);
  }

  await membershipRepository.disableMembershipsByUserId({ userId, updatedByUserId: anonymizedByUserId });

  await certificationCenterMembershipRepository.disableMembershipsByUserId({
    updatedByUserId: anonymizedByUserId,
    userId,
  });

  await organizationLearnerRepository.dissociateAllStudentsByUserId({ userId });

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

export { anonymizeUser };
