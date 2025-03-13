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

/**
 * @class FlashcardsVersoSeenEvent
 *
 * A FlashcardsVersoSeenEvent is generated when a card's answer is seen and saved in DB.
 */
class FlashcardsVersoSeenEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId, elementId, cardId }) {
    super({ id, type: 'FLASHCARDS_VERSO_SEEN', occurredAt, createdAt, passageId, data: { elementId, cardId } });

    assertNotNullOrUndefined(elementId, 'The elementId is required for a FlashcardsVersoSeenEvent');
    assertNotNullOrUndefined(cardId, 'The cardId is required for a FlashcardsVersoSeenEvent');
    this.elementId = elementId;
    this.cardId = cardId;
  }
}
/**
 * @class FlashcardsRetriedEvent
 *
 * A FlashcardsRetriedEvent is generated when a set of Modulix flashcards is retried and saved in DB.
 */
class FlashcardsRetriedEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId, elementId }) {
    super({ id, type: 'FLASHCARDS_RETRIED', occurredAt, createdAt, passageId, data: { elementId } });

    assertNotNullOrUndefined(elementId, 'The elementId is required for a FlashcardsRetriedEvent');

    this.elementId = elementId;
  }
}

export { FlashcardsRetriedEvent, FlashcardsStartedEvent };
export {
  FlashcardsRetriedEvent,
  FlashcardsStartedEvent,
  FlashcardsVersoSeenEvent,
};
