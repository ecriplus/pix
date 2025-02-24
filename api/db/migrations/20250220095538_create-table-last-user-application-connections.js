const TABLE_NAME = 'last-user-application-connections';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary().notNullable();
    table.integer('userId').references('users.id').index();
    table.string('application').notNullable();
    table.dateTime('lastLoggedAt').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
