const TABLE_NAME = 'campaign-participation-tube-reached-levels';

const up = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

const down = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments().primary();

    table.string('tubeId').notNullable().comment('Framework tube id');

    table
      .integer('campaignParticipationId')
      .references('campaign-participations.id')
      .notNullable()
      .comment('Campaign participation id');

    table
      .smallint('reachedLevel')
      .notNullable()
      .comment(
        'Maximum level reached by the learner. It matches the highest skill level obtained by the user for this tube.',
      );
    table.comment(
      `This table stores the levels reached by the learners once they share the campaign.
          Each row contains the highest reached level for a campaign tube.`,
    );
  });
};

export { down, up };
