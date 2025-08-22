import { DomainError } from '../domain/errors.js';
import { child, SCOPES } from '../infrastructure/utils/logger.js';
import * as errorManager from './error-manager.js';
import { BaseHttpError } from './http-errors.js';

const logger = child('iam:http', { event: SCOPES.IAM });

function handleDomainAndHttpErrors(
  request,
  h,
  dependencies = {
    errorManager,
  },
) {
  const response = request.response;

  if (response instanceof DomainError || response instanceof BaseHttpError) {
    debugRequestErrors(request, [
      { method: 'post', path: '/api/users' },
      { method: 'post', path: '/api/oidc/token' },
    ]);

    return dependencies.errorManager.handle(request, h, response);
  }

  return h.continue;
}

function debugRequestErrors(request, debugConfig = []) {
  for (const config of debugConfig) {
    const { method, path } = config;

    if (request?.route?.method !== method) continue;
    if (request?.route?.path !== path) continue;

    logger.info(
      {
        method,
        path,
        stack: JSON.stringify(request?.response?.stack || ''),
        detail: JSON.stringify(request?.response?.invalidAttributes || ''),
      },
      `Debug HTTP error for ${method} ${path}`,
    );
  }
}

export { handleDomainAndHttpErrors };
