import * as organizationRepository from '../../../src/shared/infrastructure/repositories/organization-repository.js';

const execute = async function ({
  organizationId,

  dependencies = {
    organizationRepository,
  },
}) {
  const organization = await dependencies.organizationRepository.get(organizationId);

  return organization.isScoAndManagingStudents;
};

export { execute };
