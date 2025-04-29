import { DomainError, NotFoundError } from '../../../shared/domain/errors.js';
import { PromiseUtils } from '../../../shared/infrastructure/utils/promise-utils.js';
import {
  FlashcardsCardAutoAssessedEvent,
  FlashcardsRectoReviewedEvent,
  FlashcardsRetriedEvent,
  FlashcardsStartedEvent,
  FlashcardsVersoSeenEvent,
} from '../models/passage-events/flashcard-events.js';
import { PassageStartedEvent, PassageTerminatedEvent } from '../models/passage-events/passage-events.js';

const recordPassageEvents = async function ({ events, passageRepository, passageEventRepository }) {
  await PromiseUtils.mapSeries(events, async (event) => {
    try {
      await passageRepository.get({ passageId: event.passageId });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new DomainError(`Passage with id ${event.id} does not exist`);
      }

      throw error;
    }

    const passageEvent = _buildPassageEvent(event);
    await passageEventRepository.record(passageEvent);
  });
};

function _buildPassageEvent(event) {
  switch (event.type) {
    case 'PASSAGE_STARTED':
      return new PassageStartedEvent(event);
    case 'PASSAGE_TERMINATED':
      return new PassageTerminatedEvent(event);
    case 'FLASHCARDS_STARTED':
      return new FlashcardsStartedEvent(event);
    case 'FLASHCARDS_VERSO_SEEN':
      return new FlashcardsVersoSeenEvent(event);
    case 'FLASHCARDS_CARD_AUTO_ASSESSED':
      return new FlashcardsCardAutoAssessedEvent(event);
    case 'FLASHCARDS_RECTO_REVIEWED':
      return new FlashcardsRectoReviewedEvent(event);
    case 'FLASHCARDS_RETRIED':
      return new FlashcardsRetriedEvent(event);
    default:
      throw new DomainError(`Passage event with type ${event.type} does not exist`);
  }
}

export { recordPassageEvents };
