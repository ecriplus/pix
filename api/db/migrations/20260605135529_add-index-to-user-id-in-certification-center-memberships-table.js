const TABLE_NAME = 'certification-center-memberships';
const COLUMN_NAME = 'userId';

const up = function (knex) {
  return knex.schema.table(TABLE_NAME, function (table) {
    table.index(COLUMN_NAME);
  });
};

const down = function (knex) {
  return knex.schema.table(TABLE_NAME, function (table) {
    table.dropIndex(COLUMN_NAME);
  });
};

export { down, up };
