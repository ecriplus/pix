import { readdirSync } from 'node:fs';
import path from 'node:path';

import { parseCsvWithHeader } from '../../scripts/helpers/csvHelpers.js';
import { logger } from '../../src/shared/infrastructure/utils/logger.js';

// data are populated from exported data in csv files
// csv files shall be named with the table name they represent
const csvFolder = path.join(import.meta.dirname, 'csv');

export async function seed(knex) {
  const csvFilesToImport = readdirSync(csvFolder);
  for (const file of csvFilesToImport) {
    await insertDataFromFile(path.join(csvFolder, file), knex);
  }
}

async function insertDataFromFile(file, knex) {
  const tableName = path.basename(file, '.csv');
  logger.info(`Inserting data from ${file} to ${tableName}`);

  const data = await parseCsvWithHeader(file);
  await knex(tableName).truncate();
  await knex.batchInsert(tableName, data);
}
