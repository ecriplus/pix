const OLD_TABLE_NAME_CHALLENGES = 'active_calibrated_challenges';
const NEW_TABLE_NAME_CHALLENGES = 'data_active_calibrated_challenges';
const OLD_TABLE_NAME_CALIBRATIONS = 'calibrations';
const NEW_TABLE_NAME_CALIBRATIONS = 'data_calibrations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.renameTable(OLD_TABLE_NAME_CHALLENGES, NEW_TABLE_NAME_CHALLENGES);
  await knex.schema.renameTable(OLD_TABLE_NAME_CALIBRATIONS, NEW_TABLE_NAME_CALIBRATIONS);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.renameTable(NEW_TABLE_NAME_CHALLENGES, OLD_TABLE_NAME_CHALLENGES);
  await knex.schema.renameTable(NEW_TABLE_NAME_CALIBRATIONS, OLD_TABLE_NAME_CALIBRATIONS);
};

export { down, up };
