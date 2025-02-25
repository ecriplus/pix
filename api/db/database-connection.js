import { performance } from 'node:perf_hooks';

import Knex from 'knex';
import _ from 'lodash';

import { config } from '../src/shared/config.js';
import { monitoringTools } from '../src/shared/infrastructure/monitoring-tools.js';
import { logger } from '../src/shared/infrastructure/utils/logger.js';
const { logging } = config;

export class DatabaseConnection {
  knex;

  constructor(knexConfig) {
    this.knex = Knex(knexConfig);
    this.knex.on('query', function (data) {
      if (logging.enableKnexPerformanceMonitoring) {
        const queryId = data.__knexQueryUid;
        monitoringTools.setInContext(`knexQueryStartTimes.${queryId}`, performance.now());
      }
    });

    this.knex.on('query-response', function (response, data) {
      monitoringTools.incrementInContext('metrics.knexQueryCount');
      if (logging.enableKnexPerformanceMonitoring) {
        const queryStartedTime = monitoringTools.getInContext(`knexQueryStartTimes.${data.__knexQueryUid}`);
        if (queryStartedTime) {
          const duration = performance.now() - queryStartedTime;
          monitoringTools.incrementInContext('metrics.knexTotalTimeSpent', duration);
        }
      }
    });
  }

  async prepare() {
    await this.knex.raw('SELECT 1');
    logger.info('Connection to database established.');
  }

  async emptyAllTables() {
    const tableNames = await this.#listAllTableNames();
    const tablesToDelete = _.without(
      tableNames,
      'knex_migrations',
      'knex_migrations_lock',
      'view-active-organization-learners',
    );

    const tables = _.map(tablesToDelete, (tableToDelete) => `"${tableToDelete}"`).join();

    // eslint-disable-next-line knex/avoid-injections
    return this.knex.raw(`TRUNCATE ${tables}`);
  }

  async #listAllTableNames() {
    const resultSet = await this.knex.raw(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?',
      [this.knex.client.database()],
    );

    const rows = resultSet.rows;
    return _.map(rows, 'table_name');
  }
}
