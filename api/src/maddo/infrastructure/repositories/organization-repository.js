import { knex } from '../../../../db/knex-database-connection.js';
import { Organization } from '../../domain/models/Organization.js';

export async function findIdsByTagNames(tagNames) {
  return knex
    .pluck('organization-tags.organizationId')
    .from('organization-tags')
    .join('tags', 'tags.id', 'organization-tags.tagId')
    .whereIn('tags.name', tagNames)
    .groupBy('organization-tags.organizationId')
    .havingRaw('count(*) = ?', [tagNames.length])
    .orderBy('organization-tags.organizationId');
}

export async function findByIds(organizationIds) {
  const rawOrganizations = await knex
    .select('id', 'name', 'externalId')
    .from('organizations')
    .whereIn('id', organizationIds)
    .orderBy('id');
  return rawOrganizations.map(toDomain);
}

function toDomain(rawOrganization) {
  return new Organization(rawOrganization);
}
