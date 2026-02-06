export function buildPostgresEnvironment({ connection, pool, migrationsDirectory, seedsDirectory, name }) {
  return {
    name,
    client: 'postgresql',
    connection,
    pool: {
      min: pool?.min || 1,
      max: pool?.max || 4,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationsDirectory,
      loadExtensions: ['.js'],
    },
    seeds: {
      directory: seedsDirectory,
      loadExtensions: ['.js'],
    },
    asyncStackTraces: process.env.KNEX_ASYNC_STACKTRACE_ENABLED !== 'false',
  };
}
