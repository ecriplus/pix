import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { Chat } from '../../domain/models/Chat.js';
import { EventStreamEncoderStream } from './transforms/event-stream-encoder-transform.js';
import * as events from './transforms/events.js';
import { LengthPrefixedJsonDecoderStream } from './transforms/length-prefixed-json-decoder-transform.js';
import { ResponseObjectsParserStream } from './transforms/response-objects-parser-transform.js';

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @typedef {Object} LLMResponseMetadata
 * @property {string[]} messageParts - Accumulated message chunks.
 * @property {boolean=} haveVictoryConditionsBeenFulfilled - Whether victory conditions were fulfilled during this exchange or not
 * @property {number} inputTokens
 * @property {number} outputTokens
 * @property {boolean} wasModerated
 * @property {string=} errorOccurredDuringStream
 */

export class LLMResponseHandler {
  /** @type {ReadableStream=} */
  llmResponseStream;

  /**
   * @param {WritableStream} responseStream
   */
  constructor(responseStream) {
    this.responseStream = responseStream;
  }

  /**
   * @returns {Promise<LLMResponseMetadata>}
   */
  async processLlmResponse() {
    const llmResponseMetadata = {
      messageParts: [],
      haveVictoryConditionsBeenFulfilled: false,
      inputTokens: 0,
      outputTokens: 0,
      wasModerated: false,
      errorOccurredDuringStream: false,
    };

    if (!this.llmResponseStream) {
      return llmResponseMetadata;
    }

    await this.llmResponseStream
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new LengthPrefixedJsonDecoderStream())
      .pipeThrough(new ResponseObjectsParserStream(llmResponseMetadata))
      .pipeThrough(new EventStreamEncoderStream())
      .pipeTo(this.responseStream, { preventClose: true });

    return llmResponseMetadata;
  }

  /**
   * @param {object} debugData
   * @param {number} debugData.inputTokens
   * @param {number} debugData.outputTokens
   */
  async pushDebugEvents({ inputTokens = 0, outputTokens = 0 } = {}) {
    const inputTokensEvent = events.getDebugInputTokens(inputTokens);
    await this.#write(inputTokensEvent);

    const outputTokensEvent = events.getDebugOutputTokens(outputTokens);
    await this.#write(outputTokensEvent);
  }

  /**
   * @param {'FAILURE'|'SUCCESS'} attachmentStatus
   */
  async pushAttachmentEvent(attachmentStatus) {
    const isSuccess = attachmentStatus === Chat.ATTACHMENT_STATUS.SUCCESS;
    const attachmentEvent = events.getAttachmentMessage(isSuccess);
    await this.#write(attachmentEvent);
  }

  async pushMessageModeratedEvent() {
    await this.#write(events.getMessageModerated());
  }

  async pushErrorEvent() {
    await this.#write(events.getError());
  }

  async pushVictoryConditionsSuccessEvent() {
    await this.#write(events.getVictoryConditionsSuccess());
  }

  async #write(data) {
    let writer;
    try {
      writer = this.responseStream.getWriter();
      await writer.write(data);
    } finally {
      writer?.releaseLock?.();
    }
  }

  async finish() {
    try {
      await this.responseStream.close();
    } catch (err) {
      logger.error(
        { err, responseStream: this.responseStream, llmResponseStream: this.llmResponseStream },
        'Unable to naturally close response stream',
      );
    }
  }
}
