import { Readable } from 'node:stream';

import { ChatForbiddenError, NoUserIdProvidedError } from '../../domain/errors.js';
import { usecases } from '../../domain/usecases/index.js';
import { LLMResponseHandler } from '../../infrastructure/streaming/llm-response-handler.js';
import { LLMChatDTO } from './models/LLMChatDTO.js';

/**
 * @param {Object} params
 * @param {string} params.configId
 * @param {string} params.userId
 * @param {string|undefined} params.challengeId
 * @param {number|undefined} params.assessmentId
 * @param {string|undefined} params.moduleId
 * @param {number|undefined} params.passageId
 * @returns {Promise<LLMChatDTO>}
 */
export async function startChat({ configId, userId, challengeId, assessmentId, moduleId, passageId }) {
  if (!userId) {
    throw new NoUserIdProvidedError();
  }
  const { id, configuration } = await usecases.startChat({
    configurationId: configId,
    userId,
    challengeId,
    assessmentId,
    moduleId,
    passageId,
  });

  return new LLMChatDTO({
    id,
    attachmentName: configuration.attachmentName,
    inputMaxChars: configuration.inputMaxChars,
    inputMaxPrompts: configuration.inputMaxPrompts,
    hasVictoryConditions: configuration.hasVictoryConditions,
    context: configuration.context,
  });
}

/**
 * @param {Object} params
 * @param {string} params.chatId
 * @param {string} params.userId
 * @param {string|null|undefined} params.message
 * @param {string|null|undefined} params.attachmentName
 * @returns {Promise<Readable>}
 */
export async function prompt({ chatId, userId, message, attachmentName }) {
  if (!userId) {
    throw new ChatForbiddenError();
  }
  const responseStream = new TransformStream();
  const llmResponseHandler = new LLMResponseHandler(responseStream.writable);
  await usecases.promptChat({ chatId, userId, message, attachmentName, llmResponseHandler });
  return Readable.fromWeb(responseStream.readable);
}
