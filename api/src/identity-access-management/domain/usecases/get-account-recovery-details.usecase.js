/**
 * @param {{
 *   temporaryKey: string,
 *   accountRecoveryDemandRepository: AccountRecoveryDemandRepository,
 *   prescriptionOrganizationLearnerRepository: PrescriptionOrganizationLearnerRepository,
 *   userRepository: UserRepository,
 *   authenticationMethodRepository: AuthenticationMethodRepository,
 *   scoAccountRecoveryService: ScoAccountRecoveryService,
 * }} params
 * @return {Promise<{firstName: string, id: string, email: string, hasGarAuthenticationMethod: boolean, hasScoUsername: boolean}>}
 */
export const getAccountRecoveryDetails = async function ({
  temporaryKey,
  accountRecoveryDemandRepository,
  prescriptionOrganizationLearnerRepository,
  userRepository,
  authenticationMethodRepository,
  scoAccountRecoveryService,
}) {
  const { id, userId, newEmail, organizationLearnerId } =
    await scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand({
      temporaryKey,
      accountRecoveryDemandRepository,
      userRepository,
    });
  const hasGarAuthenticationMethod = await authenticationMethodRepository.hasIdentityProviderGar({ userId });
  const user = await userRepository.get(userId);
  const hasScoUsername = user.username ? true : false;
  const { firstName } = await prescriptionOrganizationLearnerRepository.getLearnerInfo(organizationLearnerId);

  return {
    id,
    email: newEmail,
    firstName,
    hasGarAuthenticationMethod,
    hasScoUsername,
  };
};
