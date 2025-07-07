const TABLE_NAME = 'target_profiles_course_duration';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.integer('targetProfileId').primary().notNullable().comment('Target profile id used as primary key');
    table.integer('median').comment('Target profile median course duration');
    table.integer('quantile_75').comment('Target profile 75 quantile course duration');
    table.integer('quantile_95').comment('Target profile 95 quantile course duration');
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
