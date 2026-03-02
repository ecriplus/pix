const TABLE_NAME = 'certification_events';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.string('eventName').comment('Name of the event');
    table.integer('candidateId').index().notNullable().comment('Certification candidate ID');
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now()).comment('Timestamp of the event');
    table.jsonb('metadata').comment('metadata, if any, to add informations about event');
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
