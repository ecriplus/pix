import { DatabaseConnection } from '../db/database-connection.js';
import { databaseConnections } from '../db/database-connections.js';
import { config } from '../src/shared/config.js';
import datamartKnexConfigs from './knexfile.js';

const { environment } = config;

const databaseConnection = new DatabaseConnection(datamartKnexConfigs[environment]);
const { knex } = databaseConnection;

databaseConnections.addConnection(databaseConnection);

async function disconnect() {
  await databaseConnections.disconnect();
}

export { databaseConnection, disconnect, knex };
