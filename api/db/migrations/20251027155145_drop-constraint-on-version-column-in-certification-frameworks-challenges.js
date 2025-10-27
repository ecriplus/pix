const TABLE_NAME = 'certification-frameworks-challenges';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropUnique(['version', 'challengeId', 'complementaryCertificationKey']);
    table.string('version').nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string('version').notNullable().alter();
    table.unique(['version', 'challengeId', 'complementaryCertificationKey']);
  });
};

export { down, up };
