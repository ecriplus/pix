import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { OrganizationMemberIdentity } from '../../domain/models/OrganizationMemberIdentity.js';

const findAllByOrganizationId = async function ({ organizationId }) {
  const knexConn = DomainTransaction.getConnection();

  const sortedMembers = await knexConn('users')
    .select('users.id', 'users.firstName', 'users.lastName')
    .join('memberships', 'memberships.userId', 'users.id')
    .where({ disabledAt: null, organizationId })
    .orderByRaw('LOWER("firstName") asc')
    .orderByRaw('LOWER("lastName") asc');

  return sortedMembers.map((sortedMember) => new OrganizationMemberIdentity({ ...sortedMember }));
};

export { findAllByOrganizationId };
