import { config } from '../../../shared/config.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';
import { child, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { LLMChat } from '../../domain/models/LLMChat.js';
import { LLMChatDTO } from './models/LLMChatDTO.js';

export const STORAGE_PREFIX = 'llm-chats';
const llmChatsTemporaryStorage = temporaryStorage.withPrefix(STORAGE_PREFIX);

const logger = child('llm:api', { event: SCOPES.LEARNING_CONTENT });

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
    return null;
  }
  const chatId = generateId(prefixIdentifier);
  const llmConfiguration = await getLLMConfiguration(configId);
  if (!llmConfiguration) {
    return null;
  }

  const newChat = new LLMChat({
    id: chatId,
    llmConfigurationId: configId,
    historySize: llmConfiguration.llm.historySize,
    inputMaxChars: llmConfiguration.challenge.inputMaxChars,
    inputMaxPrompts: llmConfiguration.challenge.inputMaxPrompts,
  });
  await llmChatsTemporaryStorage.save({
    key: newChat.id,
    value: newChat.toDTO(),
    expirationDelaySeconds: config.llm.temporaryStorage.expirationDelaySeconds,
  });
  return toApi(newChat);
}

function generateId(prefixIdentifier) {
  const nowMs = new Date().getMilliseconds();
  return `${prefixIdentifier}-${nowMs}`;
}

async function getLLMConfiguration(configId) {
  const url = config.llm.getConfigurationUrl + '/' + configId;
  const response = await fetch(url);
  const statusCode = parseInt(response.status);
  const jsonResponse = response.body ? await response.json() : '';
  if (statusCode === 200) {
    return jsonResponse;
  }
  if (statusCode === 404) {
    logger.error(`No config found for id ${configId}`);
    return null;
  }
  logger.error(`code (${statusCode}): ${JSON.stringify(jsonResponse, undefined, 2)}}`);
  return null;
}

function toApi(llmChat) {
  return new LLMChatDTO({
    id: llmChat.id,
    inputMaxChars: llmChat.inputMaxChars,
    inputMaxPrompts: llmChat.inputMaxPrompts,
  });
}
