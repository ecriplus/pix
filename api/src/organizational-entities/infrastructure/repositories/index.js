import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import * as organizationApi from '../../../team/application/api/organization.js';
import { certificationCenterApiRepository } from './certification-center-api.repository.js';
import { organizationForAdminRepository } from './organization-for-admin.repository.js';

const repositoriesWithoutInjectedDependencies = {
  organizationForAdminRepository,
  certificationCenterApiRepository,
};

const dependencies = {
  organizationApi,
};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
