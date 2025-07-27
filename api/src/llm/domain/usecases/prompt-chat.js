import {
  ChatForbiddenError,
  ChatNotFoundError,
  MaxPromptsReachedError,
  NoAttachmentNeededError,
  NoAttachmentNorMessageProvidedError,
  TooLargeMessageInputError,
} from '../errors.js';

/**
 * @typedef {Object} StreamCapture
 * @property {string[]} LLMMessageParts - Accumulated message chunks.
 * @property {boolean=} haveVictoryConditionsBeenFulfilled - Whether victory conditions were fulfilled during this exchange or not
 */

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

/**
 * @function
 * @name addMessagesToChat
 *
 * @param {Chat} chat
 * @param {string} prompt
 * @param {boolean} shouldBeForwardedToLLM
 * @param {Object} chatRepository
 * @returns {(streamCapture: StreamCapture) => Promise<void>}
 */
function addMessagesToChat(chat, prompt, shouldBeForwardedToLLM, chatRepository) {
  return async (streamCapture) => {
    chat.addUserMessage(prompt, shouldBeForwardedToLLM, streamCapture.haveVictoryConditionsBeenFulfilled);
    chat.addLLMMessage(streamCapture.LLMMessageParts.join(''));
    await chatRepository.save(chat);
  };
}
