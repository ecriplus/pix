import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

const batchAddTargetProfilesToOrganization = async function (organizationTargetProfiles) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn
    .batchInsert('target-profile-shares', organizationTargetProfiles)
    .transacting(knexConn.isTransaction ? knexConn : null);
};

export { batchAddTargetProfilesToOrganization };
