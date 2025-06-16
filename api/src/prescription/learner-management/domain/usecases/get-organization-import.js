const getOrganizationImport = async function ({ organizationImportId, organizationImportRepository }) {
  return organizationImportRepository.get(organizationImportId);
};

export { getOrganizationImport };
