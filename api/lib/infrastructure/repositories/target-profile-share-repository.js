import { knex } from '../../../db/knex-database-connection.js';
import { DomainTransaction } from '../../../src/shared/domain/DomainTransaction.js';

const batchAddTargetProfilesToOrganization = async function (organizationTargetProfiles) {
  const knexConn = DomainTransaction.getConnection();
  await knex
    .batchInsert('target-profile-shares', organizationTargetProfiles)
    .transacting(knexConn.isTransaction ? knexConn : null);
};

export { batchAddTargetProfilesToOrganization };
