import { config } from '../../../shared/config.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';
import { ChatNotFoundError } from '../../domain/errors.js';
import { Chat } from '../../domain/models/Chat.js';
import * as configurationRepository from './configuration-repository.js';

export const OLD_CHAT_STORAGE_PREFIX = 'llm-chats';
const oldChatsTemporaryStorage = temporaryStorage.withPrefix(OLD_CHAT_STORAGE_PREFIX);
export const CHAT_STORAGE_PREFIX = 'llm-chats:';
const chatsTemporaryStorage = temporaryStorage.withPrefix(CHAT_STORAGE_PREFIX);

/**
 * @typedef {import('../../domain/Chat').Chat} Chat
 */

/**
 * @function
 * @name save
 *
 * @param {Chat} chat
 * @returns {Promise<void>}
 */
export async function save(chat) {
  await chatsTemporaryStorage.save({
    key: chat.id,
    value: chat.toDTO(),
    expirationDelaySeconds: config.llm.temporaryStorage.expirationDelaySeconds,
  });
}

/**
 * @function
 * @name get
 *
 * @param {string} id
 * @returns {Promise<Chat>}
 */
export async function get(id) {
  let chatDTO = await chatsTemporaryStorage.get(id);
  // backward compatibility, may be removed after some time
  if (!chatDTO) {
    chatDTO = await oldChatsTemporaryStorage.get(id);
  }
  if (!chatDTO) {
    throw new ChatNotFoundError(id);
  }
  // backward compatibility, may be removed after some time
  if (!chatDTO.configuration) {
    chatDTO.configuration = await configurationRepository.get(chatDTO.configurationId);
  }
  return Chat.fromDTO(chatDTO);
}
