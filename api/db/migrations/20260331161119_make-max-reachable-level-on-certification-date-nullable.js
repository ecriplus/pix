const TABLE_NAME = 'certification-courses';
const COLUMN_NAME = 'maxReachableLevelOnCertificationDate';

const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.integer(COLUMN_NAME).nullable().defaultTo(null).comment('V2 only - not used for V3 certification').alter();
  });
};

const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.integer(COLUMN_NAME).notNullable().defaultTo(5).alter();
  });
};

export { down, up };
