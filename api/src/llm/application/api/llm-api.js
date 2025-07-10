import {
  ChatForbiddenError,
  ChatNotFoundError,
  MaxPromptsReachedError,
  NoAttachmentNeededError,
  NoAttachmentNorMessageProvidedError,
  NoUserIdProvidedError,
  TooLargeMessageInputError,
} from '../../domain/errors.js';
import { usecases } from '../../domain/usecases/index.js';
import * as chatRepository from '../../infrastructure/repositories/chat-repository.js';
import * as promptRepository from '../../infrastructure/repositories/prompt-repository.js';
import * as toEventStream from '../../infrastructure/streaming/to-event-stream.js';
import { LLMChatDTO } from './models/LLMChatDTO.js';

/**
 * @typedef LLMChatDTO
 * @type {object}
 * @property {string} id
 * @property {number} inputMaxPrompts
 * @property {number} inputMaxChars
 */

/**
 * @function
 * @name startChat
 *
 * @param {Object} params
 * @param {string} params.configId
 * @param {string} params.userId
 * @returns {Promise<LLMChatDTO>}
 */
export async function startChat({ configId, userId }) {
  if (!userId) {
    throw new NoUserIdProvidedError();
  }
  const { id, configuration } = await usecases.startChat({ configId, userId });
  return new LLMChatDTO({
    id,
    attachmentName: configuration.attachmentName,
    inputMaxChars: configuration.inputMaxChars,
    inputMaxPrompts: configuration.inputMaxPrompts,
  });
}

/**
 * @function
 * @name prompt
 *
 * @param {Object} params
 * @param {string} params.chatId
 * @param {string} params.userId
 * @param {string|null|undefined} params.message
 * @param {string|null|undefined} params.attachmentName
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function prompt({ chatId, userId, message, attachmentName }) {
  if (!chatId) {
    throw new ChatNotFoundError('null id provided');
  }
  if (!attachmentName && !message) {
    throw new NoAttachmentNorMessageProvidedError();
  }

  const chat = await chatRepository.get(chatId);
  if (!userId || userId !== chat.userId) {
    throw new ChatForbiddenError();
  }

  const { configuration } = chat;
  if (attachmentName && !configuration.hasAttachment) {
    throw new NoAttachmentNeededError();
  }
  if (attachmentName && attachmentName === configuration.attachmentName) {
    chat.addAttachmentContextMessages(configuration.attachmentName, configuration.attachmentContext, !!message);
  }
  let readableStream = null;
  if (message) {
    if (message.length > configuration.inputMaxChars) {
      throw new TooLargeMessageInputError();
    }

    if (chat.currentPromptsCount >= configuration.inputMaxPrompts) {
      throw new MaxPromptsReachedError();
    }

    readableStream = await promptRepository.prompt({
      message,
      configuration,
      chat,
    });
  }

  return toEventStream.fromLLMResponse({
    llmResponse: readableStream,
    onLLMResponseReceived: addMessagesToChat(chat, message, chatRepository),
    shouldSendAttachmentEventMessage: Boolean(attachmentName),
  });
}

function addMessagesToChat(chat, prompt, chatRepository) {
  return async (llmMessage) => {
    chat.addUserMessage(prompt);
    chat.addLLMMessage(llmMessage);
    await chatRepository.save(chat);
  };
}
