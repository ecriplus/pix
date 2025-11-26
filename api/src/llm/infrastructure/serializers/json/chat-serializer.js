/**
 * @param {import('../../../domain/models/Chat.js').Chat} chat
 */
export function serialize(chat) {
  return {
    id: chat.id,
    inputMaxChars: chat.configuration.inputMaxChars,
    inputMaxPrompts: chat.configuration.inputMaxPrompts,
    attachmentName: chat.configuration.attachmentName,
    context: chat.configuration.context,
    totalInputTokens: chat.totalInputTokens,
    totalOutputTokens: chat.totalOutputTokens,
    hasVictoryConditions: chat.hasVictoryConditions,
    haveVictoryConditionsBeenFulfilled: chat.haveVictoryConditionsBeenFulfilled,
    messages: chat.messages.map(({ content, attachmentName, emitter, wasModerated }) => ({
      content,
      attachmentName,
      isFromUser: emitter === 'user',
      wasModerated,
      isAttachmentValid: chat.isAttachmentValid(attachmentName),
    })),
  };
}
