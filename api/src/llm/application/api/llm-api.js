import { config } from '../../../shared/config.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';
import { ConfigurationNotFoundError } from '../../domain/errors.js';
import { LLMChat } from '../../domain/models/LLMChat.js';
import * as configurationRepository from '../../infrastructure/repositories/configuration-repository.js';
import { LLMChatDTO } from './models/LLMChatDTO.js';
import { LLMChatResponseDTO } from './models/LLMChatResponseDTO.js';

export const STORAGE_PREFIX = 'llm-chats';
const llmChatsTemporaryStorage = temporaryStorage.withPrefix(STORAGE_PREFIX);

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
  const newChat = new LLMChat({
    id: chatId,
    llmConfigurationId: configId,
    historySize: configuration.llm.historySize,
    inputMaxChars: configuration.challenge.inputMaxChars,
    inputMaxPrompts: configuration.challenge.inputMaxPrompts,
  });
  await llmChatsTemporaryStorage.save({
    key: newChat.id,
    value: newChat.toDTO(),
    expirationDelaySeconds: config.llm.temporaryStorage.expirationDelaySeconds,
  });
  return new LLMChatDTO({
    id: newChat.id,
    inputMaxChars: newChat.inputMaxChars,
    inputMaxPrompts: newChat.inputMaxPrompts,
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
 * @returns {Promise<LLMChatResponseDTO>}
 */
export async function prompt({ chatId, message }) {
  return new LLMChatResponseDTO({ message: `${message} BIEN RECU dans chat ${chatId}` });
}

function generateId(prefixIdentifier) {
  const nowMs = new Date().getMilliseconds();
  return `${prefixIdentifier}-${nowMs}`;
}
