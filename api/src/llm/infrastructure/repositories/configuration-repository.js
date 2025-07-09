import jwt from 'jsonwebtoken';
import ms from 'ms';

import { config } from '../../../shared/config.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { ConfigurationNotFoundError, LLMApiError } from '../../domain/errors.js';
import { Configuration } from '../../domain/models/Configuration.js';

export const CONFIGURATION_STORAGE_PREFIX = 'llm-configurations';
const configurationTemporaryStorage = temporaryStorage.withPrefix(CONFIGURATION_STORAGE_PREFIX);
const CONFIGURATION_EXPIRATION_DELAY_SECONDS = ms('1h');

const logger = child('llm:api', { event: SCOPES.LLM });
/**
 * @typedef {import('../../domain/Configuration').Configuration} Configuration
 */

/**
 * @function
 * @name get
 *
 * @param {string} id
 * @returns {Promise<Configuration>}
 */
export async function get(id) {
  const cachedConfiguration = await configurationTemporaryStorage.get(id);
  if (cachedConfiguration) {
    return Configuration.fromDTO(cachedConfiguration);
  }
  const url = config.llm.getConfigurationUrl + '/' + id;
  let response;
  try {
    response = await fetch(url, {
      headers: {
        authorization: `Bearer ${jwt.sign('foo', config.llm.authSecret)}`,
      },
    });
  } catch (err) {
    logger.error({ err }, 'error when trying to reach LLM API');
    throw new LLMApiError(err.toString());
  }
  const contentType = response.headers.get('Content-Type');
  if (response.ok) {
    if (contentType === 'application/json') {
      const jsonResponse = await response.json();
      const configuration = toDomainFromLLMApi(id, jsonResponse);
      await configurationTemporaryStorage.save({
        key: id,
        value: configuration.toDTO(),
        expirationDelaySeconds: CONFIGURATION_EXPIRATION_DELAY_SECONDS,
      });
      return configuration;
    }
    throw new LLMApiError('unexpected content-type response');
  }
  const { status, err } = await handleFetchErrors(response);
  if (status === 404) {
    throw new ConfigurationNotFoundError(id);
  } else {
    logger.error({ err }, `error when reaching LLM API : code ${status}`);
    throw new LLMApiError(err);
  }
}

async function handleFetchErrors(response) {
  const contentType = response.headers.get('Content-Type');
  let err = 'no error message provided';
  if (response.body) {
    if (contentType === 'application/json') {
      err = JSON.stringify(await response.json(), undefined, 2);
    } else {
      err = await response.text();
    }
  }
  return {
    status: response.status,
    err,
  };
}

function toDomainFromLLMApi(id, configurationDTO) {
  return new Configuration({
    id,
    historySize: configurationDTO?.llm?.historySize ?? null,
    inputMaxChars: configurationDTO?.challenge?.inputMaxChars ?? null,
    inputMaxPrompts: configurationDTO?.challenge?.inputMaxPrompts ?? null,
    attachmentName: configurationDTO?.attachment?.name ?? null,
    attachmentContext: configurationDTO?.attachment?.context ?? null,
  });
}
