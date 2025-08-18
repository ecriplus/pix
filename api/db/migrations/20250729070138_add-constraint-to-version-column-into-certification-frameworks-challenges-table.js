const TABLE_NAME = 'certification-frameworks-challenges';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .string('version')
      .notNullable()
      .comment(
        'Version of consolidated  framework. The version is by framework key, meaning that different frameworks can have the same version.',
      )
      .alter();

    table.unique(['version', 'challengeId', 'complementaryCertificationKey']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string('version').nullable().alter();
    table.dropUnique(['version', 'challengeId', 'complementaryCertificationKey']);
  });
};

export { down, up };
