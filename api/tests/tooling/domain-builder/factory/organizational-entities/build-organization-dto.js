import { OrganizationDTO } from '../../../../../src/organizational-entities/application/api/OrganizationDTO.js';

function buildOrganizationDto({
  id = 123,
  name = 'Lycée Luke Skywalker',
  type = 'SCO',
  logoUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  isManagingStudents = false,
  identityProviderForCampaigns = 'GAR',
} = {}) {
  return new OrganizationDTO({
    id,
    name,
    type,
    logoUrl,
    isManagingStudents,
    identityProviderForCampaigns,
  });
}

export { buildOrganizationDto };
