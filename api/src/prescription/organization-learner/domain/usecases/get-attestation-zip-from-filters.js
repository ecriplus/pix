export const getAttestationZipFromFilters = async ({
  attestationKey,
  organizationId,
  divisions,
  organizationLearnerRepository,
}) => {
  const userIds = await organizationLearnerRepository.findUserIdsFromFilters({
    organizationId,
    filters: { divisions },
  });

  return organizationLearnerRepository.getAttestationsForOrganizationLearnersAndKey({
    attestationKey,
    userIds,
    organizationId,
  });
};
