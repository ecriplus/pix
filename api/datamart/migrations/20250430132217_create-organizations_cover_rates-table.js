const TABLE_NAME = 'organizations_cover_rates';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.text('tag_name');
    table.text('domain_name');
    table.text('competence_code');
    table.text('competence_name');
    table.integer('campaign_id');
    table.integer('target_profile_id');
    table.integer('orga_id');
    table.text('tube_id');
    table.text('tube_practical_title');
    table.date('extraction_date');
    table.smallint('max_level');
    table.bigint('sum_user_max_level');
    table.bigint('nb_user');
    table.integer('nb_tubes_in_competence');

    table.index(['orga_id', 'campaign_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
