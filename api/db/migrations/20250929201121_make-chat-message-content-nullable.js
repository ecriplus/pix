const TABLE_NAME = 'chat_messages';
const COLUMN_NAME = 'content';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.text(COLUMN_NAME).nullable().alter().comment('Content is null when message is related to an attachment');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.text(COLUMN_NAME).notNullable().alter();
  });
};

export { down, up };
