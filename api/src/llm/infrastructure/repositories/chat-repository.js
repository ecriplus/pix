import { config } from '../../../shared/config.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';
import { ChatNotFoundError } from '../../domain/errors.js';
import { Chat, Message } from '../../domain/models/Chat.js';

export const CHAT_STORAGE_PREFIX = 'llm-chats';
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
  const chatDTO = await chatsTemporaryStorage.get(id);
  if (!chatDTO) {
    throw new ChatNotFoundError(id);
  }
  const messages = chatDTO.messages.map((messageDTO) => new Message(messageDTO));
  return new Chat({
    ...chatDTO,
    messages,
  });
}
