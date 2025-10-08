import { loadEnvFileIfExists } from '../src/shared/load-env-file-if-exists.js';
import { buildPostgresEnvironment } from './utils/build-postgres-environment.js';

loadEnvFileIfExists();

const baseConfiguration = {
  name: 'live',
  migrationsDirectory: './migrations/',
  seedsDirectory: './seeds/',
  databaseUrl: process.env.DATABASE_URL,
};

export default {
  development: buildPostgresEnvironment(baseConfiguration),

  test: buildPostgresEnvironment({
    ...baseConfiguration,
    databaseUrl: process.env.TEST_DATABASE_URL,
  }),

  production: buildPostgresEnvironment({
    ...baseConfiguration,
    pool: {
      min: parseInt(process.env.DATABASE_CONNECTION_POOL_MIN_SIZE, 10),
      max: parseInt(process.env.DATABASE_CONNECTION_POOL_MAX_SIZE, 10),
    },
  }),
};
