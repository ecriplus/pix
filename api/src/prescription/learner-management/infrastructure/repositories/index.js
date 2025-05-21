import * as organizationFeatureApi from '../../../../organizational-entities/application/api/organization-features-api.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as campaignParticipationApi from '../../../campaign-participation/application/api/campaign-participations-api.js';
import * as campaignParticipationRepository from './campaign-participation-repository.js';
import * as organizationFeatureRepository from './organization-feature-repository.js';

const repositoriesWithoutInjectedDependencies = {
  organizationFeatureRepository,
  campaignParticipationRepository,
};

const dependencies = {
  organizationFeatureApi,
  campaignParticipationApi,
};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
