import * as originalOpenidClient from 'openid-client';

import { logger } from '../../../shared/infrastructure/utils/logger.js';

const MAX_RETRY_COUNT = 10;
const WAIT_DURATION_IN_MS = 2000;

export class OpenidClientWithRetry {
  #openidClient;
  #maxRetryCount;
  #waitDurationInMs;

  constructor({ identityProvider, openidClient, maxRetryCount, durationInMs } = {}) {
    this.#openidClient = openidClient ?? originalOpenidClient;
    this.#maxRetryCount = maxRetryCount ?? MAX_RETRY_COUNT;
    this.#waitDurationInMs = durationInMs ?? WAIT_DURATION_IN_MS;
    this.identityProvider = identityProvider;
  }

  /**
   * See {@link originalOpenidClient.discovery}
   */
  async discovery() {
    return this.#executeWithRetry(this.#openidClient.discovery, arguments);
  }

  /**
   * See {@link originalOpenidClient.authorizationCodeGrant}
   */
  async authorizationCodeGrant() {
    return await this.#executeWithRetry(this.#openidClient.authorizationCodeGrant, arguments);
  }

  /**
   * See {@link originalOpenidClient.fetchUserInfo}
   */
  async fetchUserInfo() {
    return this.#executeWithRetry(this.#openidClient.fetchUserInfo, arguments);
  }

  /**
   * See {@link originalOpenidClient.buildAuthorizationUrl}
   */
  buildAuthorizationUrl() {
    return this.#openidClient.buildAuthorizationUrl.apply(this.#openidClient, arguments);
  }

  /**
   * See {@link originalOpenidClient.buildEndSessionUrl}
   */
  buildEndSessionUrl() {
    return this.#openidClient.buildEndSessionUrl.apply(this.#openidClient, arguments);
  }

  async #executeWithRetry(f, params, retryCount = 0) {
    try {
      return await f.apply(this.#openidClient, params);
    } catch (error) {
      if (retryCount >= this.#maxRetryCount) {
        throw error;
      }

      _monitorError(this.identityProvider, error, f, retryCount);

      await new Promise((resolve) => setTimeout(() => resolve(), this.#waitDurationInMs));

      return this.#executeWithRetry(f, params, retryCount + 1);
    }
  }
}

function _monitorError(identityProvider, error, f, retryCount) {
  const monitoringData = {
    message: `Error for identityProvider ${identityProvider} executing ${f.name}, retry = ${retryCount}`,
    context: 'oidc',
    team: 'acces',
  };

  monitoringData.error = {
    name: error.constructor.name,
    message: error.message,
    stack: error.stack,
    ...(error.error_uri && { errorUri: error.error_uri }),
    ...(error.response && { response: error.response }),
  };

  logger.info(monitoringData);
}
