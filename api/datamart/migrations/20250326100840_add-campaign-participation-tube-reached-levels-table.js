const TABLE_NAME = 'campaign_participation_tube_reached_levels';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments().primary();

    table.string('tube_id').notNullable().comment('Framework tube id');

    table.integer('campaign_participation_id').notNullable().comment('Campaign participation id');

    table
      .smallint('reached_level')
      .notNullable()
      .comment(
        'Maximum level reached by the learner. It matches the highest skill level obtained by the user for this tube.',
      );

    table.unique(['campaign_participation_id', 'tube_id']);

    table.comment(
      `This table stores the levels reached by the learners once they share the campaign.
          Each row contains the highest reached level for a campaign tube.`,
    );
  });
};

const down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
