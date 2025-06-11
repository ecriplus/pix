import { USER_RECOMMENDED_TRAININGS_TABLE_NAME } from './20221017085933_create-user-recommended-trainings.js';
const COLUMN_NAME = 'campaignParticipationId';

const up = async (knex) => {
  await knex.schema.alterTable(USER_RECOMMENDED_TRAININGS_TABLE_NAME, (table) => {
    table.integer(COLUMN_NAME).nullable().alter();
  });
};

const down = async (knex) => {
  await knex.schema.table(USER_RECOMMENDED_TRAININGS_TABLE_NAME, (table) => {
    table.integer(COLUMN_NAME).notNullable().alter();
  });
};

export { down, up };
