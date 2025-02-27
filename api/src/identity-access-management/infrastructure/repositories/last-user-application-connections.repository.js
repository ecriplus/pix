import { knex } from '../../../../db/knex-database-connection.js';
const TABLE_NAME = 'last-user-application-connections';

async function upsert({ userId, application, lastLoggedAt }) {
  const existingConnection = await knex(TABLE_NAME).where({ userId, application }).first();

  if (existingConnection) {
    return knex(TABLE_NAME).where({ userId, application }).update({ lastLoggedAt });
  }

  return knex(TABLE_NAME).insert({ userId, application, lastLoggedAt });
}

export const lastUserApplicationConnectionsRepository = { upsert };
