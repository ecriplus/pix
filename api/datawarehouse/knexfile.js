import { buildPostgresEnvironment } from '../db/utils/build-postgres-environment.js';
import { loadEnvFileIfExists } from '../src/shared/load-env-file-if-exists.js';

loadEnvFileIfExists();

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
