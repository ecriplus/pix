import {
  ChatForbiddenError,
  ChatNotFoundError,
  ConfigurationNotFoundError,
  MaxPromptsReachedError,
  NoAttachmentNeededError,
  NoAttachmentNorMessageProvidedError,
  NoUserIdProvidedError,
  TooLargeMessageInputError,
} from '../../domain/errors.js';
import { Chat } from '../../domain/models/Chat.js';
import * as chatRepository from '../../infrastructure/repositories/chat-repository.js';
import * as configurationRepository from '../../infrastructure/repositories/configuration-repository.js';
import * as promptRepository from '../../infrastructure/repositories/prompt-repository.js';
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
  if (!configId) {
    throw new ConfigurationNotFoundError('null id provided');
  }
  if (!userId) {
    throw new NoUserIdProvidedError();
  }
  const configuration = await configurationRepository.get(configId);
  const chatId = generateId(userId);
  const newChat = new Chat({
    id: chatId,
    configurationId: configuration.id,
    attachmentName: configuration.attachmentName,
    attachmentContext: configuration.attachmentContext,
    messages: [],
  });
  await chatRepository.save(newChat);
  return new LLMChatDTO({
    id: newChat.id,
    attachmentName: configuration.attachmentName,
    inputMaxChars: configuration.inputMaxChars,
    inputMaxPrompts: configuration.inputMaxPrompts,
  });
}

/**
 * @typedef LLMChatResponseDTO
 * @type {object}
 * @property {string} message
 */

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
  const chat = await chatRepository.get(chatId);
  if (!userId || !chat.id.startsWith(userId)) {
    throw new ChatForbiddenError();
  }
  const configuration = await configurationRepository.get(chat.configurationId);
  if (attachmentName && !configuration.hasAttachment) {
    throw new NoAttachmentNeededError();
  }
  if (!attachmentName && !message) {
    throw new NoAttachmentNorMessageProvidedError();
  }
  if (message.length > configuration.inputMaxChars) {
    throw new TooLargeMessageInputError();
  }
  if (chat.currentPromptsCount >= configuration.inputMaxPrompts) {
    throw new MaxPromptsReachedError();
  }

  return promptRepository.prompt({
    message,
    configuration,
    chat,
    onLLMResponseReceived: addMessagesToChat(chat, message, chatRepository),
  });
}

function generateId(userId) {
  const nowMs = new Date().getMilliseconds();
  return `${userId}-${nowMs}`;
}

function addMessagesToChat(chat, prompt, chatRepository) {
  return async (llmMessage) => {
    chat.addUserMessage(prompt);
    chat.addLLMMessage(llmMessage);
    await chatRepository.save(chat);
  };
}
