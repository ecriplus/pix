import { Transform } from 'node:stream';

/**
 * @param {Array<string>} llmMessageAccumulator Array of characters that will hold the complete LLM response. Using an array so we can pass around the reference.
 * @returns {module:stream.internal.Transform}
 */
export function getTransform(llmMessageAccumulator) {
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const { message, isValid } = chunk;
      let data = '';

      if (isValid) {
        data += 'event: victory-conditions-success\ndata: \n\n';
      }

      if (message) {
        llmMessageAccumulator.push(...message.split(''));
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
