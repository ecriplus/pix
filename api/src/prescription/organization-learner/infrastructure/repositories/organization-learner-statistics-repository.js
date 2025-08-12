import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { CampaignParticipationStatuses } from '../../../shared/domain/constants.js';

const getParticipationStatistics = async function ({ organizationId, ownerId }) {
  const knexConnection = DomainTransaction.getConnection();

  return knexConnection('campaign-participations')
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .select(
      knexConnection.raw('count(*) as "totalParticipationCount"'),
      knexConnection.raw(
        `count(*) filter (where "status" = ?) as "completedParticipationCount"`,
        CampaignParticipationStatuses.SHARED,
      ),
    )
    .whereNull('campaigns.deletedAt')
    .whereNull('campaigns.archivedAt')
    .where({
      'campaigns.organizationId': organizationId,
      'campaigns.ownerId': ownerId,
    })
    .first();
};

export { getParticipationStatistics };
