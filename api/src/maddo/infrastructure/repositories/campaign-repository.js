import { knex } from '../../../../db/knex-database-connection.js';
import { Campaign } from '../../domain/models/Campaign.js';

export async function findByOrganizationId(organizationId) {
  const rawCampaigns = await knex
    .select(
      'campaigns.id',
      'campaigns.organizationId',
      'campaigns.name',
      'campaigns.type',
      'campaigns.targetProfileId',
      'campaigns.code',
      'campaigns.createdAt',
      'target-profiles.name as targetProfileName',
      'organizations.name as organizationName',
    )
    .from('campaigns')
    .join('organizations', 'campaigns.organizationId', 'organizations.id')
    .join('target-profiles', 'campaigns.targetProfileId', 'target-profiles.id')
    .where('campaigns.organizationId', organizationId)
    .orderBy('campaigns.id');
  return rawCampaigns.map(toDomain);
}

function toDomain(rawCampaign) {
  return new Campaign(rawCampaign);
}
