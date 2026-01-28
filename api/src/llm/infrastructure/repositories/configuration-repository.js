import jwt from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { ConfigurationNotFoundError, LLMApiError } from '../../domain/errors.js';
import { Configuration } from '../../domain/models/Configuration.js';

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @param {string} id
 * @returns {Promise<Configuration>}
 */
export async function get(id) {
  if (!id) {
    throw new ConfigurationNotFoundError(id);
  }

  const url = config.llm.configurationEditorApi.getConfigurationUrl + '/' + id;
  let response;
  try {
    response = await fetch(url, {
      headers: {
        authorization: `Bearer ${jwt.sign('foo', config.llm.configurationEditorApi.authSecret)}`,
      },
    });
  } catch (err) {
    logger.error(
      {
        err,
        context: 'fetch-configuration',
        data: {
          configurationId: id,
        },
      },
      'fetch error when trying to reach LLM API',
    );
    throw new LLMApiError(err.toString());
  }

  if (response.ok) {
    const contentType = response.headers.get('Content-Type');
    if (contentType !== 'application/json') {
      logger.error({
        err: `received unexpected response Content-Type when fetching configuration`,
        context: 'fetch-configuration',
        data: {
          configurationId: id,
          responseContentType: contentType,
          responseBody: await response.text().catch(() => 'Unreadable response body'),
        },
      });
      throw new LLMApiError('Unexpected response Content-Type');
    }

    const configurationDTO = await response.json();
    return Configuration.fromDTO(configurationDTO);
  }

  const { status, err } = await handleFetchErrors(response);
  if (status === 404) {
    throw new ConfigurationNotFoundError(id);
  } else {
    logger.error(
      {
        err,
        context: 'fetch-configuration',
        data: {
          configurationId: id,
          responseStatus: status,
        },
      },
      `error when reaching LLM API : code ${status}`,
    );
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
