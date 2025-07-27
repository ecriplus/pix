import { Transform } from 'node:stream';

/**
 * @typedef {Object} StreamCapture
 * @property {string[]} LLMMessageParts - Accumulated message chunks.
 * @property {boolean=} haveVictoryConditionsBeenFulfilled - Whether victory conditions were fulfilled during this exchange or not
 */

/**
 * @param {StreamCapture} streamCapture Structure that will hold state, such as the accumulated LLM response
 * @returns {module:stream.internal.Transform}
 */
export function getTransform(streamCapture) {
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const { message, isValid } = chunk;
      let data = '';

      if (isValid) {
        data += 'event: victory-conditions-success\ndata: \n\n';
        streamCapture.haveVictoryConditionsBeenFulfilled = true;
      }

      if (message) {
        streamCapture.LLMMessageParts.push(...message.split(''));
        data += toEventStreamData(message);
      }

      if (data) callback(null, data);
      else callback();
    },
  });
}

function toEventStreamData(message) {
  const formattedMessage = message.replaceAll('\n', '\ndata: ');
  return `data: ${formattedMessage}\n\n`;
}
