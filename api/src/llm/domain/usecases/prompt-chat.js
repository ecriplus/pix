import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { ChatForbiddenError, ChatNotFoundError, PromptAlreadyOngoingError } from '../errors.js';
import { Chat } from '../models/Chat.js';

/**
 * @typedef {import ('../../infrastructure/repositories/index.js').chatRepository} ChatRepository
 * @typedef {import ('../../infrastructure/repositories/index.js').promptRepository} PromptRepository
 * @typedef {import ('../../../shared/infrastructure/mutex/RedisMutex.js').redisMutex} RedisMutex
 * @typedef {import ('../../infrastructure/streaming/llm-response-handler.js').LLMResponseHandler} LLMResponseHandler
 * @typedef {import ('../../infrastructure/streaming/llm-response-handler.js').LLMResponseMetadata} LLMResponseMetadata
 */

const logger = child('llm:api', { event: SCOPES.LLM });

/**
 * @param {object} params
 * @param {string=} params.chatId
 * @param {number=} params.userId
 * @param {string=} params.message
 * @param {string=} params.attachmentName
 * @param {ChatRepository} params.chatRepository
 * @param {PromptRepository} params.promptRepository
 * @param {RedisMutex} params.redisMutex
 * @param {LLMResponseHandler} params.llmResponseHandler
 * @returns {Promise<void>}
 */
export async function promptChat({
  chatId,
  userId,
  message,
  attachmentName,
  chatRepository,
  promptRepository,
  redisMutex,
  llmResponseHandler,
}) {
  if (!chatId) {
    throw new ChatNotFoundError('null id provided');
  }

  try {
    const locked = await redisMutex.lock(chatId);
    if (!locked) {
      throw new PromptAlreadyOngoingError(chatId);
    }

    const chat = await chatRepository.get(chatId);
    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }
    if (chat.userId != undefined && userId !== chat.userId) {
      throw new ChatForbiddenError();
    }

    chat.addUserMessage(message, attachmentName);

    if (chat.shouldSendForInference) {
      llmResponseHandler.llmResponseStream = await promptRepository.prompt({
        messages: chat.messagesForInference,
        configuration: chat.configuration,
      });
    }

    runFlow({ chat, chatRepository, llmResponseHandler, redisMutex });
  } catch (error) {
    await redisMutex.release(chatId);
    throw error;
  }
}

/**
 * @function
 * @name runFlow
 *
 * @param {object} params
 * @param {Chat} params.chat
 * @param {ChatRepository} params.chatRepository
 * @param {RedisMutex} params.redisMutex
 * @param {LLMResponseHandler} params.llmResponseHandler
 * @returns {Promise<void>}
 */
async function runFlow({ chat, chatRepository, redisMutex, llmResponseHandler }) {
  /** @type {LLMResponseMetadata} */
  let llmResponseMetadata;
  try {
    if (chat.lastAttachmentStatus !== Chat.ATTACHMENT_STATUS.NONE) {
      await llmResponseHandler.pushAttachmentEvent(chat.lastAttachmentStatus);
    }

    llmResponseMetadata = await llmResponseHandler.processLlmResponse();
    const {
      messageParts,
      haveVictoryConditionsBeenFulfilled,
      wasModerated,
      inputTokens,
      outputTokens,
      errorOccurredDuringStream,
    } = llmResponseMetadata;

    if (errorOccurredDuringStream) {
      await llmResponseHandler.pushErrorEvent();
      throw new Error(errorOccurredDuringStream);
    }

    if (chat.lastUserMessage) {
      chat.lastUserMessage.wasModerated = wasModerated;
      if (wasModerated) {
        await llmResponseHandler.pushMessageModeratedEvent();
      }
    }

    if (haveVictoryConditionsBeenFulfilled) {
      chat.haveVictoryConditionsBeenFulfilled = true;
      await llmResponseHandler.pushVictoryConditionsSuccessEvent();
    }

    chat.updateTokenConsumption(inputTokens, outputTokens);
    if (chat.isPreview) {
      await llmResponseHandler.pushDebugEvents({ inputTokens, outputTokens });
    }

    await llmResponseHandler.finish();

    const assistantMessage = messageParts.join('');
    if (assistantMessage) {
      chat.addAssistantMessage(assistantMessage);
    }

    await chatRepository.save(chat);
  } catch (err) {
    logger.error({ err, message: chat.lastUserMessage, llmResponseMetadata }, 'error in runFlow');
  } finally {
    await redisMutex.release(chat.id);
  }
}
