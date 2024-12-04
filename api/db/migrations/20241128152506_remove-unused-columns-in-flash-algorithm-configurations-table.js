const TABLE_NAME = 'flash-algorithm-configurations';
const WARM_UP_LENGTH_COLUMN_NAME = 'warmUpLength';
const FORCED_COMPETENCES_COLUMN_NAME = 'forcedCompetences';
const MINIMUM_ESTIMATED_SUCCESS_RATE_RANGES_COLUMN_NAME = 'minimumEstimatedSuccessRateRanges';
const DOUBLE_MEASURES_UNTIL_COLUMN_NAME = 'doubleMeasuresUntil';
const VARIATION_PERCENT_UNTIL_COLUMN_NAME = 'variationPercentUntil';

const up = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn(WARM_UP_LENGTH_COLUMN_NAME);
    table.dropColumn(FORCED_COMPETENCES_COLUMN_NAME);
    table.dropColumn(MINIMUM_ESTIMATED_SUCCESS_RATE_RANGES_COLUMN_NAME);
    table.dropColumn(DOUBLE_MEASURES_UNTIL_COLUMN_NAME);
    table.dropColumn(VARIATION_PERCENT_UNTIL_COLUMN_NAME);
    table.comment(`Configuration parameters used to alter the behaviour of the flash algorithm.`);
  });
};

const down = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.integer(WARM_UP_LENGTH_COLUMN_NAME);
    table.jsonb(FORCED_COMPETENCES_COLUMN_NAME);
    table.jsonb(MINIMUM_ESTIMATED_SUCCESS_RATE_RANGES_COLUMN_NAME);
    table.integer(DOUBLE_MEASURES_UNTIL_COLUMN_NAME);
    table.integer(VARIATION_PERCENT_UNTIL_COLUMN_NAME);
  });
};

export { down, up };
