export const createAttestation = async ({ templateKey, templateName, templateFile, attestationRepository }) => {
  await attestationRepository.save({ templateKey, templateName, templateFile });
};
