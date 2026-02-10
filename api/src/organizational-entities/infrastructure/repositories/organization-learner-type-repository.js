import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { OrganizationLearnerType } from '../../domain/models/OrganizationLearnerType.js';

/**
 * @function
 * @returns {Promise<Array<OrganizationLearnerType>>}
 */
const findAll = async function () {
  const knexConn = DomainTransaction.getConnection();
  const organizationLearnerTypes = await knexConn
    .select('name')
    .from('organization_learner_types')
    .orderBy('name', 'asc');

  return organizationLearnerTypes.map(_toDomain);
};

const _toDomain = function (organizationLearnerTypeDTO) {
  return new OrganizationLearnerType({
    name: organizationLearnerTypeDTO.name,
  });
};

export { findAll };
