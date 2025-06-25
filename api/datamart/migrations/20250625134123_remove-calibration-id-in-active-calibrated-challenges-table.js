const TABLE_NAME = 'active_calibrated_challenges';
const COLUMN_NAME = 'calibration_id';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn(COLUMN_NAME);
  });
};

const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string(COLUMN_NAME).index();
  });
};

export { down, up };
