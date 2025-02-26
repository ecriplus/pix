import datamartKnexConfigs from '../datamart/knexfile.js';
import { config } from '../src/shared/config.js';
import { DatabaseConnection } from './database-connection.js';
import { configureGlobalExtensions } from './knex-extensions.js';
import knexConfigs from './knexfile.js';

const { environment } = config;
const liveDatabaseConnection = new DatabaseConnection(knexConfigs[environment]);
const configuredLiveKnex = liveDatabaseConnection.knex;

const datamartDatabaseConnection = new DatabaseConnection(datamartKnexConfigs[environment]);
const configuredDatamartKnex = datamartDatabaseConnection.knex;

configureGlobalExtensions();

async function disconnect() {
  await configuredDatamartKnex?.destroy();
  return configuredLiveKnex.destroy();
}

async function emptyAllTables() {
  return liveDatabaseConnection.emptyAllTables();
}

export {
  configuredDatamartKnex as datamartKnex,
  disconnect,
  emptyAllTables,
  configuredLiveKnex as knex,
  liveDatabaseConnection,
};
