const TABLE_NAME = 'last-user-application-connections';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.unique(['userId', 'application']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropUnique(['userId', 'application']);
  });
};

export { down, up };
