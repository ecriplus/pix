const TABLE_NAME = 'active_calibrated_challenges';
const SCOPE_COLUMN = 'scope';
const CALIBRATION_ID_COLUMN = 'calibration_id';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn(SCOPE_COLUMN);
    table.string(CALIBRATION_ID_COLUMN).index();
  });
};

const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string(SCOPE_COLUMN).index();
    table.dropColumn(CALIBRATION_ID_COLUMN);
  });
};

export { down, up };
