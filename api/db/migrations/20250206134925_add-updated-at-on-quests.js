const TABLE_NAME = 'quests';
const COLUMN_NAME = 'updatedAt';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.timestamp(COLUMN_NAME).comment('Indicates when the quest was edited.').defaultTo(knex.fn.now());
  });

  await knex('quests').update({ updatedAt: knex.ref('quests.createdAt') });
};

const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
