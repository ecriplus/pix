import { PassageEvent } from './PassageEvent.js';

/**
 * @class PassageTerminatedEvent
 *
 * A PassageTerminatedEvent is generated when a Modulix passage is terminated and saved in DB.
 */
class PassageTerminatedEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId }) {
    super({ id, type: 'PASSAGE_TERMINATED', occurredAt, createdAt, passageId });
  }
}

export { PassageTerminatedEvent };
