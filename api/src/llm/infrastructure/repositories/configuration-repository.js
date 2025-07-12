import jwt from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { ConfigurationNotFoundError, LLMApiError } from '../../domain/errors.js';
import { Configuration } from '../../domain/models/Configuration.js';

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @function
 * @name get
 *
 * @param {string} id
 * @returns {Promise<Configuration>}
 */
export async function get(id) {
  if (!id) {
    throw new ConfigurationNotFoundError(id);
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
      const configurationDTO = await response.json();
      return Configuration.fromDTO(configurationDTO);
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
