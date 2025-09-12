const TABLE_NAME = 'quests';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.text('description').defaultTo(null).comment('Description for quests');
    table.string('illustration').defaultTo(null).comment('URL for quest illustration');
  });
};

const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn('description');
    table.dropColumn('illustration');
  });
};

export { down, up };
