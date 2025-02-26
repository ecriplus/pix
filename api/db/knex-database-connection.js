import { config } from '../src/shared/config.js';
import { DatabaseConnection } from './database-connection.js';
import { databaseConnections } from './database-connections.js';
import knexConfigs from './knexfile.js';

const { environment } = config;
const liveDatabaseConnection = new DatabaseConnection(knexConfigs[environment]);
const configuredLiveKnex = liveDatabaseConnection.knex;

databaseConnections.addConnection(liveDatabaseConnection);

async function disconnect() {
  return databaseConnections.disconnect();
}

async function emptyAllTables() {
  return liveDatabaseConnection.emptyAllTables();
}

export { disconnect, emptyAllTables, configuredLiveKnex as knex, liveDatabaseConnection };
