import 'dotenv/config';

import { PGSQL_NON_EXISTENT_DATABASE_ERROR } from '../../db/pgsql-errors.js';
import { logger } from '../../src/shared/infrastructure/utils/logger.js';
import { PgClient } from '../PgClient.js';

function isPlatformScalingo() {
  return Boolean(process.env.CONTAINER);
}

const dbUrl =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DATAMART_DATABASE_URL : process.env.DATAMART_DATABASE_URL;

const url = new URL(dbUrl);

const DB_TO_DELETE_NAME = url.pathname.slice(1);

url.pathname = '/postgres';

if (isPlatformScalingo()) {
  logger.error('Database will not be dropped, as it would require to recreate the addon');
} else {
  PgClient.getClient(url.href).then(async (client) => {
    try {
      const WITH_FORCE = _withForceOption();
      await client.query_and_log(`DROP DATABASE ${DB_TO_DELETE_NAME}${WITH_FORCE};`);
      logger.info('Database dropped');
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
}

function _withForceOption() {
  return process.env.FORCE_DROP_DATABASE === 'true' ? ' WITH (FORCE)' : '';
}
