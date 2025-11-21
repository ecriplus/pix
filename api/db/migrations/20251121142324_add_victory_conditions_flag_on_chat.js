const TABLE_NAME = 'chats';
const COLUMN_NAME = 'haveVictoryConditionsBeenFulfilled';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.boolean(COLUMN_NAME).defaultTo(false).notNullable();
    table.boolean('hasAttachmentContextBeenAdded').nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
