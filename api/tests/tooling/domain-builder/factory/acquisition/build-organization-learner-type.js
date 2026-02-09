import { OrganizationLearnerType } from '../../../../../src/organizational-entities/domain/models/OrganizationLearnerType.js';

const buildOrganizationLearnerType = function ({ name = 'Élève' } = {}) {
  return new OrganizationLearnerType({ name });
};

export { buildOrganizationLearnerType };
