export const createAttestation = async ({ templateKey, templateName, templateFile, label, attestationRepository }) => {
  await attestationRepository.save({ templateKey, templateName, templateFile, label });
};
