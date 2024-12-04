const computeOrganizationLearnerCertificability = async function ({
  organizationLearnerId,
  organizationLearnerRepository,
  placementProfileService,
}) {
  const organizationLearner = await organizationLearnerRepository.getLearnerInfo(organizationLearnerId);

  const placementProfile = await placementProfileService.getPlacementProfile({
    userId: organizationLearner.userId,
    limitDate: new Date().toISOString(),
  });

  await organizationLearner.updateCertificability(placementProfile);

  await organizationLearnerRepository.updateCertificability(organizationLearner);
};

export { computeOrganizationLearnerCertificability };
