import { getAllFeaturesFromOrganization } from '../../../organizational-entities/application/api/organization-features-api.js';
import { usecases as prescriptionUsecases } from '../../../prescription/organization-place/domain/usecases/index.js';
import { ORGANIZATION_FEATURE } from '../../domain/constants.js';
import { ForbiddenAccess } from '../../domain/errors.js';

const execute = async function ({ organizationId, dependencies = { getAllFeaturesFromOrganization } }) {
  const { features } = await dependencies.getAllFeaturesFromOrganization(organizationId);

  const placesManagementFeature = features.find(
    (feature) => feature.name === ORGANIZATION_FEATURE.PLACES_MANAGEMENT.key,
  );
  const hasLockEnabled = placesManagementFeature?.params?.enablePlacesThresholdLock;

  if (!hasLockEnabled) return true;

  const placesStatistics = await prescriptionUsecases.getOrganizationPlacesStatistics({ organizationId });

  if (placesStatistics.hasReachMaximumPlacesWithThreshold) {
    throw new ForbiddenAccess('Maximum places reached', 'MAXIMUM_PLACES_REACHED');
  }

  return true;
};

export { execute };
