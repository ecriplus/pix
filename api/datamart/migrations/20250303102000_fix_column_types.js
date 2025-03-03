const FIRST_DATAMART_TABLE_NAME = 'data_export_parcoursup_certif_result';
const SECOND_DATAMART_TABLE_NAME = 'data_export_parcoursup_certif_result_code_validation';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(FIRST_DATAMART_TABLE_NAME, function (table) {
    table.text('area_name').alter();
    table.integer('certification_courses_id').alter();
    table.text('competence_code').alter();
    table.text('competence_name').alter();
  });

  await knex.schema.alterTable(SECOND_DATAMART_TABLE_NAME, function (table) {
    table.integer('certification_courses_id').alter();
    table.string('national_student_id', 50).alter();
    table.string('organization_uai', 50).alter();
  });
};

/**
 * @returns { Promise<void> }
 */
const down = async function () {
  // there are no reasons to go back to previous state as the columns types were utterly wrong
};

export { down, up };
