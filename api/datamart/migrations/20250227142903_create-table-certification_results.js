const TABLE_NAME = 'certification_results';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('certification_code_verification');
    table.string('last_name');
    table.string('first_name');
    table.date('birthdate');
    table.text('status');
    table.integer('pix_score');
    table.timestamp('certification_date');
    table.integer('competence_level');
    table.index('certification_code_verification');
    table.string('competence_name');
    table.string('competence_code');
    table.string('area_name');
    table.string('certification_courses_id');
    table.string('national_student_id');
    table.string('organization_uai');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
