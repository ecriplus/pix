import { knex } from '../../../../db/knex-database-connection.js';
const TABLE_NAME = 'last-user-application-connections';

async function upsert({ userId, application, lastLoggedAt }) {
  return knex(TABLE_NAME)
    .insert({ userId, application, lastLoggedAt })
    .onConflict(['userId', 'application'])
    .merge({ lastLoggedAt });
}

export const lastUserApplicationConnectionsRepository = { upsert };
