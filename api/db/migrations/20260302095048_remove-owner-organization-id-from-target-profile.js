/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table('target-profiles', function (table) {
    table.dropColumn('ownerOrganizationId');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table('target-profiles', function (table) {
    table.integer('ownerOrganizationId').nullable().defaultTo(null).references('organizations.id');
  });
};

export { down, up };
