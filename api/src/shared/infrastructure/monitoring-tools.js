import lodash from 'lodash';

import { config } from '../config.js';

const { get, update, omit } = lodash;
import { asyncLocalStorage, getContext, getInContext, setInContext } from './async-local-storage.js';
import { logger } from './utils/logger.js';
import * as requestResponseUtils from './utils/request-response-utils.js';

function getRequestId() {
  if (!config.hapi.enableRequestMonitoring) {
    return null;
  }

  const context = getContext();

  return get(context, 'request.headers.x-request-id', null);
}

function getCorrelationContext() {
  if (!config.hapi.enableRequestMonitoring) {
    return {};
  }
  const context = asyncLocalStorage.getStore();
  const request = get(context, 'request');
  return {
    user_id: extractUserIdFromRequest(request),
    request_id: get(request, 'headers.x-request-id', '-'),
    id: get(request, 'info.id', '-'),
  };
}

function logInfoWithCorrelationIds(data) {
  const context = getCorrelationContext();
  logger.info(
    {
      ...context,
      ...omit(data, 'message'),
    },
    get(data, 'message', '-'),
  );
}

function logWarnWithCorrelationIds(data) {
  const context = getCorrelationContext();
  logger.warn(
    {
      ...context,
      ...omit(data, 'message'),
    },
    get(data, 'message', '-'),
  );
}

/**
 * In order to be displayed properly in Datadog,
 * the parameter "data" should contain
 * - a required property message as string
 * - all other properties you need to pass to Datadog
 *
 * @example
 * const data = {
 *   message: 'Error message',
 *   context: 'My Context',
 *   data: { more: 'data', if: 'needed' },
 *   event: 'Event which trigger this error',
 *   team: 'My Team',
 * };
 * monitoringTools.logErrorWithCorrelationIds(data);
 *
 * @param {object} data
 */
function logErrorWithCorrelationIds(data) {
  const context = getCorrelationContext();
  logger.error(
    {
      ...context,
      ...omit(data, 'message'),
    },
    get(data, 'message', '-'),
  );
}

function extractUserIdFromRequest(request) {
  let userId = get(request, 'auth.credentials.userId');
  if (!userId && get(request, 'headers.authorization')) userId = requestResponseUtils.extractUserIdFromRequest(request);
  return userId || '-';
}

function incrementInContext(path, increment = 1) {
  const store = asyncLocalStorage.getStore();
  if (!store) return;
  update(store, path, (v) => (v ?? 0) + increment);
}

const monitoringTools = {
  extractUserIdFromRequest,
  getContext,
  getInContext,
  incrementInContext,
  logErrorWithCorrelationIds,
  logWarnWithCorrelationIds,
  logInfoWithCorrelationIds,
  setInContext,
  asyncLocalStorage,
};

export {
  asyncLocalStorage,
  extractUserIdFromRequest,
  getContext,
  getInContext,
  getRequestId,
  incrementInContext,
  logErrorWithCorrelationIds,
  logInfoWithCorrelationIds,
  logWarnWithCorrelationIds,
  monitoringTools,
  setInContext,
};
