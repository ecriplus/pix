import { prescriberRoles } from '../../application/pre-handlers/CampaignAuthorization.js';
import { DomainTransaction } from '../../domain/DomainTransaction.js';

const getForCampaign = async function ({ userId, campaignId }) {
  const result = await _getCampaignAccess({ userId, campaignId });

  if (!result) return null;

  let prescriberRole = result.organizationRole;
  if (userId === result.ownerId) {
    prescriberRole = prescriberRoles.OWNER;
  }
  return prescriberRole;
};

export { getForCampaign };

function _getCampaignAccess({ campaignId, userId }) {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('campaigns')
    .select('ownerId', 'memberships.organizationRole')
    .join('memberships', function () {
      this.on('memberships.organizationId', 'campaigns.organizationId')
        .andOnVal('userId', userId)
        .andOnVal('disabledAt', knexConn.raw('IS'), knexConn.raw('NULL'));
    })
    .where('campaigns.id', campaignId)
    .first();
}
