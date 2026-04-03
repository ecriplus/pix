import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

const deleteOrganizationLearnerFiltersFromOrganizationId = async function (organizationId) {
  const knexConn = DomainTransaction.getConnection();

  await knexConn('organization_learner_filters').where('organization_id', organizationId).del();
};

export { deleteOrganizationLearnerFiltersFromOrganizationId };
