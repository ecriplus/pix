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

const recordPassageEvents = async function ({ events, userId, passageRepository, passageEventRepository }) {
  await PromiseUtils.mapSeries(events, async (event) => {
    const passageEvent = _buildPassageEvent(event);
    await _validatePassage({ event, userId, passageRepository });
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

async function _validatePassage({ event, userId, passageRepository }) {
  try {
    const passage = await passageRepository.get({ passageId: event.passageId });
    if (passage.terminatedAt != null) {
      throw new DomainError(`Passage with id ${event.id} is terminated.`);
    }

    if (userId === null && passage.userId !== null) {
      throw new DomainError(
        `Anonymous user cannot record event for passage with id ${passage.id} that belongs to a user`,
      );
    }

    if (userId && userId !== passage.userId) {
      throw new DomainError('Wrong userId');
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new DomainError(`Passage with id ${event.id} does not exist`);
    }

    throw error;
  }
}

export { recordPassageEvents };
