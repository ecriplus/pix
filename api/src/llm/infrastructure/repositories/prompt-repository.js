import { PassThrough, pipeline, Transform } from 'node:stream';

import jwt from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { LLMApiError } from '../../domain/errors.js';
const logger = child('llm:api', { event: SCOPES.LLM });

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
  const historySize = configuration.llm.historySize;
  const messagesToForward = chat.messages.slice(-historySize).map(toHistoryMessage);
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
  if (response.status !== 201) {
    const jsonErr = await response.json();
    const errorStr = JSON.stringify(jsonErr, undefined, 2);
    logger.error(`error when reaching LLM API : code (${response.status}) - ${errorStr}`);
    throw new LLMApiError(`code (${response.status}) - ${errorStr}`);
  }
  return response.body;
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
