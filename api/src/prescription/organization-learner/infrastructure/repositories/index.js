import * as attestationsApi from '../../../../profile/application/api/attestations-api.js';
import { apiData as apiDataDatasource } from '../../../../shared/infrastructure/datasources/ApiData.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as analysisRepository from './analysis-repository.js';
import * as organizationLearnerRepository from './organization-learner-repository.js';

const repositoriesWithoutInjectedDependencies = {
  analysisRepository,
  organizationLearnerRepository,
};

const dependencies = {
  apiDataDatasource,
  attestationsApi,
};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
