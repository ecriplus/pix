import { PassThrough, pipeline } from 'node:stream';

import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import * as lengthPrefixedJsonDecoderTransform from './transforms/length-prefixed-json-decoder-transform.js';
import * as messageObjectToEventStreamTransform from './transforms/message-object-to-event-stream-transform.js';

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @function
 * @name fromLLMResponse
 *
 * @param {Object} params
 * @param {ReadableStream|null} params.llmResponse
 * @param {Function} params.onLLMResponseReceived Callback called when LLM response has been completely retrieved. Will be called asynchronously with one parameter: the complete LLM message
 * @param {Boolean} params.shouldSendAttachmentEventMessage
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function fromLLMResponse({ llmResponse, onLLMResponseReceived, shouldSendAttachmentEventMessage }) {
  const writableStream = new PassThrough();
  writableStream.on('error', (err) => {
    logger.error(`error while streaming response: ${err}`);
  });
  if (shouldSendAttachmentEventMessage) {
    writableStream.write(getAttachmentEventMessage());
  }
  const readableStream = llmResponse ?? emptyReadable();
  const completeLLMMessage = [];
  pipeline(
    readableStream,
    lengthPrefixedJsonDecoderTransform.getTransform(),
    messageObjectToEventStreamTransform.getTransform(completeLLMMessage),
    writableStream,
    async (err) => {
      if (err) {
        logger.error(`error in pipeline: ${err}`);
        if (!writableStream.closed && !writableStream.errored) {
          writableStream.end('Error while streaming response from LLM');
        }
      } else {
        await onLLMResponseReceived(completeLLMMessage.join(''));
      }
    },
  );
  return writableStream;
}

function getAttachmentEventMessage() {
  return 'event: attachment\ndata: \n\n';
}

function emptyReadable() {
  const readableStream = new PassThrough();
  readableStream.end();
  return readableStream;
}
