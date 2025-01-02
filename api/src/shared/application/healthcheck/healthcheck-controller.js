import Boom from '@hapi/boom';

import { knex } from '../../../../db/knex-database-connection.js';
import packageJSON from '../../../../package.json' with { type: 'json' };
import { config } from '../../config.js';
import { redisMonitor } from '../../infrastructure/utils/redis-monitor.js';

const get = function (request) {
  return {
    name: packageJSON.name,
    version: packageJSON.version,
    description: packageJSON.description,
    environment: config.environment,

    'container-version': process.env.CONTAINER_VERSION,

    'container-app-name': process.env.APP,
    'current-lang': request.i18n.getLocale(),
  };
};

const checkDbStatus = async function () {
  try {
    await knex.raw('SELECT 1 FROM knex_migrations_lock');
    return { message: 'Connection to database ok' };
  } catch {
    throw Boom.serverUnavailable('Connection to database failed');
  }
};

const checkRedisStatus = async function () {
  try {
    await redisMonitor.ping();
    return { message: 'Connection to Redis ok' };
  } catch {
    throw Boom.serverUnavailable('Connection to Redis failed');
  }
};

const healthcheckController = { get, checkDbStatus, checkRedisStatus };

export { healthcheckController };
