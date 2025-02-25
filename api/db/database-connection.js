import Knex from 'knex';

import { logger } from '../src/shared/infrastructure/utils/logger.js';

export class DatabaseConnection {
  knex;

  constructor(knexConfig) {
    this.knex = Knex(knexConfig);
  }

  async prepare() {
    await this.knex.raw('SELECT 1');
    logger.info('Connection to database established.');
  }
}
