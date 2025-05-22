import { config } from '../../../shared/config.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';

export const CHAT_STORAGE_PREFIX = 'llm-chats';
const chatsTemporaryStorage = temporaryStorage.withPrefix(CHAT_STORAGE_PREFIX);

export async function save(chat) {
  await chatsTemporaryStorage.save({
    key: chat.id,
    value: chat.toDTO(),
    expirationDelaySeconds: config.llm.temporaryStorage.expirationDelaySeconds,
  });
}
