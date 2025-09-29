import { databaseBuffer } from '../database-buffer.js';
import { buildChat } from './build-chat.js';

const TABLE_NAME = 'chat_messages';

const buildChatMessage = function ({
  id = databaseBuffer.getNextId(),
  attachmentName = 'attachmentName',
  attachmentContext = 'attachmentContext',
  chatId,
  content = 'Contenu du message',
  emitter = 'user',
  hasAttachmentBeenSubmittedAlongWithAPrompt = false,
  hasErrorOccurred = null,
  haveVictoryConditionsBeenFulfilled = false,
  index = 0,
  shouldBeForwardedToLLM = true,
  shouldBeRenderedInPreview = false,
  shouldBeCountedAsAPrompt = false,
  wasModerated = false,
  createdAt = new Date(),
} = {}) {
  if (!chatId) {
    chatId = buildChat().id;
  }

  const values = {
    id,
    attachmentName,
    attachmentContext,
    chatId,
    content,
    emitter,
    hasAttachmentBeenSubmittedAlongWithAPrompt,
    hasErrorOccurred,
    haveVictoryConditionsBeenFulfilled,
    index,
    shouldBeForwardedToLLM,
    shouldBeRenderedInPreview,
    shouldBeCountedAsAPrompt,
    wasModerated,
    createdAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: TABLE_NAME,
    values,
  });
};

export { buildChatMessage };
