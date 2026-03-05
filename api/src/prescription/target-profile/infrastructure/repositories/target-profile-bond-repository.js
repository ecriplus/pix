import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

const update = async function (targetProfile) {
  const knexConn = DomainTransaction.getConnection();

  const results = await knexConn('target-profile-shares')
    .where('targetProfileId', targetProfile.id)
    .whereIn('organizationId', targetProfile.organizationIdsToDetach)
    .del()
    .returning('organizationId');
  return results.map(({ organizationId }) => organizationId);
};

const deleteByTargetProfileId = async function (targetProfileId) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('target-profile-shares').where({ targetProfileId }).del();
};

export { deleteByTargetProfileId, update };
