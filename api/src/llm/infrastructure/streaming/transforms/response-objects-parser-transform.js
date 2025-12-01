export class ResponseObjectsParserStream extends TransformStream {
  /**
   * @param {object} metadata
   * @param {string[]} metadata.messageParts
   * @param {number} metadata.inputTokens
   * @param {number} metadata.outputTokens
   */
  constructor(metadata) {
    super({
      async transform(chunk, controller) {
        if (metadata.errorOccurredDuringStream) return;

        const { error, message, isValid, usage, wasModerated, ping } = chunk;

        if (ping) {
          controller.enqueue({ ping: true });
        }

        if (isValid) {
          metadata.haveVictoryConditionsBeenFulfilled = true;
        }

        if (wasModerated) {
          metadata.wasModerated = true;
        }

        if (message) {
          metadata.messageParts.push(message);
          controller.enqueue({ message });
        }

        if (error) {
          metadata.errorOccurredDuringStream = error;
        }

        if (usage) {
          metadata.inputTokens = usage?.input_tokens ?? metadata.inputTokens;
          metadata.outputTokens = usage?.output_tokens ?? metadata.outputTokens;
        }
      },
    });
  }
}
