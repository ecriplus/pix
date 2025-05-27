import { PassThrough, pipeline, Transform } from 'node:stream';

import jwt from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { LLMApiError } from '../../domain/errors.js';
const logger = child('llm:api', { event: SCOPES.LLM });

export async function prompt({ message, configuration, chat, onLLMResponseReceived }) {
  const readableStream = await postUserPrompt({ message, configuration, chat });

  let completeLLMMessage = '';
  const transformLLMResponseToDataEventStream = new Transform({
    writableObjectMode: false,
    transform(chunk, _encoding, callback) {
      const decoder = new TextDecoder();
      const messages = extractMessages(decoder.decode(chunk));
      if (messages.length === 0) {
        callback(null, '');
        return;
      }
      completeLLMMessage += messages.join('');
      const data = toEventStreamData(messages);
      callback(null, data);
    },
  });

  const writableStream = new PassThrough();
  writableStream.on('error', (err) => {
    logger.error(`error while streaming response: ${err}`);
  });
  pipeline(readableStream, transformLLMResponseToDataEventStream, writableStream, async (err) => {
    if (err) {
      logger.error(`error in pipeline: ${err}`);
      if (!writableStream.closed && !writableStream.errored) {
        writableStream.end('Error while streaming response from LLM');
      }
    } else {
      await onLLMResponseReceived(completeLLMMessage);
    }
  });
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

export function extractMessages(chunk) {
  const messages = [];
  let currentWord = '';
  let isReadingMessage = false;
  let previousCharWasAntislash = false;
  const regexStartMessage = /}?\d+:\{"message":"/;
  for (const char of chunk) {
    currentWord += char;
    if (isReadingMessage) {
      if (!previousCharWasAntislash && char === '"') {
        messages.push(currentWord.slice(0, -1));
        isReadingMessage = false;
        currentWord = '';
        previousCharWasAntislash = false;
        continue;
      }

      previousCharWasAntislash = char === '\\';
    } else {
      if (currentWord.match(regexStartMessage)?.length > 0) {
        isReadingMessage = true;
        currentWord = '';
      }
    }
  }
  return messages;
}

export function toEventStreamData(messages) {
  return messages
    .map((message) => {
      const formattedMessage = message.replaceAll('\n', '\ndata: ');
      return `data: ${formattedMessage}\n\n`;
    })
    .join('');
}
