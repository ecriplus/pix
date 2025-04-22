import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import * as organizationApi from '../../../team/application/api/organization.js';
import { organizationForAdminRepository } from './organization-for-admin.repository.js';

const repositoriesWithoutInjectedDependencies = {
  organizationForAdminRepository,
};

const dependencies = {
  organizationApi,
};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
