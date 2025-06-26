import { OrganizationToJoin } from '../../domain/models/OrganizationToJoin.js';

export async function get({ id, organizationApi, organizationLearnerImportFormatRepository }) {
  const organization = await organizationApi.getOrganization(id);
  const organizationLearnerImportFormat = await organizationLearnerImportFormatRepository.get(id);

  return new OrganizationToJoin({
    ...organization,
    organizationLearnerImportFormat,
  });
}
