const TABLE_NAME = 'active_calibrated_challenges';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('challenge_id');
    table.float('alpha');
    table.float('delta');
    table.string('scope').index();
    table.string('calibration_id').index();
  });
};

const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
