import {
  ChatForbiddenError,
  ChatNotFoundError,
  MaxPromptsReachedError,
  NoAttachmentNeededError,
  NoAttachmentNorMessageProvidedError,
  TooLargeMessageInputError,
} from '../errors.js';

export async function promptChat({
  chatId,
  userId,
  message,
  attachmentName,
  chatRepository,
  promptRepository,
  toEventStream,
}) {
  if (!chatId) {
    throw new ChatNotFoundError('null id provided');
  }
  if (!attachmentName && !message) {
    throw new NoAttachmentNorMessageProvidedError();
  }

  const chat = await chatRepository.get(chatId);
  if (chat.userId != undefined && userId !== chat.userId) {
    throw new ChatForbiddenError();
  }

  const { configuration } = chat;
  if (attachmentName && !configuration.hasAttachment) {
    throw new NoAttachmentNeededError();
  }
  let attachmentMessageType;
  let isAttachmentValid;
  if (attachmentName) {
    isAttachmentValid = chat.addAttachmentContextMessages(attachmentName, message);
    attachmentMessageType = isAttachmentValid
      ? toEventStream.ATTACHMENT_MESSAGE_TYPES.IS_VALID
      : toEventStream.ATTACHMENT_MESSAGE_TYPES.IS_INVALID;
  } else {
    attachmentMessageType = toEventStream.ATTACHMENT_MESSAGE_TYPES.NONE;
  }
  let readableStream = null;
  const shouldBeForwardedToLLM = !attachmentName || (attachmentName && chat.hasAttachmentContextBeenAdded);
  if (message) {
    if (message.length > configuration.inputMaxChars) {
      throw new TooLargeMessageInputError();
    }

    if (chat.currentPromptsCount >= configuration.inputMaxPrompts) {
      throw new MaxPromptsReachedError();
    }

    if (shouldBeForwardedToLLM) {
      readableStream = await promptRepository.prompt({
        message,
        chat,
      });
    }
  }

  return toEventStream.fromLLMResponse({
    llmResponse: readableStream,
    onStreamDone: addMessagesToChat(chat, message, shouldBeForwardedToLLM, chatRepository),
    attachmentMessageType,
  });
}

function addMessagesToChat(chat, prompt, shouldBeForwardedToLLM, chatRepository) {
  return async (llmMessage) => {
    chat.addUserMessage(prompt, shouldBeForwardedToLLM);
    chat.addLLMMessage(llmMessage);
    await chatRepository.save(chat);
  };
}
