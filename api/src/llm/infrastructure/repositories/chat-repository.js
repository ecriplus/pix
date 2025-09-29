import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { Chat } from '../../domain/models/Chat.js';

/**
 * @typedef {import('../../domain/models/Chat').Message} Message
 */

/**
 * @function
 * @name get
 *
 * @param {UUID} chatId
 * @returns {Promise<Chat|null>}
 */
export async function get(chatId) {
  const knexConn = DomainTransaction.getConnection();
  const chatDTO = await knexConn('chats').where({ id: chatId }).first();
  if (!chatDTO) return null;
  const messageDTOs = await knexConn('chat_messages').where({ chatId });
  return toDomain({
    ...chatDTO,
    configurationId: chatDTO.configId,
    configuration: chatDTO.configContent,
    messages: messageDTOs,
  });
}

/**
 * @function
 * @name save
 *
 * @param {Chat} chat
 * @returns {Promise<void>}
 */
export async function save(chat) {
  const knexConn = DomainTransaction.getConnection();
  const chatDTO = chat.toDTO();
  const {
    id: chatId,
    assessmentId,
    challengeId,
    configurationId: configId,
    configuration: configContent,
    moduleId,
    passageId,
    hasAttachmentContextBeenAdded,
    totalInputTokens,
    totalOutputTokens,
  } = chatDTO;
  const startedAt = new Date();
  const updatedAt = new Date();

  await knexConn('chats')
    .insert({
      id: chatId,
      assessmentId,
      challengeId,
      configContent,
      configId,
      hasAttachmentContextBeenAdded,
      moduleId,
      passageId,
      startedAt,
      totalInputTokens,
      totalOutputTokens,
      updatedAt,
    })
    .onConflict(['id'])
    .merge(['hasAttachmentContextBeenAdded', 'totalInputTokens', 'totalOutputTokens', 'updatedAt']);

  for (const message of chatDTO.messages) {
    const databaseMessage = _buildDatabaseMessage({ chatId, message });
    await knexConn('chat_messages').insert(databaseMessage).onConflict(['chatId', 'index']).ignore();
  }
}

/**
 * @function
 * @name save
 *
 * @param {Object} params
 * @param {string} params.chatId chatId
 * @param {Message} params.message message
 * @returns {Promise<void>}
 */
function _buildDatabaseMessage({ chatId, message }) {
  const {
    index,
    attachmentName,
    attachmentContext,
    content,
    hasAttachmentBeenSubmittedAlongWithAPrompt,
    hasErrorOccurred,
    haveVictoryConditionsBeenFulfilled,
    isFromUser,
    shouldBeCountedAsAPrompt,
    shouldBeRenderedInPreview,
    shouldBeForwardedToLLM,
    wasModerated,
  } = message;

  return {
    attachmentName,
    attachmentContext,
    chatId,
    content,
    emitter: isFromUser ? 'user' : 'assistant',
    hasAttachmentBeenSubmittedAlongWithAPrompt,
    hasErrorOccurred: hasErrorOccurred ?? null,
    haveVictoryConditionsBeenFulfilled,
    index,
    shouldBeForwardedToLLM,
    shouldBeRenderedInPreview,
    shouldBeCountedAsPrompt: shouldBeCountedAsAPrompt,
    wasModerated: wasModerated ?? null,
  };
}

function toDomain(chatDTO) {
  return Chat.fromDTO(chatDTO);
}
