const TABLE_NAME = 'sco_certification_results';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('national_student_id');
    table.index('national_student_id');
    table.string('organization_uai');
    table.string('last_name');
    table.string('first_name');
    table.date('birthdate');
    table.text('status');
    table.integer('pix_score');
    table.timestamp('certification_date');
    table.integer('competence_level');
    table.index('organization_uai');
    table.string('competence_name');
    table.string('competence_code');
    table.string('area_name');
    table.string('certification_courses_id');
  });
  await knex.schema.raw('drop collation if exists "sco_certification_results_case_accent_punctuation_insensitive"');
  await knex.schema.raw(
    'create collation "sco_certification_results_case_accent_punctuation_insensitive" (provider = icu, locale = "und-u-ka-shifted-ks-level1-kv-punct", deterministic = false);',
  );

  await knex.schema.raw(
    'ALTER TABLE :tableName: alter column first_name type varchar(255) COLLATE sco_certification_results_case_accent_punctuation_insensitive;',
    { tableName: TABLE_NAME },
  );
  await knex.schema.raw(
    'ALTER TABLE :tableName: alter column last_name type varchar(255) COLLATE sco_certification_results_case_accent_punctuation_insensitive;',
    { tableName: TABLE_NAME },
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
