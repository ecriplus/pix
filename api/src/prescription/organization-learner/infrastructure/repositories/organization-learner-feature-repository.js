import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { OrganizationLearner } from '../../domain/read-models/OrganizationLearner.js';

async function getOrganizationLearnersByFeature({ organizationId, featureKey }) {
  const knexConn = DomainTransaction.getConnection();
  const rawOrganizationLearnerFeatures = await knexConn
    .select('view-active-organization-learners.*')
    .from('view-active-organization-learners')
    .join(
      'organization-learner-features',
      'organization-learner-features.organizationLearnerId',
      'view-active-organization-learners.id',
    )
    .join('features', 'features.id', 'organization-learner-features.featureId')
    .where({ key: featureKey, organizationId });

  return rawOrganizationLearnerFeatures.map(
    (rawOrganizationLearnerFeature) => new OrganizationLearner(rawOrganizationLearnerFeature),
  );
}

async function create({ organizationLearnerId, featureId }) {
  const knexConn = DomainTransaction.getConnection();

  await knexConn('organization-learner-features').insert({ organizationLearnerId, featureId }).onConflict().ignore();
}

async function unlink({ organizationLearnerId, featureId }) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('organization-learner-features').where({ organizationLearnerId, featureId }).del();
}

export { create, getOrganizationLearnersByFeature, unlink };
