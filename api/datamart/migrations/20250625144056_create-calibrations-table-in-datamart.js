const TABLE_NAME = 'calibrations';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.integer('id').notNullable().comment('Calibration ID');
    table.dateTime('calibration_date').notNullable().comment('Date of calibration');
    table.string('status').notNullable().comment('Validation status of the calibration');
    table.string('scope').notNullable().comment('Calibration scope');
  });
};

const down = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
