const TABLE_NAME = 'certification-frameworks-challenges';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn('complementaryCertificationKey');
    table.dropColumn('version');
    table.dropColumn('calibrationId');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string('complementaryCertificationKey').nullable();
    table.string('version').nullable();
    table.integer('calibrationId').nullable();
  });
};

export { down, up };
