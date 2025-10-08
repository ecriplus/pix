import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { DatabaseConnection } from '../../db/database-connection.js';
import { PGSQL_DUPLICATE_DATABASE_ERROR } from '../../db/pgsql-errors.js';
import { config } from '../../src/shared/config.js';
import { logger } from '../../src/shared/infrastructure/utils/logger.js';
import { PgClient } from '../PgClient.js';

const { environment } = config;

const commandLineArguments = yargs(hideBin(process.argv))
  .option('name', {
    description: 'Name of the database',
    type: 'text',
    demandOption: true,
  })
  .help().argv;

const knexConfigs = (await import(`../../${commandLineArguments.name}/knexfile.js`)).default;
const url = DatabaseConnection.databaseUrlFromConfig(knexConfigs[environment]);

const DB_TO_CREATE_NAME = url.pathname.slice(1);

url.pathname = '/postgres';

PgClient.getClient(url.href).then(async (client) => {
  try {
    await client.query_and_log(`CREATE DATABASE ${DB_TO_CREATE_NAME};`);
    logger.info(`Database ${DB_TO_CREATE_NAME} created`);
    await client.end();
  } catch (error) {
    if (error.code === PGSQL_DUPLICATE_DATABASE_ERROR) {
      logger.info(`Database ${DB_TO_CREATE_NAME} already created`);
    } else {
      logger.error(`Database creation failed: ${error.detail}`);
    }
  } finally {
    await client.end();
  }
});
