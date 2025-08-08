import * as organizationFeatureRepository from '../../infrastructure/repositories/organization-feature-repository.js';

const execute = async ({ organizationId, featureKey, dependencies = { organizationFeatureRepository } }) => {
  const featureEnabledForOrganization =
    await dependencies.organizationFeatureRepository.isFeatureEnabledForOrganization({
      organizationId,
      featureKey,
    });
  return !featureEnabledForOrganization;
};

export { execute };
