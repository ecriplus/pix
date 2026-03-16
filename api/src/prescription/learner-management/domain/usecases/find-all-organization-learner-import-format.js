const findAllOrganizationLearnerImportFormats = async ({ organizationLearnerImportFormatRepository }) =>
  organizationLearnerImportFormatRepository.findAll();

export { findAllOrganizationLearnerImportFormats };
