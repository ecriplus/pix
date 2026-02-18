import { DomainTransaction } from '../../domain/DomainTransaction.js';

const isFeatureEnabledForOrganization = async function ({ organizationId, featureKey }) {
  const knexConn = DomainTransaction.getConnection();
  const organizationFeature = await knexConn('organization-features')
    .join('features', function () {
      this.on('features.id', 'organization-features.featureId').andOnVal('features.key', featureKey);
    })
    .where({ organizationId })
    .first();
  return Boolean(organizationFeature);
};

export { isFeatureEnabledForOrganization };
