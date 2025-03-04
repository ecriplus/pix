const TABLE_NAME = 'passage-events';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.bigIncrements('id').primary();
    table.string('type').notNullable();
    table.datetime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.datetime('occurredAt').notNullable();
    table.integer('passageId').notNullable().references('id').inTable('passages');
    table.jsonb('data').nullable();
  });
};

const down = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
