const TABLE_NAME = 'knowledge-element-snapshots';
const COLUMN_NAME = 'campaignParticipationId';

const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table
      .integer(COLUMN_NAME)
      .unsigned()
      .nullable()
      .references('campaign-participations.id')
      .index()
      .comment('Added this column as part of the anonymization process');
  });
};

const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
