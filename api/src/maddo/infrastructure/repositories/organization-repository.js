import { knex } from '../../../../db/knex-database-connection.js';

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
