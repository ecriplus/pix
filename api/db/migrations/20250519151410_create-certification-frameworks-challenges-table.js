const TABLE_NAME = 'certification-frameworks-challenges';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.bigIncrements('id').primary();
    table.float('alpha').notNullable().comment('Challenge discriminant');
    table.float('delta').notNullable().comment('Challenge difficulty');

    table.integer('complementaryCertificationId').unsigned();
    table.foreign('complementaryCertificationId').references('complementary-certifications.id');

    table.string('challengeId').notNullable();
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
