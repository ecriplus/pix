const SCHEMA_NAME = 'learningcontent';

const up = async function (knex) {
  await knex.raw(`CREATE SCHEMA ??`, [SCHEMA_NAME]);
  await knex.schema.withSchema(SCHEMA_NAME).createTable('frameworks', function (table) {
    table.string('id').primary();
    table.text('name');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('areas', function (table) {
    table.string('id').primary();
    table.string('code');
    table.text('name');
    table.jsonb('title_i18n');
    table.string('color');
    table.string('frameworkId').references('id').inTable(`${SCHEMA_NAME}.frameworks`);
    table.specificType('competenceIds', 'string[]');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('competences', function (table) {
    table.string('id').primary();
    table.jsonb('name_i18n');
    table.jsonb('description_i18n');
    table.string('index');
    table.text('origin');
    table.string('areaId').references('id').inTable(`${SCHEMA_NAME}.areas`);
    table.specificType('skillIds', 'string[]');
    table.specificType('thematicIds', 'string[]');
  });
};

const down = function (knex) {
  return knex.schema.dropSchema(SCHEMA_NAME, true);
};

export { down, up };
