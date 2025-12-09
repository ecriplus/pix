import jwt from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { getCorrelationContext } from '../../../shared/infrastructure/monitoring-tools.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { LLMApiError } from '../../domain/errors.js';

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @typedef {import('../../domain/models/Configuration').Configuration} Configuration
 * @typedef {import('../../domain/models/Chat').Chat} Chat
 */

/**
 * @typedef MessageForInference
 * @property {string} content
 * @property {"user"|"assistant"} role
 */

/**
 * @function
 * @name prompt
 *
 * @param {Object} params
 * @param {MessageForInference[]} params.messages
 * @param {Configuration} params.configuration
 * @returns {Promise<ReadableStream>}
 */
export async function prompt({ messages, configuration }) {
  const lastMessage = messages.pop();
  const payload = JSON.stringify({
    prompt: lastMessage.content,
    configuration: configuration.toDTO(),
    history: messages,
  });
  let response;
  const url = config.llm.postPromptUrl;

  let currentRetryCount = 0;
  const MAX_RETRY_COUNT = 2;
  do {
    try {
      const urlWithRetryCount = currentRetryCount === 0 ? url : `${url}?retry_count=${currentRetryCount}`;
      response = await fetch(urlWithRetryCount, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': getCorrelationContext().request_id,
          authorization: `Bearer ${jwt.sign(
            {
              client_id: 'pix-api',
              scope: 'api',
            },
            config.llm.authSecret,
          )}`,
        },
        body: payload,
      });
    } catch (err) {
      logger.error(`error when trying to reach LLM API : ${err}`);
      throw new LLMApiError(err.toString());
    }
    if (response.ok) {
      return response.body;
    }

    const { status, err } = await handleFetchErrors(response);
    logger.error({ err }, `error when reaching LLM API : code ${status}`);

    if (status !== 502 || currentRetryCount >= MAX_RETRY_COUNT) {
      throw new LLMApiError(err);
    }

    currentRetryCount++;
  } while (currentRetryCount <= MAX_RETRY_COUNT);
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
