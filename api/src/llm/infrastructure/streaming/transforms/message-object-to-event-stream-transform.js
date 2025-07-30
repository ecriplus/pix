import { Transform } from 'node:stream';

/**
 * @param {StreamCapture} streamCapture Structure that will hold state, such as the accumulated LLM response
 * @returns {module:stream.internal.Transform}
 */
export function getTransform(streamCapture) {
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const { message, isValid, usage } = chunk;
      let data = '';

      if (isValid) {
        data += getVictoryConditionsSuccessEvent();
        streamCapture.haveVictoryConditionsBeenFulfilled = true;
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
