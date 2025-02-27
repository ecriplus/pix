const TABLE_NAME = 'data_export_parcoursup_certif_result_code_validation';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('certification_code_verification');
    table.string('last_name');
    table.string('first_name');
    table.date('birthdate');
    table.text('status');
    table.integer('pix_score');
    table.timestamp('certification_date');
    table.string('competence_id');
    table.integer('competence_level');
    table.index('certification_code_verification');
  });
};

const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
