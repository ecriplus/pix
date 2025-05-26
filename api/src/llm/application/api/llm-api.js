import {
  ChatNotFoundError,
  ConfigurationNotFoundError,
  MaxPromptsReachedError,
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
 * @param {string} params.prefixIdentifier
 * @returns {Promise<LLMChatDTO>}
 */
export async function startChat({ configId, prefixIdentifier }) {
  if (!configId) {
    throw new ConfigurationNotFoundError('null id provided');
  }
  const configuration = await configurationRepository.get(configId);
  const chatId = generateId(prefixIdentifier);
  const newChat = new Chat({
    id: chatId,
    configurationId: configId,
    messages: [],
  });
  await chatRepository.save(newChat);
  return new LLMChatDTO({
    id: newChat.id,
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
 * @param {string} params.message
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function prompt({ chatId, message }) {
  if (!chatId) {
    throw new ChatNotFoundError('null id provided');
  }
  const chat = await chatRepository.get(chatId);
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

function generateId(prefixIdentifier) {
  const nowMs = new Date().getMilliseconds();
  return `${prefixIdentifier}-${nowMs}`;
}

function getInputMaxCharsFromConfiguration(configuration) {
  return configuration.challenge.inputMaxChars;
}

function getInputMaxPromptsFromConfiguration(configuration) {
  return configuration.challenge.inputMaxPrompts;
}

function addMessagesToChat(chat, prompt, chatRepository) {
  return async (llmMessage) => {
    chat.addUserMessage(prompt);
    chat.addLLMMessage(llmMessage);
    await chatRepository.save(chat);
  };
}
