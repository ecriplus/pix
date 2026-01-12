const TABLE_NAME = 'certification-data-active-calibrated-challenges';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('challengeId').primary().comment('Challenge id');
    table.float('alpha').comment('Discriminant');
    table.float('delta').comment('Difficulty');
  });
};

export { down, up };
