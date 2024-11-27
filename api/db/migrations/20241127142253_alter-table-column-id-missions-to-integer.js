const TABLE_NAME = 'missions';
const SCHEMA_NAME = 'learningcontent';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.withSchema(SCHEMA_NAME).dropTable(TABLE_NAME);
  await knex.schema.withSchema(SCHEMA_NAME).createTable('missions', function (table) {
    table.integer('id').primary();
    table.string('status');
    table.jsonb('name_i18n');
    table.jsonb('content');
    table.jsonb('learningObjectives_i18n');
    table.jsonb('validatedObjectives_i18n');
    table.string('introductionMediaType');
    table.text('introductionMediaUrl');
    table.jsonb('introductionMediaAlt_i18n');
    table.text('documentationUrl');
    table.text('cardImageUrl');
    table.string('competenceId');
  });
}

/**
 * @returns { Promise<void> }
 */
export async function down() {
  // non
}
