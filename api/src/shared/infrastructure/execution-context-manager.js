import Request from '@hapi/hapi/lib/request.js';
import lodash from 'lodash';
const { get, set, update } = lodash;
import { AsyncLocalStorage } from 'node:async_hooks';

import { tokenService } from '../domain/services/token-service.js';

/**
 * Execution context uses AsyncLocalStorage
 * @type {AsyncLocalStorage<Object>}
 */
const executionContextManager = new AsyncLocalStorage();

/**
 * Enum for supported execution originators (whether it is in a request, a job, etc...)
 * @readonly
 * @enum {string}
 */
export const EXECUTORS = Object.freeze({
  REQUEST: 'REQUEST',
  JOB: 'JOB',
  SCRIPT: 'SCRIPT',
});
/**
 * @typedef {EXECUTORS[keyof EXECUTORS]|null} ExecutorValue
 */

/**
 * Retrieves a value from the current execution context using a lodash path. (ex: 'foo.bar')
 * @param {string} path
 * @param {*} defaultValue
 * @returns {*}
 */
export function getInContext(path, defaultValue) {
  const store = executionContextManager.getStore();
  if (!store) return;
  return get(store, path, defaultValue);
}

/**
 * Sets a value in the current execution context using a lodash path. (ex: 'foo.bar')
 * Works even if intermediate keys in path does not currently exist in context
 * @param {string} path
 * @param {*} value
 */
export function setInContext(path, value) {
  const store = executionContextManager.getStore();
  if (!store) return;
  set(store, path, value);
}

/**
 * Returns the entire current context or undefined if not running in a context
 * @returns {Object|undefined}
 */
export function getContext() {
  return executionContextManager.getStore();
}

/**
 * Executes a function within a specific context.
 * If a context already exists, it merges the new context into the existing one (overriding any pre-existing keys except for executor)
 * If not, it creates a new context.
 * @param {Object} context
 * @param {Function} lambda
 * @param {ExecutorValue} executor
 * @returns {*}
 */
export function executeInContext(context, lambda, executor = null) {
  const currentContext = getContext();
  if (currentContext) {
    Object.assign(currentContext, context);
    return lambda();
  } else {
    context.executor = executor;
    return executionContextManager.run(context, lambda);
  }
}

/**
 * Helper to retrieve the requestId from the headers stored in context
 * @returns {string|null}
 */
export function getRequestId() {
  const context = getContext();

  return get(context, 'request.headers.x-request-id', null);
}

/**
 * Increments a numeric value in the context.
 * @param {string} path
 * @param {number} increment - default: 1
 */
export function incrementInContext(path, increment = 1) {
  const store = executionContextManager.getStore();
  if (!store) return;
  update(store, path, (v) => (v ?? 0) + increment);
}

/**
 * Get all information from the context that are relevant for helping in logging (called correlation info)
 * @returns {Object}
 */
export function getCorrelationInfo() {
  const request = getInContext('request', null);
  const scriptName = getInContext('scriptName', null);
  const jobId = getInContext('jobId', null);
  const request_id = get(request, 'headers.x-request-id', getInContext('default_request_id', null));
  const user_id = extractUserIdFromRequest(request);

  return {
    user_id,
    request_id,
    scriptName,
    jobId,
  };
}

function extractUserIdFromRequest(request) {
  let userId = get(request, 'auth.credentials.userId');

  if (!userId && get(request, 'headers.authorization')) {
    const token = tokenService.extractTokenFromAuthChain(request.headers.authorization);
    userId = tokenService.extractUserId(token);
  }

  return userId ?? null;
}

/**
 * Wrap every request execution in an ExecutionContext.
 * @throws {Error} If the Hapi Request prototype cannot be found.
 */
export function installHapiHook() {
  const originalMethod = Request.prototype._execute;

  if (!originalMethod) {
    throw new Error('Hapi method Request.prototype._execute not found while patch');
  }

  Request.prototype._execute = function (...args) {
    const request = this;
    const context = { request, default_request_id: crypto.randomUUID() };
    return executeInContext(context, () => originalMethod.call(request, args), EXECUTORS.REQUEST);
  };
}
