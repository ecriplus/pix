import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { logger } from '../../src/shared/infrastructure/utils/logger.js';

let databaseConnection;

const commandLineArguments = yargs(hideBin(process.argv))
  .option('name', {
    description: 'Name of the database',
    type: 'text',
  })
  .help().argv;
const databaseToEmpty = commandLineArguments.name;
try {
  console.log(`../../${databaseToEmpty}/knex-database-connection.js`);
  const importedFile = await import(`../../${databaseToEmpty}/knex-database-connection.js`);
  databaseConnection = importedFile.databaseConnection;
  logger.info(`Emptying all tables of database ${databaseToEmpty}...`);
  await databaseConnection.emptyAllTables();
  logger.info('Done!');
} catch (error) {
  logger.error(error);
  process.exitCode = 1;
} finally {
  await databaseConnection.disconnect();
}
