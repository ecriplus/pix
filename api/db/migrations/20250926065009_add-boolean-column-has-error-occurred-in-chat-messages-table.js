const TABLE_NAME = 'chat_messages';
const COLUMN_NAME = 'hasErrorOccurred';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .boolean(COLUMN_NAME)
      .nullable()
      .defaultTo(null)
      .comment(
        'when message is of emitter "assistant", will indicates if an error occurred during the streaming phase',
      );
  });
};

const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
