const TABLE_NAME = 'quests';
const COLUMN_NAMES = ['organizationId', 'code', 'name', 'description', 'illustration'];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropForeign('organizationId');
  });
  for (const columnName of COLUMN_NAMES) {
    await knex.schema.table(TABLE_NAME, function (table) {
      table.dropColumn(columnName);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string('code').defaultTo(null).comment('Adds code on quests to use a quest object in a course');
    table.integer('organizationId').defaultTo(null).unsigned().comment('Links a quest to an organization');
    table.foreign('organizationId').references('organizations.id');
    table.text('description').defaultTo(null).comment('Description for quests');
    table.text('illustration').defaultTo(null).comment('URL for quest illustration');
    table.string('name').defaultTo(null).comment('Name of the quest, used on landing page for combined courses');
  });
};

export { down, up };
