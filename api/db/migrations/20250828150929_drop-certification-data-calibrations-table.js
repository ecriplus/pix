/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable('certification-data-active-calibrated-challenges', function (table) {
    table.dropColumn('calibrationId');
    table.primary('challengeId');
  });

  await knex.schema.dropTable('certification-data-calibrations');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.createTable('certification-data-calibrations', function (table) {
    table.increments('id').primary();
    table.dateTime('calibrationDate').notNullable().comment('Date of calibration');
    table.string('status').notNullable().comment('Validation status of the calibration');
    table.string('scope').notNullable().comment('Calibration scope');

    table.index(['calibrationDate', 'scope', 'status']);
  });

  await knex.schema.alterTable('certification-data-active-calibrated-challenges', function (table) {
    table.integer('calibrationId').notNullable().comment('link to calibration');

    table.dropPrimary();
    table.primary(['calibrationId', 'challengeId']);
    table.foreign('calibrationId').references(`certification-data-calibrations.id`);
  });
};

export { down, up };
