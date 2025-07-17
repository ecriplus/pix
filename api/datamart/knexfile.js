import * as url from 'node:url';

import * as dotenv from 'dotenv';

import { buildPostgresEnvironment } from '../db/utils/build-postgres-environment.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config({ path: `${__dirname}/../.env`, quiet: true });

const baseConfiguration = {
  name: 'datamart',
  migrationsDirectory: './migrations/',
  seedsDirectory: './seeds/',
  databaseUrl: process.env.DATAMART_DATABASE_URL,
};

const environments = {
  development: buildPostgresEnvironment(baseConfiguration),

  test: buildPostgresEnvironment({ ...baseConfiguration, databaseUrl: process.env.TEST_DATAMART_DATABASE_URL }),

  production: buildPostgresEnvironment(baseConfiguration),
};

export default environments;
