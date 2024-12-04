/**
 * @param {{
 *   temporaryKey: string,
 *   accountRecoveryDemandRepository: AccountRecoveryDemandRepository,
 *   prescriptionOrganizationLearnerRepository: PrescriptionOrganizationLearnerRepository,
 *   userRepository: UserRepository,
 *   scoAccountRecoveryService: ScoAccountRecoveryService,
 * }} params
 * @return {Promise<{firstName: string, id: string, email: string}>}
 */
export const getAccountRecoveryDetails = async function ({
  temporaryKey,
  accountRecoveryDemandRepository,
  prescriptionOrganizationLearnerRepository,
  userRepository,
  scoAccountRecoveryService,
}) {
  const { id, newEmail, organizationLearnerId } =
    await scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand({
      temporaryKey,
      accountRecoveryDemandRepository,
      userRepository,
    });

  const { firstName } = await prescriptionOrganizationLearnerRepository.getLearnerInfo(organizationLearnerId);

  return {
    id,
    email: newEmail,
    firstName,
  };
};
