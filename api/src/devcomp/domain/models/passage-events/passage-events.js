import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEvent } from './PassageEvent.js';

/**
 * @class PassageStartedEvent
 *
 * A PassageStartedEvent is generated when a Modulix passage is started and saved in DB.
 */
class PassageStartedEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, contentHash }) {
    super({ id, type: 'PASSAGE_STARTED', occurredAt, createdAt, passageId, sequenceNumber, data: { contentHash } });

    assertNotNullOrUndefined(contentHash, 'The contentHash is required for a PassageStartedEvent');

    this.contentHash = contentHash;
  }
}

/**
 * @class PassageTerminatedEvent
 *
 * A PassageTerminatedEvent is generated when a Modulix passage is terminated and saved in DB.
 */
class PassageTerminatedEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber }) {
    super({ id, type: 'PASSAGE_TERMINATED', occurredAt, createdAt, passageId, sequenceNumber });
  }
}

export { PassageStartedEvent, PassageTerminatedEvent };
