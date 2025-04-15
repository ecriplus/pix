import Request from '@hapi/hapi/lib/request.js';
import lodash from 'lodash';
const { get, set } = lodash;
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function getInContext(path, defaultValue) {
  const store = asyncLocalStorage.getStore();
  if (!store) return;
  return get(store, path, defaultValue);
}

function setInContext(path, value) {
  const store = asyncLocalStorage.getStore();
  if (!store) return;
  set(store, path, value);
}

function getContext() {
  return asyncLocalStorage.getStore();
}

function installHapiHook() {
  const originalMethod = Request.prototype._execute;

  if (!originalMethod) {
    throw new Error('Hapi method Request.prototype._execute not found while patch');
  }

  Request.prototype._execute = function (...args) {
    const request = this;
    const context = { request };
    return asyncLocalStorage.run(context, () => originalMethod.call(request, args));
  };
}

export { asyncLocalStorage, getContext, getInContext, installHapiHook, setInContext };
