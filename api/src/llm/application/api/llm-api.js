import { ChatForbiddenError, NoUserIdProvidedError } from '../../domain/errors.js';
import { usecases } from '../../domain/usecases/index.js';
import { LLMChatDTO } from './models/LLMChatDTO.js';

/**
 * @param {Object} params
 * @param {string} params.configId
 * @param {string} params.userId
 * @returns {Promise<LLMChatDTO>}
 */
export async function startChat({ configId, userId }) {
  if (!userId) {
    throw new NoUserIdProvidedError();
  }
  const { id, configuration } = await usecases.startChat({ configurationId: configId, userId });
  return new LLMChatDTO({
    id,
    attachmentName: configuration.attachmentName,
    inputMaxChars: configuration.inputMaxChars,
    inputMaxPrompts: configuration.inputMaxPrompts,
  });
}

/**
 * @param {Object} params
 * @param {string} params.chatId
 * @param {string} params.userId
 * @param {string|null|undefined} params.message
 * @param {string|null|undefined} params.attachmentName
 * @returns {Promise<module:stream.internal.PassThrough>}
 */
export async function prompt({ chatId, userId, message, attachmentName }) {
  if (!userId) {
    throw new ChatForbiddenError();
  }
  return usecases.promptChat({ chatId, userId, message, attachmentName });
}
