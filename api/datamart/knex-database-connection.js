import datamartKnexConfigs from '../datamart/knexfile.js';
import { DatabaseConnection } from '../db/database-connection.js';
import { databaseConnections } from '../db/database-connections.js';
import { config } from '../src/shared/config.js';

const { environment } = config;

const databaseConnection = new DatabaseConnection(datamartKnexConfigs[environment]);
const configuredDatamartKnex = databaseConnection.knex;

databaseConnections.addConnection(databaseConnection);

async function disconnect() {
  await databaseConnections.disconnect();
}

export { databaseConnection, configuredDatamartKnex as datamartKnex, disconnect };
