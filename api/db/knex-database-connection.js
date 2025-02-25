import perf_hooks from 'node:perf_hooks';

import Knex from 'knex';
import QueryBuilder from 'knex/lib/query/querybuilder.js';
import _ from 'lodash';
import pg from 'pg';

import datamartKnexConfigs from '../datamart/knexfile.js';
import { config } from '../src/shared/config.js';
import { monitoringTools } from '../src/shared/infrastructure/monitoring-tools.js';
import { logger } from '../src/shared/infrastructure/utils/logger.js';
import { DatabaseConnection } from './database-connection.js';
import knexConfigs from './knexfile.js';

const types = pg.types;

const { get } = _;

const { performance } = perf_hooks;

/*
By default, node-postgres casts a DATE value (PostgreSQL type) as a Date Object (JS type).
But, when dealing with dates with no time (such as birthdate for example), we want to
deal with a 'YYYY-MM-DD' string.
*/
types.setTypeParser(types.builtins.DATE, (value) => value);

/*
The knex method count(), used with PostgreSQL, can sometimes return a BIGINT.
This is not the common case (maybe in several years).
Even though, Knex have decided to return String.
We decided to parse the result of #count() method to force a resulting INTEGER.

Links :
- problem: https://github.com/bookshelf/bookshelf/issues/1275
- solution: https://github.com/brianc/node-pg-types
 */
types.setTypeParser(types.builtins.INT8, (value) => parseInt(value));

const { logging, environment } = config;
const liveDatabaseConnection = new DatabaseConnection(knexConfigs[environment]);
const configuredKnex = liveDatabaseConnection.knex;

const datamartDatabaseConnection = new DatabaseConnection(datamartKnexConfigs[environment]);
const configuredDatamartKnex = datamartDatabaseConnection.knex;

/* QueryBuilder Extension */
try {
  Knex.QueryBuilder.extend('whereInArray', function (column, values) {
    return this.where(column, configuredKnex.raw('any(?)', [values]));
  });
} catch (e) {
  if (e.message !== "Can't extend QueryBuilder with existing method ('whereInArray').") {
    logger.error(e);
  }
}
/* -------------------- */

const originalToSQL = QueryBuilder.prototype.toSQL;
QueryBuilder.prototype.toSQL = function () {
  const ret = originalToSQL.apply(this);
  const request = monitoringTools.getInContext('request');
  const comments = [['path', get(request, 'route.path')]].map((comment) => comment.join(': ')).join(' ');
  ret.sql = `/* ${comments} */ `.concat(ret.sql);
  return ret;
};

configuredKnex.on('query', function (data) {
  if (logging.enableKnexPerformanceMonitoring) {
    const queryId = data.__knexQueryUid;
    monitoringTools.setInContext(`knexQueryStartTimes.${queryId}`, performance.now());
  }
});

configuredKnex.on('query-response', function (response, data) {
  monitoringTools.incrementInContext('metrics.knexQueryCount');
  if (logging.enableKnexPerformanceMonitoring) {
    const queryStartedTime = monitoringTools.getInContext(`knexQueryStartTimes.${data.__knexQueryUid}`);
    if (queryStartedTime) {
      const duration = performance.now() - queryStartedTime;
      monitoringTools.incrementInContext('metrics.knexTotalTimeSpent', duration);
    }
  }
});

async function disconnect() {
  await configuredDatamartKnex?.destroy();
  return configuredKnex.destroy();
}

const _databaseName = configuredKnex.client.database();

async function listAllTableNames() {
  const bindings = [_databaseName];

  const resultSet = await configuredKnex.raw(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?',
    bindings,
  );

  const rows = resultSet.rows;
  return _.map(rows, 'table_name');
}

async function emptyAllTables() {
  const tableNames = await listAllTableNames();
  const tablesToDelete = _.without(
    tableNames,
    'knex_migrations',
    'knex_migrations_lock',
    'view-active-organization-learners',
  );

  const tables = _.map(tablesToDelete, (tableToDelete) => `"${tableToDelete}"`).join();

  // eslint-disable-next-line knex/avoid-injections
  return configuredKnex.raw(`TRUNCATE ${tables}`);
}

export {
  configuredDatamartKnex as datamartKnex,
  disconnect,
  emptyAllTables,
  configuredKnex as knex,
  liveDatabaseConnection,
};
