import datamartKnexConfigs from '../datamart/knexfile.js';
import { DatabaseConnection } from '../db/database-connection.js';
import { databaseConnections } from '../db/database-connections.js';
import { config } from '../src/shared/config.js';

const { environment } = config;

const datamartDatabaseConnection = new DatabaseConnection(datamartKnexConfigs[environment]);
const configuredDatamartKnex = datamartDatabaseConnection.knex;

databaseConnections.addConnection(datamartDatabaseConnection);

async function disconnect() {
  await databaseConnections.disconnect();
}

export { configuredDatamartKnex as datamartKnex, disconnect };
