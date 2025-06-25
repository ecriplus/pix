import { DomainError } from '../../../shared/domain/errors.js';
import { QCUDeclarativeAnsweredEvent } from '../models/passage-events/answerable-element-events.js';
import {
  FlashcardsCardAutoAssessedEvent,
  FlashcardsRectoReviewedEvent,
  FlashcardsRetriedEvent,
  FlashcardsStartedEvent,
  FlashcardsVersoSeenEvent,
} from '../models/passage-events/flashcard-events.js';
import { GrainContinuedEvent, GrainSkippedEvent } from '../models/passage-events/grain-events.js';
import { PassageStartedEvent, PassageTerminatedEvent } from '../models/passage-events/passage-events.js';
import { QABCardAnsweredEvent, QABCardRetriedEvent } from '../models/passage-events/qab-events.js';

class PassageEventFactory {
  static build(eventData) {
    switch (eventData.type) {
      case 'FLASHCARDS_CARD_AUTO_ASSESSED':
        return new FlashcardsCardAutoAssessedEvent(eventData);
      case 'FLASHCARDS_RECTO_REVIEWED':
        return new FlashcardsRectoReviewedEvent(eventData);
      case 'FLASHCARDS_RETRIED':
        return new FlashcardsRetriedEvent(eventData);
      case 'FLASHCARDS_STARTED':
        return new FlashcardsStartedEvent(eventData);
      case 'FLASHCARDS_VERSO_SEEN':
        return new FlashcardsVersoSeenEvent(eventData);
      case 'GRAIN_CONTINUED':
        return new GrainContinuedEvent(eventData);
      case 'GRAIN_SKIPPED':
        return new GrainSkippedEvent(eventData);
      case 'PASSAGE_STARTED':
        return new PassageStartedEvent(eventData);
      case 'PASSAGE_TERMINATED':
        return new PassageTerminatedEvent(eventData);
      case 'QAB_CARD_ANSWERED':
        return new QABCardAnsweredEvent(eventData);
      case 'QAB_CARD_RETRIED':
        return new QABCardRetriedEvent(eventData);
      case 'QCU_DECLARATIVE_ANSWERED':
        return new QCUDeclarativeAnsweredEvent(eventData);
      default:
        throw new DomainError(`Passage event with type ${eventData.type} does not exist`);
    }
  }
}

export { PassageEventFactory };
