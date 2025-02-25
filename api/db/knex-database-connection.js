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

const { environment } = config;
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

async function disconnect() {
  await configuredDatamartKnex?.destroy();
  return configuredKnex.destroy();
}

async function emptyAllTables() {
  return liveDatabaseConnection.emptyAllTables();
}

export {
  configuredDatamartKnex as datamartKnex,
  disconnect,
  emptyAllTables,
  configuredKnex as knex,
  liveDatabaseConnection,
};
