export const findPaginatedFilteredAttestationParticipantsStatus = async ({
  attestationKey,
  organizationId,
  filter,
  page,
  organizationLearnerRepository,
}) => {
  const { search: name, divisions, statuses } = filter;

  const { attestationParticipantsStatus, pagination } =
    await organizationLearnerRepository.findPaginatedAttestationStatusForOrganizationLearnersAndKey({
      attestationKey,
      filter: { name, divisions, statuses },
      page,
      organizationId,
    });

  return {
    attestationParticipantsStatus,
    pagination,
  };
};
