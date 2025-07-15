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
  if (attachmentName && attachmentName === configuration.attachmentName) {
    chat.addAttachmentContextMessages(configuration.attachmentName, configuration.attachmentContext, !!message);
  }
  let readableStream = null;
  if (message) {
    if (message.length > configuration.inputMaxChars) {
      throw new TooLargeMessageInputError();
    }

    if (chat.currentPromptsCount >= configuration.inputMaxPrompts) {
      throw new MaxPromptsReachedError();
    }

    readableStream = await promptRepository.prompt({
      message,
      chat,
    });
  }

  return toEventStream.fromLLMResponse({
    llmResponse: readableStream,
    onLLMResponseReceived: addMessagesToChat(chat, message, chatRepository),
    shouldSendAttachmentEventMessage: Boolean(attachmentName),
  });
}

function addMessagesToChat(chat, prompt, chatRepository) {
  return async (llmMessage) => {
    chat.addUserMessage(prompt);
    chat.addLLMMessage(llmMessage);
    await chatRepository.save(chat);
  };
}
