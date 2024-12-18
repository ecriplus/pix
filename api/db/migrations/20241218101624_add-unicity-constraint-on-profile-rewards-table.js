const TABLE_NAME = 'profile-rewards';
const UNIQUE_CONSTRAINT_COLUMNS = ['userId', 'rewardId'];

const up = async function (knex) {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.unique(UNIQUE_CONSTRAINT_COLUMNS);
  });
};

const down = async function (knex) {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropUnique(UNIQUE_CONSTRAINT_COLUMNS);
  });
};

export { down, up };
