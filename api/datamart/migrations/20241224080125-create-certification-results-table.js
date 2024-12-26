const TABLE_NAME = 'data_export_parcoursup_certif_result';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('national_student_id');
    table.index('national_student_id');
  });
};

const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
