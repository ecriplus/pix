import { DomainError } from '../../../shared/domain/errors.js';
import {
  FlashcardsCardAutoAssessedEvent,
  FlashcardsRectoReviewedEvent,
  FlashcardsRetriedEvent,
  FlashcardsStartedEvent,
  FlashcardsVersoSeenEvent,
} from '../models/passage-events/flashcard-events.js';
import { PassageStartedEvent, PassageTerminatedEvent } from '../models/passage-events/passage-events.js';

class PassageEventFactory {
  static build(eventData) {
    switch (eventData.type) {
      case 'PASSAGE_STARTED':
        return new PassageStartedEvent(eventData);
      case 'PASSAGE_TERMINATED':
        return new PassageTerminatedEvent(eventData);
      case 'FLASHCARDS_STARTED':
        return new FlashcardsStartedEvent(eventData);
      case 'FLASHCARDS_VERSO_SEEN':
        return new FlashcardsVersoSeenEvent(eventData);
      case 'FLASHCARDS_CARD_AUTO_ASSESSED':
        return new FlashcardsCardAutoAssessedEvent(eventData);
      case 'FLASHCARDS_RECTO_REVIEWED':
        return new FlashcardsRectoReviewedEvent(eventData);
      case 'FLASHCARDS_RETRIED':
        return new FlashcardsRetriedEvent(eventData);
      default:
        throw new DomainError(`Passage event with type ${eventData.type} does not exist`);
    }
  }
}

export { PassageEventFactory };
