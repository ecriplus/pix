import { config } from '../../../shared/config.js';
import { UserNotFoundError } from '../../../shared/domain/errors.js';
import { UserAnonymizedEventLoggingJob } from '../models/UserAnonymizedEventLoggingJob.js';

/**
 * @param params
 * @param{string} params.userId
 * @param{string} params.updatedByUserId
 * @param{UserRepository} params.userRepository
 * @param{AuthenticationMethodRepository} params.authenticationMethodRepository
 * @param{MembershipRepository} params.membershipRepository
 * @param{CertificationCenterMembershipRepository} params.certificationCenterMembershipRepository
 * @param{OrganizationLearnerRepository} params.organizationLearnerRepository
 * @param{RefreshTokenRepository} params.refreshTokenRepository
 * @param{ResetPasswordDemandRepository} params.resetPasswordDemandRepository
 * @param{UserLoginRepository} params.userLoginRepository
 * @param{AdminMemberRepository} params.adminMemberRepository
 * @param{UserAnonymizedEventLoggingJobRepository} params.userAnonymizedEventLoggingJobRepository
 * @returns {Promise<null>}
 */
const anonymizeUser = async function ({
  userId,
  updatedByUserId,
  userRepository,
  authenticationMethodRepository,
  membershipRepository,
  certificationCenterMembershipRepository,
  organizationLearnerRepository,
  refreshTokenRepository,
  resetPasswordDemandRepository,
  userLoginRepository,
  adminMemberRepository,
  userAnonymizedEventLoggingJobRepository,
}) {
  const user = await userRepository.get(userId);

  const anonymizedBy = await _getAdminUser({
    adminUserId: updatedByUserId,
    adminMemberRepository,
  });

  await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({ userId });

  await refreshTokenRepository.revokeAllByUserId({ userId });

  if (user.email) {
    await resetPasswordDemandRepository.removeAllByEmail(user.email);
  }

  await membershipRepository.disableMembershipsByUserId({ userId, updatedByUserId: anonymizedBy.userId });

  await certificationCenterMembershipRepository.disableMembershipsByUserId({
    updatedByUserId: anonymizedBy.userId,
    userId,
  });

  await organizationLearnerRepository.dissociateAllStudentsByUserId({ userId });

  await _anonymizeUserLogin({ userId, userLoginRepository });

  await _anonymizeUser({ user, anonymizedByUserId: anonymizedBy.userId, userRepository });

  if (config.auditLogger.isEnabled) {
    await userAnonymizedEventLoggingJobRepository.performAsync(
      new UserAnonymizedEventLoggingJob({
        userId,
        updatedByUserId: anonymizedBy.userId,
        client: 'PIX_ADMIN',
        role: anonymizedBy.role,
      }),
    );
  }
  return null;
};

async function _getAdminUser({ adminUserId, adminMemberRepository }) {
  const admin = await adminMemberRepository.get({ userId: adminUserId });
  if (!admin) {
    throw new UserNotFoundError(`Admin not found for id: ${adminUserId}`);
  }
  return admin;
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

export { anonymizeUser };
