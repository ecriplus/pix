import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { DatabaseConnection } from '../../db/database-connection.js';
import { PGSQL_NON_EXISTENT_DATABASE_ERROR } from '../../db/pgsql-errors.js';
import { config } from '../../src/shared/config.js';
import { logger } from '../../src/shared/infrastructure/utils/logger.js';
import { PgClient } from '../PgClient.js';

function isPlatformScalingo() {
  return Boolean(process.env.CONTAINER);
}

function preventDatabaseDropAsItCannotBeCreatedAgain() {
  if (isPlatformScalingo()) {
    logger.error('Database will not be dropped, as it would require to recreate the addon');
    process.exitCode = 1;
  }
}

preventDatabaseDropAsItCannotBeCreatedAgain();

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

const DB_TO_DELETE_NAME = url.pathname.slice(1);

url.pathname = '/postgres';

PgClient.getClient(url.href).then(async (client) => {
  try {
    const WITH_FORCE = _withForceOption();
    await client.query_and_log(`DROP DATABASE ${DB_TO_DELETE_NAME}${WITH_FORCE};`);
    logger.info(`Database ${DB_TO_DELETE_NAME} dropped`);
    await client.end();
  } catch (error) {
    if (error.code === PGSQL_NON_EXISTENT_DATABASE_ERROR) {
      logger.info(`Database ${DB_TO_DELETE_NAME} does not exist`);
    } else {
      logger.error(`Database drop failed: ${error.detail}`);
    }
  } finally {
    await client.end();
  }
});

function _withForceOption() {
  return process.env.FORCE_DROP_DATABASE === 'true' ? ' WITH (FORCE)' : '';
}
