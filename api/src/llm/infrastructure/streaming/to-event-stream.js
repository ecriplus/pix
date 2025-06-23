import { PassThrough, pipeline, Transform } from 'node:stream';

import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @function
 * @name fromLLMResponse
 *
 * @param {ReadableStream} llmResponse
 * @param {Function} onLLMResponseReceived Callback called when LLM response has been completely retrieved. Will be called asynchronously with one parameter: the complete LLM message
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function fromLLMResponse(llmResponse, onLLMResponseReceived) {
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
  pipeline(llmResponse, transformFindObjects, transformConvertObjectToEventStreamData, writableStream, async (err) => {
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
