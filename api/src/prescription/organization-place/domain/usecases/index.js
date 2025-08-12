import * as organizationFeatureApi from '../../../../organizational-entities/application/api/organization-features-api.js';
import * as organizationLearnerRepository from '../../../../prescription/organization-learner/infrastructure/repositories/organization-learner-repository.js';
import * as organizationRepository from '../../../../shared/infrastructure/repositories/organization-repository.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as organizationPlacesCapacityRepository from '../../infrastructure/repositories/organization-places-capacity-repository.js';
import * as organizationPlacesLotRepository from '../../infrastructure/repositories/organization-places-lot-repository.js';

const dependencies = {
  organizationLearnerRepository,
  organizationPlacesLotRepository,
  organizationRepository,
  organizationPlacesCapacityRepository,
  organizationFeatureApi,
};

import { createOrganizationPlacesLot } from './create-organization-places-lot.js';
import { deleteOrganizationPlacesLot } from './delete-organization-places-lot.js';
import { findOrganizationPlacesLot } from './find-organization-places-lot.js';
import { getDataOrganizationsPlacesStatistics } from './get-data-organizations-places-statistics.js';
import { getOrganizationPlacesCapacity } from './get-organization-places-capacity.js';
import { getOrganizationPlacesLots } from './get-organization-places-lots.js';
import { getOrganizationPlacesStatistics } from './get-organization-places-statistics.js';

const usecasesWithoutInjectedDependencies = {
  createOrganizationPlacesLot,
  deleteOrganizationPlacesLot,
  findOrganizationPlacesLot,
  getDataOrganizationsPlacesStatistics,
  getOrganizationPlacesCapacity,
  getOrganizationPlacesLots,
  getOrganizationPlacesStatistics,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
