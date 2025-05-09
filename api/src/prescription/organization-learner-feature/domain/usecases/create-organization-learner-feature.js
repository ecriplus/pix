import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const createOrganizationLearnerFeature = withTransaction(
  async ({ organizationLearnerId, featureKey, featureRepository, organizationLearnerFeatureRepository }) => {
    const feature = await featureRepository.getFeatureByKey(featureKey);

    return await organizationLearnerFeatureRepository.create({
      organizationLearnerId,
      featureId: feature.id,
    });
  },
);
export { createOrganizationLearnerFeature };
