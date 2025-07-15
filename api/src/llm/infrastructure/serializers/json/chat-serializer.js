import { Message } from '../../../domain/models/Chat.js';

/**
 * @param {import('../../../domain/models/Chat').Chat} chat
 */
export function serialize({ id, configuration: { inputMaxChars, inputMaxPrompts, attachmentName }, messages }) {
  messages = messages.filter(({ isAttachmentContent }) => !isAttachmentContent);

  const notCountedAttachmentIndex = messages.findIndex(({ isAttachment, notCounted }) => isAttachment && notCounted);
  if (notCountedAttachmentIndex !== -1) {
    messages = messages.toSpliced(
      notCountedAttachmentIndex,
      2,
      new Message({
        content: messages[notCountedAttachmentIndex + 1].content,
        attachmentName: messages[notCountedAttachmentIndex].attachmentName,
        isFromUser: true,
      }),
    );
  }

  return {
    id,
    inputMaxChars,
    inputMaxPrompts,
    attachmentName,
    messages: messages.map(({ content, attachmentName, isFromUser }) => ({
      content,
      attachmentName,
      isFromUser,
    })),
  };
}
