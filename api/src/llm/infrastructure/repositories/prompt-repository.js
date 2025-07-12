import jwt from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { LLMApiError } from '../../domain/errors.js';

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @typedef {import('../../domain/models/Configuration').Configuration} Configuration
 * @typedef {import('../../domain/models/Chat').Chat} Chat
 */

/**
 * @function
 * @name prompt
 *
 * @param {Object} params
 * @param {string} params.message
 * @param {Configuration} params.configuration
 * @param {Chat} params.chat
 * @returns {Promise<ReadableStream>}
 */
export async function prompt({ message, configuration, chat }) {
  const messagesToForward = chat.messages.slice(-configuration.historySize).map((message) => message.toLLMHistory());
  const payload = JSON.stringify({
    prompt: message,
    configurationId: chat.configurationId,
    history: messagesToForward,
  });
  let response;
  const url = config.llm.postPromptUrl;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${jwt.sign('foo', config.llm.authSecret)}`,
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
  throw new LLMApiError(err);
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
