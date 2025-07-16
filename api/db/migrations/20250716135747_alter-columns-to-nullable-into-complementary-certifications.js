const TABLE_NAME = 'complementary-certifications';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.integer('certificationExtraTime').nullable().alter();
    table.decimal('minimumReproducibilityRate').nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.integer('certificationExtraTime').notNullable().alter();
    table.decimal('minimumReproducibilityRate').notNullable().alter();
  });
};

export { down, up };
