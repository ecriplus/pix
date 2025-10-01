import { PassThrough, pipeline } from 'node:stream';

import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import * as lengthPrefixedJsonDecoderTransform from './transforms/length-prefixed-json-decoder-transform.js';
import * as responseObjectToEventStreamTransform from './transforms/response-object-to-event-stream-transform.js';
import * as sendDebugDataTransform from './transforms/send-debug-data-transform.js';

const logger = child('llm:api', { event: SCOPES.LLM });

export const ATTACHMENT_MESSAGE_TYPES = {
  NONE: 'NONE',
  IS_VALID: 'IS_VALID',
  IS_INVALID: 'IS_INVALID',
};

/**
 * @typedef {Object} StreamCapture
 * @property {string[]} LLMMessageParts - Accumulated message chunks.
 * @property {boolean=} haveVictoryConditionsBeenFulfilled - Whether victory conditions were fulfilled during this exchange or not
 * @property {number} inputTokens
 * @property {number} outputTokens
 * @property {boolean} wasModerated
 * @property {string=} errorOccurredDuringStream
 */

/**
 * @callback OnStreamDoneCallback
 * @param {StreamCapture} streamCapture
 * @param {boolean} hasStreamSucceeded
 */

/**
 * @function
 * @name fromLLMResponse
 *
 * @param {Object} params
 * @param {ReadableStream|null} params.llmResponse
 * @param {OnStreamDoneCallback} params.onStreamDone
 * @param {string} params.attachmentMessageType
 * @param {boolean} params.shouldSendDebugData
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function fromLLMResponse({ llmResponse, onStreamDone, attachmentMessageType, shouldSendDebugData }) {
  const writableStream = new PassThrough();
  writableStream.on('error', (err) => {
    logger.error(`error while streaming response: ${err}`);
  });
  if (attachmentMessageType !== ATTACHMENT_MESSAGE_TYPES.NONE) {
    writableStream.write(getAttachmentEventMessage(attachmentMessageType === ATTACHMENT_MESSAGE_TYPES.IS_VALID));
  }
  const readableStream = llmResponse ?? emptyReadable();
  /** @type {StreamCapture} */
  const streamCapture = {
    LLMMessageParts: [],
    haveVictoryConditionsBeenFulfilled: undefined,
    inputTokens: 0,
    outputTokens: 0,
    wasModerated: false,
  };
  pipeline(
    readableStream,
    lengthPrefixedJsonDecoderTransform.getTransform(),
    responseObjectToEventStreamTransform.getTransform(streamCapture),
    sendDebugDataTransform.getTransform(streamCapture, shouldSendDebugData),
    writableStream,
    async (err) => {
      if (err) {
        logger.error(`error in pipeline: ${err}`);
        if (!writableStream.closed && !writableStream.errored) {
          writableStream.end('Error while streaming response from LLM');
        }
      }
      await onStreamDone(streamCapture, !err);
    },
  );
  return writableStream;
}

function getAttachmentEventMessage(isValid) {
  return 'event: attachment-' + (isValid ? 'success' : 'failure') + '\ndata: \n\n';
}

function emptyReadable() {
  const readableStream = new PassThrough();
  readableStream.end();
  return readableStream;
}
