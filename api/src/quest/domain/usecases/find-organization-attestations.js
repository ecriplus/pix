export const findOrganizationAttestations = async ({ organizationId, attestationRepository }) => {
  return attestationRepository.findAllByOrganizationId({ organizationId });
};
