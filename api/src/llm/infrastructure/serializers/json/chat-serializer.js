import { Message } from '../../../domain/models/Chat.js';

/**
 * @param {import('../../../domain/models/Chat').Chat} chat
 */
export function serialize(chat) {
  let messagesForPreview = chat.messages.filter(({ shouldBeRenderedInPreview }) => shouldBeRenderedInPreview);

  let i = 0;

  while (i < messagesForPreview.length - 1) {
    const current = messagesForPreview[i];
    const next = messagesForPreview[i + 1];

    if (current.hasAttachmentBeenSubmittedAlongWithAPrompt) {
      const mergedMessage = new Message({
        content: next.content,
        attachmentName: current.attachmentName,
        isFromUser: true,
        haveVictoryConditionsBeenFulfilled: next.haveVictoryConditionsBeenFulfilled,
        wasModerated: next.wasModerated,
      });

      messagesForPreview = messagesForPreview.toSpliced(i, 2, mergedMessage);
    } else {
      i++;
    }
  }

  return {
    id: chat.id,
    inputMaxChars: chat.configuration.inputMaxChars,
    inputMaxPrompts: chat.configuration.inputMaxPrompts,
    attachmentName: chat.configuration.attachmentName,
    context: chat.configuration.context,
    totalInputTokens: chat.totalInputTokens,
    totalOutputTokens: chat.totalOutputTokens,
    hasVictoryConditions: chat.hasVictoryConditions,
    messages: messagesForPreview.map(
      ({
        content,
        attachmentName,
        isFromUser,
        haveVictoryConditionsBeenFulfilled,
        wasModerated,
        hasErrorOccurred,
      }) => ({
        content,
        attachmentName,
        isFromUser,
        haveVictoryConditionsBeenFulfilled,
        wasModerated,
        hasErrorOccurred,
        isAttachmentValid: Boolean(attachmentName && chat.isAttachmentValid(attachmentName)),
      }),
    ),
  };
}
