const SCHEMA_NAME = 'learningcontent';
const TABLE_NAME = 'challenges';
const COLUMN_NAME = 'noValidationNeeded';

const up = async function (knex) {
  await knex.schema.withSchema(SCHEMA_NAME).table(TABLE_NAME, function (table) {
    table
      .boolean(COLUMN_NAME)
      .defaultTo(false)
      .comment(
        'Indicates that the challenge does not need any validation, i.e. contains only a video to watch or a text to read',
      );
  });
};

const down = async function (knex) {
  await knex.schema.withSchema(SCHEMA_NAME).table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
