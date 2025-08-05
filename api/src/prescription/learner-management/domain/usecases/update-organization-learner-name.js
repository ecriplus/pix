const updateOrganizationLearnerName = async ({
  organizationLearnerId,
  firstName,
  lastName,
  organizationLearnerRepository,
}) => {
  const organizationLearner = await organizationLearnerRepository.getLearnerInfo(organizationLearnerId);
  organizationLearner.updateName(firstName, lastName);
  return await organizationLearnerRepository.update(organizationLearner);
};

export { updateOrganizationLearnerName };
