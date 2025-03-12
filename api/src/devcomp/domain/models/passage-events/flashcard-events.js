import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEvent } from './PassageEvent.js';

/**
 * @class FlashcardsStartedEvent
 *
 * A FlashcardsStartedEvent is generated when a set of Modulix flashcards is started and saved in DB.
 */
class FlashcardsStartedEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId, elementId }) {
    super({ id, type: 'FLASHCARDS_STARTED', occurredAt, createdAt, passageId, data: { elementId } });

    assertNotNullOrUndefined(elementId, 'The elementId is required for a FlashcardsStartedEvent');

    this.elementId = elementId;
  }
}

export { FlashcardsStartedEvent };
