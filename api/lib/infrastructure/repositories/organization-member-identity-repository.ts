// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationMemberIdentity = require('../../domain/models/OrganizationMemberIdentity');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findAllByOrganizationId({
    organizationId
  }: $TSFixMe) {
    const sortedMembers = await knex('users')
      .select('users.id', 'users.firstName', 'users.lastName')
      .join('memberships', 'memberships.userId', 'users.id')
      .where({ disabledAt: null, organizationId })
      .orderByRaw('LOWER("firstName") asc')
      .orderByRaw('LOWER("lastName") asc');

    return sortedMembers.map((sortedMember: $TSFixMe) => new OrganizationMemberIdentity({ ...sortedMember }));
  },
};
