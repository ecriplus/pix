import { Transform } from 'node:stream';

/**
 * @param {StreamCapture} streamCapture Structure that will hold state, such as the accumulated LLM response
 * @returns {module:stream.internal.Transform}
 */
export function getTransform(streamCapture) {
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const { message, isValid, usage, wasModerated } = chunk;
      let data = '';

      if (isValid) {
        streamCapture.haveVictoryConditionsBeenFulfilled = true;
        data += getVictoryConditionsSuccessEvent();
      }

      if (wasModerated) {
        streamCapture.wasModerated = true;
        data += getMessageModeratedEvent();
      }

      if (message) {
        streamCapture.LLMMessageParts.push(...message.split(''));
        data += getFormattedMessage(message);
      }

      if (usage) {
        streamCapture.inputTokens = usage?.inputTokens ?? streamCapture.inputTokens;
        streamCapture.outputTokens = usage?.outputTokens ?? streamCapture.outputTokens;
      }

      if (data) callback(null, data);
      else callback();
    },
  });
}

function getFormattedMessage(message) {
  const formattedMessage = message.replaceAll('\n', '\ndata: ');
  return `data: ${formattedMessage}\n\n`;
}

function getVictoryConditionsSuccessEvent() {
  return 'event: victory-conditions-success\ndata: \n\n';
}

function getMessageModeratedEvent() {
  return 'event: user-message-moderated\ndata: \n\n';
}
