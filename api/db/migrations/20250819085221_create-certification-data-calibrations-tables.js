/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable('certification-data-calibrations', function (table) {
    table.increments('id').primary();
    table.dateTime('calibrationDate').notNullable().comment('Date of calibration');
    table.string('status').notNullable().comment('Validation status of the calibration');
    table.string('scope').notNullable().comment('Calibration scope');

    table.index(['calibrationDate', 'scope', 'status']);
  });

  await knex.schema.createTable('certification-data-active-calibrated-challenges', function (table) {
    table.string('challengeId').notNullable().comment('Challenge id');
    table.float('alpha').comment('Discriminant');
    table.float('delta').comment('Difficulty');
    table.integer('calibrationId').notNullable().comment('link to calibration');

    table.primary(['calibrationId', 'challengeId']);
    table.foreign('calibrationId').references('certification-data-calibrations.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.dropTable('certification-data-active-calibrated-challenges');
  await knex.schema.dropTable('certification-data-calibrations');
};

export { down, up };
