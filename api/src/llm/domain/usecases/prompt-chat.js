import {
  ChatForbiddenError,
  ChatNotFoundError,
  MaxPromptsReachedError,
  NoAttachmentNeededError,
  NoAttachmentNorMessageProvidedError,
  PromptAlreadyOngoingError,
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
  redisMutex,
}) {
  if (!chatId) {
    throw new ChatNotFoundError('null id provided');
  }

  try {
    const locked = await redisMutex.lock(chatId);
    if (!locked) {
      throw new PromptAlreadyOngoingError(chatId);
    }
    const hasAnAttachmentBeenProvided = !!attachmentName;
    const hasAMessageBeenProvided = !!message;
    if (!hasAnAttachmentBeenProvided && !hasAMessageBeenProvided) {
      throw new NoAttachmentNorMessageProvidedError();
    }

    const chat = await chatRepository.get(chatId);

    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }

    if (chat.userId != undefined && userId !== chat.userId) {
      throw new ChatForbiddenError();
    }

    const { configuration } = chat;
    if (hasAnAttachmentBeenProvided && !configuration.hasAttachment) {
      throw new NoAttachmentNeededError();
    }
    let attachmentMessageType;
    let isAttachmentValid;
    if (hasAnAttachmentBeenProvided) {
      isAttachmentValid = chat.addAttachmentContextMessages(attachmentName, message);
      attachmentMessageType = isAttachmentValid
        ? toEventStream.ATTACHMENT_MESSAGE_TYPES.IS_VALID
        : toEventStream.ATTACHMENT_MESSAGE_TYPES.IS_INVALID;
    } else {
      attachmentMessageType = toEventStream.ATTACHMENT_MESSAGE_TYPES.NONE;
    }
    let readableStream = null;
    // As long as the attachment context has been added to the chat, if we receive other attachments valid or invalid later on we must
    // forward the message to the LLM anyway
    const shouldSendMessageToLLM =
      !hasAnAttachmentBeenProvided || (hasAnAttachmentBeenProvided && chat.hasAttachmentContextBeenAdded);
    if (hasAMessageBeenProvided) {
      if (message.length > configuration.inputMaxChars) {
        throw new TooLargeMessageInputError();
      }

      if (chat.currentPromptsCount >= configuration.inputMaxPrompts) {
        throw new MaxPromptsReachedError();
      }

      if (shouldSendMessageToLLM) {
        readableStream = await promptRepository.prompt({
          message,
          chat,
        });
      }
    }

    return toEventStream.fromLLMResponse({
      llmResponse: readableStream,
      onStreamDone: finalize(chat, message, shouldSendMessageToLLM, chatRepository, redisMutex),
      attachmentMessageType,
      shouldSendDebugData: chat.isPreview,
      prompt: message,
    });
  } catch (error) {
    await redisMutex.release(chatId);
    throw error;
  }
}

/**
 * @function
 * @name finalize
 *
 * @param {Chat} chat
 * @param {string} message
 * @param {boolean} hasJustBeenSentToLLM
 * @param {Object} chatRepository
 * @param {Object} redisMutex
 * @returns {(streamCapture: StreamCapture, hasStreamSucceeded: boolean) => Promise<void>}
 */
function finalize(chat, message, hasJustBeenSentToLLM, chatRepository, redisMutex) {
  return async (streamCapture, hasStreamSucceeded) => {
    if (hasStreamSucceeded) {
      const hasErrorOccurredDuringStream = !!streamCapture.errorOccurredDuringStream;
      const shouldBeCountedAsAPrompt = hasJustBeenSentToLLM && !hasErrorOccurredDuringStream;
      const shouldBeForwardedToLLM =
        hasJustBeenSentToLLM && !streamCapture.wasModerated && !hasErrorOccurredDuringStream;
      chat.addUserMessage(
        message,
        shouldBeCountedAsAPrompt,
        shouldBeForwardedToLLM,
        streamCapture.haveVictoryConditionsBeenFulfilled,
        streamCapture.wasModerated,
      );
      chat.addLLMMessage(
        streamCapture.LLMMessageParts.join(''),
        !hasErrorOccurredDuringStream,
        hasErrorOccurredDuringStream,
      );
      chat.updateTokenConsumption(streamCapture.inputTokens, streamCapture.outputTokens);
      await chatRepository.save(chat);
    }

    await redisMutex.release(chat.id);
  };
}
