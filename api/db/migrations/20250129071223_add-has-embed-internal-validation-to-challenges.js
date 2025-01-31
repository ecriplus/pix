const SCHEMA_NAME = 'learningcontent';
const TABLE_NAME = 'challenges';
const COLUMN_NAME = 'hasEmbedInternalValidation';

const up = async function (knex) {
  await knex.schema.withSchema(SCHEMA_NAME).table(TABLE_NAME, function (table) {
    table
      .boolean(COLUMN_NAME)
      .defaultTo(false)
      .comment('Indicates that the embed has internal rules to handle the challenge validation');
  });
};

const down = async function (knex) {
  await knex.schema.withSchema(SCHEMA_NAME).table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
