import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import {
  ChatForbiddenError,
  ChatNotFoundError,
  NoAttachmentNorMessageProvidedError,
  PromptAlreadyOngoingError,
} from '../errors.js';
import { ChatV2 } from '../models/ChatV2.js';

/**
 * @typedef {import ('../../infrastructure/repositories/index.js').chatRepository} ChatRepository
 * @typedef {import ('../../infrastructure/repositories/index.js').promptRepository} PromptRepository
 * @typedef {import ('../../infrastructure/streaming/to-event-stream.js')} toEventStream
 * @typedef {import ('../../infrastructure/streaming/to-event-stream.js').StreamCapture} StreamCapture
 * @typedef {import ('../../../shared/infrastructure/mutex/RedisMutex.js').redisMutex} RedisMutex
 */

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @param {Object} params
 * @param {string=} params.chatId
 * @param {number=} params.userId
 * @param {string=} params.message
 * @param {string=} params.attachmentName
 * @param {ChatRepository} params.chatRepository
 * @param {PromptRepository} params.promptRepository
 * @param {toEventStream} params.toEventStream
 * @param {RedisMutex} params.redisMutex
 */
export async function promptChat({
  chatId,
  userId,
  message,
  attachmentName,
  chatRepository,
  promptRepository,
  toEventStream,
  redisMutex,
}) {
  if (!chatId) {
    throw new ChatNotFoundError('null id provided');
  }

  try {
    const locked = await redisMutex.lock(chatId);
    if (!locked) {
      throw new PromptAlreadyOngoingError(chatId);
    }
    const hasAnAttachmentBeenProvided = !!attachmentName;
    const hasAMessageBeenProvided = !!message;
    if (!hasAnAttachmentBeenProvided && !hasAMessageBeenProvided) {
      throw new NoAttachmentNorMessageProvidedError();
    }

    const chat = await chatRepository.getV2(chatId);

    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }

    if (chat.userId != undefined && userId !== chat.userId) {
      throw new ChatForbiddenError();
    }

    chat.addUserMessage(message, attachmentName);

    let attachmentMessageType;
    if (hasAnAttachmentBeenProvided) {
      attachmentMessageType =
        chat.lastAttachmentStatus === ChatV2.ATTACHMENT_STATUS.SUCCESS
          ? toEventStream.ATTACHMENT_MESSAGE_TYPES.IS_VALID
          : toEventStream.ATTACHMENT_MESSAGE_TYPES.IS_INVALID;
    } else {
      attachmentMessageType = toEventStream.ATTACHMENT_MESSAGE_TYPES.NONE;
    }

    let readableStream = null;
    if (chat.shouldSendForInference) {
      readableStream = await promptRepository.promptV2({
        messages: chat.messagesForInference,
        configuration: chat.configuration,
      });
    }

    return toEventStream.fromLLMResponse({
      llmResponse: readableStream,
      onStreamDone: finalize({ chat, chatRepository, redisMutex }),
      attachmentMessageType,
      shouldSendDebugData: chat.isPreview,
      prompt: message,
    });
  } catch (error) {
    await redisMutex.release(chatId);
    throw error;
  }
}

/**
 * @function
 * @name finalize
 *
 * @param {object} params
 * @param {ChatV2} params.chat
 * @param {ChatRepository} params.chatRepository
 * @param {RedisMutex} params.redisMutex
 * @returns {(streamCapture: StreamCapture, hasStreamSucceeded: boolean) => Promise<void>}
 */
function finalize({ chat, chatRepository, redisMutex }) {
  return async (streamCapture, hasStreamSucceeded) => {
    try {
      if (hasStreamSucceeded) {
        if (chat.lastUserMessage) {
          chat.lastUserMessage.wasModerated = streamCapture.wasModerated;
        }

        if (streamCapture.haveVictoryConditionsBeenFulfilled) {
          chat.haveVictoryConditionsBeenFulfilled = true;
        }

        const assistantMessage = streamCapture.LLMMessageParts.join('');
        if (assistantMessage) {
          chat.addAssistantMessage(assistantMessage);
        }

        chat?.updateTokenConsumption?.(streamCapture.inputTokens, streamCapture.outputTokens);
        await chatRepository.save(chat);
      }
    } catch (err) {
      logger.error({ err, chatId: chat.id, streamCapture }, 'error while finalizing');
    } finally {
      await redisMutex.release(chat.id);
    }
  };
}
