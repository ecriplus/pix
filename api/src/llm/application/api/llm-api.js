import {
  ChatForbiddenError,
  ChatNotFoundError,
  ConfigurationNotFoundError,
  MaxPromptsReachedError,
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
  const { name: attachmentName, context: attachmentContext } = getAttachmentContextAndName(configuration);
  const newChat = new Chat({
    id: chatId,
    configurationId: configId,
    attachmentName,
    attachmentContext,
    messages: [],
  });
  await chatRepository.save(newChat);
  return new LLMChatDTO({
    id: newChat.id,
    attachmentName,
    inputMaxChars: getInputMaxCharsFromConfiguration(configuration),
    inputMaxPrompts: getInputMaxPromptsFromConfiguration(configuration),
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
 * @param {string} params.message
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function prompt({ chatId, userId, message }) {
  if (!chatId) {
    throw new ChatNotFoundError('null id provided');
  }
  const chat = await chatRepository.get(chatId);
  if (!userId || !chat.id.startsWith(userId)) {
    throw new ChatForbiddenError();
  }
  const configuration = await configurationRepository.get(chat.configurationId);
  if (message.length > getInputMaxCharsFromConfiguration(configuration)) {
    throw new TooLargeMessageInputError();
  }
  if (chat.currentPromptsCount >= getInputMaxPromptsFromConfiguration(configuration)) {
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

function getInputMaxCharsFromConfiguration(configuration) {
  return configuration.challenge.inputMaxChars;
}

function getInputMaxPromptsFromConfiguration(configuration) {
  return configuration.challenge.inputMaxPrompts;
}

function getAttachmentContextAndName(configuration) {
  return configuration.attachment ?? { name: null, context: null };
}

function addMessagesToChat(chat, prompt, chatRepository) {
  return async (llmMessage) => {
    chat.addUserMessage(prompt);
    chat.addLLMMessage(llmMessage);
    await chatRepository.save(chat);
  };
}
