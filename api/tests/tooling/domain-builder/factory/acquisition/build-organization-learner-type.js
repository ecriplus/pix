import { OrganizationLearnerType } from '../../../../../src/organizational-entities/domain/models/OrganizationLearnerType.js';

const buildOrganizationLearnerType = function ({ id = 1234, name = 'Élève' } = {}) {
  return new OrganizationLearnerType({ id, name });
};

export { buildOrganizationLearnerType };
