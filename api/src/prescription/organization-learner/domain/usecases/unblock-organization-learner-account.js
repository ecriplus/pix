const unblockOrganizationLearnerAccount = async function ({
  organizationId,
  organizationLearnerId,
  userLoginRepository,
  prescriptionOrganizationLearnerRepository,
}) {
  const [organizationLearner] =
    await prescriptionOrganizationLearnerRepository.findOrganizationLearnersByOrganizationIdAndLearnerIds({
      organizationId,
      organizationLearnerIds: [organizationLearnerId],
    });
  const userLogin = await userLoginRepository.getByUserId(organizationLearner.userId);
  userLogin.resetUserBlocking();
  return await userLoginRepository.update(userLogin);
};

export { unblockOrganizationLearnerAccount };
