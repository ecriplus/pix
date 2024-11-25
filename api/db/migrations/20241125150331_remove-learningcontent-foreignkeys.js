const SCHEMA_NAME = 'learningcontent';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.withSchema(SCHEMA_NAME).alterTable('areas', function (table) {
    table.dropForeign('frameworkId');
  });
  await knex.schema.withSchema(SCHEMA_NAME).alterTable('competences', function (table) {
    table.dropForeign('areaId');
  });
  await knex.schema.withSchema(SCHEMA_NAME).alterTable('thematics', function (table) {
    table.dropForeign('competenceId');
  });
  await knex.schema.withSchema(SCHEMA_NAME).alterTable('tubes', function (table) {
    table.dropForeign('competenceId');
    table.dropForeign('thematicId');
  });
  await knex.schema.withSchema(SCHEMA_NAME).alterTable('skills', function (table) {
    table.dropForeign('competenceId');
    table.dropForeign('tubeId');
  });
  await knex.schema.withSchema(SCHEMA_NAME).alterTable('challenges', function (table) {
    table.dropForeign('competenceId');
    table.dropForeign('skillId');
  });
  await knex.schema.withSchema(SCHEMA_NAME).alterTable('missions', function (table) {
    table.dropForeign('competenceId');
  });
}

export function down() {
  // non
}
