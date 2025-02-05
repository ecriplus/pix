import Boom from '@hapi/boom';

import { knex } from '../../../../db/knex-database-connection.js';
import packageJSON from '../../../../package.json' with { type: 'json' };
import * as network from '../../../identity-access-management/infrastructure/utils/network.js';
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

const checkForwardedOriginStatus = async function (request, h) {
  const forwardedOrigin = network.getForwardedOrigin(request.headers);
  if (!forwardedOrigin) {
    return h.response('Obtaining Forwarded Origin failed').code(500);
  }

  return h.response(forwardedOrigin).code(200);
};

const healthcheckController = { get, checkDbStatus, checkRedisStatus, checkForwardedOriginStatus };

export { healthcheckController };
