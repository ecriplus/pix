// Make sure you properly test your migration, especially DDL (Data Definition Language)
// ! If the target table is large, and the migration take more than 20 minutes, the deployment will fail !

// You can design and test your migration to avoid this by following this guide
// https://1024pix.atlassian.net/wiki/spaces/EDTDT/pages/3849323922/Cr+er+une+migration

// If your migrations target `answers` or `knowledge-elements`
// contact @team-captains, because automatic migrations are not active on `pix-datawarehouse-production`
// this may prevent data replication to succeed the day after your migration is deployed on `pix-api-production`
const TABLE_NAME = 'user-recommended-trainings';
const COLUMN_NAME = 'campaignParticipationId';

const up = async (knex) => {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.integer(COLUMN_NAME).nullable().alter();
  });
};

const down = async (knex) => {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.integer(COLUMN_NAME).notNullable().alter();
  });
};

export { down, up };
