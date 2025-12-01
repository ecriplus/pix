import * as events from './events.js';

export class EventStreamEncoderStream extends TransformStream {
  constructor() {
    super({
      async transform(chunk, controller) {
        const { message, ping } = chunk;

        if (ping) {
          controller.enqueue(events.getPing());
        }

        if (message) {
          controller.enqueue(events.getFormattedMessage(message));
        }
      },
    });
  }
}
