const TABLE_NAME = 'module_issue_reports';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.uuid('moduleId').notNullable().comment('Id of module');
    table.uuid('elementId').notNullable().comment('Element id in the module');
    table.integer('passageId').references('id').inTable('passages').notNullable();
    table.text('answer').nullable().comment('Answer of the user');
    table.text('userAgent').nullable().comment('User agent of the users browser');
    table.string('categoryKey').notNullable().comment('Reason for the report');
    table.text('comment').notNullable().comment('Comment of the user');
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
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
