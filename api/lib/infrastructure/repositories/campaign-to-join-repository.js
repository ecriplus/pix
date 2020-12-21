const { knex } = require('../bookshelf');
const CampaignToJoin = require('../../domain/models/CampaignToJoin');
const { NotFoundError } = require('../../domain/errors');

module.exports = {

  async get(id) {
    const result = await knex('campaigns')
      .select('campaigns.*')
      .select({
        'organizationId': 'organizations.id',
        'organizationName': 'organizations.name',
        'organizationType': 'organizations.type',
        'organizationLogoUrl': 'organizations.logoUrl',
        'organizationIsManagingStudents': 'organizations.isManagingStudents',
      })
      .join('organizations', 'organizations.id', 'campaigns.organizationId')
      .where('campaigns.id', id)
      .first();

    if (!result) {
      throw new NotFoundError(`La campagne d'id ${id} n'existe pas ou son accès est restreint`);
    }

    return new CampaignToJoin(result);
  },
};
