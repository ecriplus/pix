import { PassThrough, pipeline, Transform } from 'node:stream';

import jwt from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { LLMApiError } from '../../domain/errors.js';
const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @typedef {import('../../domain/Configuration').Configuration} Configuration
 * @typedef {import('../../domain/Chat').Chat} Chat
 */

/**
 * @function
 * @name prompt
 *
 * @param {Object} params
 * @param {string} params.message
 * @param {Configuration} params.configuration
 * @param {Chat} params.chat
 * @param {Function} params.onLLMResponseReceived Callback called when LLM response has been completely retrieved. Will be called asynchronously with one parameter: the complete LLM message
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function prompt({ message, configuration, chat, onLLMResponseReceived }) {
  const readableStream = await postUserPrompt({ message, configuration, chat });

  const decoder = new TextDecoder();
  const transformFindObjects = new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const objects = findObjects(decoder.decode(chunk));
      for (const object of objects) {
        this.push(object);
      }
      callback();
    },
  });

  let completeLLMMessage = '';
  const transformConvertObjectToEventStreamData = new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const { message } = chunk;
      if (!message) {
        callback();
        return;
      }
      completeLLMMessage += message;
      const data = toEventStreamData(message);
      callback(null, data);
    },
  });

  const writableStream = new PassThrough();
  writableStream.on('error', (err) => {
    logger.error(`error while streaming response: ${err}`);
  });
  pipeline(
    readableStream,
    transformFindObjects,
    transformConvertObjectToEventStreamData,
    writableStream,
    async (err) => {
      if (err) {
        logger.error(`error in pipeline: ${err}`);
        if (!writableStream.closed && !writableStream.errored) {
          writableStream.end('Error while streaming response from LLM');
        }
      } else {
        await onLLMResponseReceived(completeLLMMessage);
      }
    },
  );
  return writableStream;
}

async function postUserPrompt({ message, configuration, chat }) {
  const messagesToForward = chat.messages.slice(-configuration.historySize).map(toHistoryMessage);
  const payload = JSON.stringify({
    prompt: message,
    configurationId: configuration.id,
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

function toHistoryMessage(message) {
  return {
    content: message.content,
    role: message.isFromUser ? 'user' : 'assistant',
  };
}

export function toEventStreamData(message) {
  const formattedMessage = message.replaceAll('\n', '\ndata: ');
  return `data: ${formattedMessage}\n\n`;
}

export function findObjects(str) {
  const objects = [];
  while (str.length > 0) {
    const [numberAsStr, ...otherParts] = str.split(':');
    const objectLength = parseInt(numberAsStr);
    const strLeft = otherParts.join(':');
    objects.push(strLeft.slice(0, objectLength));
    str = strLeft.slice(objectLength);
  }

  return objects.map((obj) => JSON.parse(obj));
}
