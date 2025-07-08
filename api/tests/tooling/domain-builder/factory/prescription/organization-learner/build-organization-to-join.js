import { OrganizationToJoin } from '../../../../../../src/prescription/organization-learner/domain/models/OrganizationToJoin.js';
import { buildOrganizationLearnerImportFormat } from '../learner-management/build-organization-learner-import-format.js';

export const buildOrganizationToJoin = function ({
  id = 1,
  name = 'My Organization',
  type = 'SCO',
  logoUrl = 'https://pix.fr/my-logo.png',
  isManagingStudents = false,
  identityProvider = null,
  organizationLearnerImportFormat = buildOrganizationLearnerImportFormat(),
} = {}) {
  return new OrganizationToJoin({
    id,
    name,
    type,
    logoUrl,
    isManagingStudents,
    identityProvider,
    organizationLearnerImportFormat,
  });
};
