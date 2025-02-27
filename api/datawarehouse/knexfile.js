import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import * as dotenv from 'dotenv';

import { buildPostgresEnvironment } from '../db/utils/build-postgres-environment.js';
dotenv.config({ path: `${__dirname}/../.env` });

const baseConfiguration = {
  name: 'datawarehouse',
  databaseUrl: process.env.DATAWAREHOUSE_DATABASE_URL,
};

const environments = {
  development: buildPostgresEnvironment(baseConfiguration),

  test: buildPostgresEnvironment({ ...baseConfiguration, databaseUrl: process.env.TEST_DATAWAREHOUSE_DATABASE_URL }),

  production: buildPostgresEnvironment(baseConfiguration),
};

export default environments;
