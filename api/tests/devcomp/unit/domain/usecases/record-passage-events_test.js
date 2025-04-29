import { Passage } from '../../../../../src/devcomp/domain/models/Passage.js';
import {
  FlashcardsCardAutoAssessedEvent,
  FlashcardsRectoReviewedEvent,
  FlashcardsRetriedEvent,
  FlashcardsStartedEvent,
  FlashcardsVersoSeenEvent,
} from '../../../../../src/devcomp/domain/models/passage-events/flashcard-events.js';
import {
  PassageStartedEvent,
  PassageTerminatedEvent,
} from '../../../../../src/devcomp/domain/models/passage-events/passage-events.js';
import { recordPassageEvents } from '../../../../../src/devcomp/domain/usecases/record-passage-events.js';
import { DomainError, NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Devcomp | Domain | UseCases | record-passage-events', function () {
  it('should call passage event repository to create the events', async function () {
    // given
    const flashcardsVersoSeenEvent = {
      occurredAt: new Date(),
      passageId: 2,
      sequenceNumber: 1,
      elementId: '5ad40bc9-8b5c-47ee-b893-f8ab1a1b8095',
      cardId: 'c4675f66-97f1-4202-8aeb-0388edf102d5',
      type: 'FLASHCARDS_VERSO_SEEN',
    };

    const flashcardsStartedEvent = {
      occurredAt: new Date(),
      passageId: 2,
      sequenceNumber: 1,
      elementId: '5ad40bc9-8b5c-47ee-b893-f8ab1a1b8095',
      type: 'FLASHCARDS_STARTED',
    };

    const flashcardsCardAutoAssessedEvent = {
      occurredAt: new Date(),
      passageId: 2,
      sequenceNumber: 1,
      elementId: '5ad40bc9-8b5c-47ee-b893-f8ab1a1b8095',
      cardId: 'c4675f66-97f1-4202-8aeb-0388edf102d5',
      type: 'FLASHCARDS_CARD_AUTO_ASSESSED',
      autoAssessment: 'yes',
    };

    const flashcardsRectoReviewedEvent = {
      occurredAt: new Date(),
      passageId: 2,
      sequenceNumber: 1,
      elementId: '5ad40bc9-8b5c-47ee-b893-f8ab1a1b8095',
      cardId: 'c4675f66-97f1-4202-8aeb-0388edf102d5',
      type: 'FLASHCARDS_RECTO_REVIEWED',
    };

    const flashcardsRetriedEvent = {
      occurredAt: new Date(),
      passageId: 2,
      sequenceNumber: 1,
      elementId: '5ad40bc9-8b5c-47ee-b893-f8ab1a1b8095',
      type: 'FLASHCARDS_RETRIED',
    };

    const passageTerminatedEvent = {
      occurredAt: new Date(),
      passageId: 2,
      sequenceNumber: 1,
      type: 'PASSAGE_TERMINATED',
    };

    const passageStartedEvent = {
      occurredAt: new Date(),
      passageId: 2,
      sequenceNumber: 1,
      contentHash: 'module-version',
      type: 'PASSAGE_STARTED',
    };

    const events = [
      flashcardsVersoSeenEvent,
      flashcardsStartedEvent,
      flashcardsCardAutoAssessedEvent,
      flashcardsRectoReviewedEvent,
      flashcardsRetriedEvent,
      passageTerminatedEvent,
      passageStartedEvent,
    ];

    const passage = domainBuilder.devcomp.buildPassage({ id: 2 });
    const passageEventRepositoryStub = {
      record: sinon.stub().resolves(),
    };
    const passageRepositoryStub = {
      get: sinon.stub().resolves(passage),
    };

    // when
    await recordPassageEvents({
      events,
      userId: null,
      passageRepository: passageRepositoryStub,
      passageEventRepository: passageEventRepositoryStub,
    });

    // then
    const flashcardsVersoSeenPassageEvent = new FlashcardsVersoSeenEvent(flashcardsVersoSeenEvent);
    const flashcardsStartedPassageEvent = new FlashcardsStartedEvent(flashcardsStartedEvent);
    const flashcardsCardAutoAssessedPassageEvent = new FlashcardsCardAutoAssessedEvent(flashcardsCardAutoAssessedEvent);
    const flashcardsRectoReviewedEventPassageEvent = new FlashcardsRectoReviewedEvent(flashcardsRectoReviewedEvent);
    const flashcardsRetriedEventPassageEvent = new FlashcardsRetriedEvent(flashcardsRetriedEvent);
    const passageTerminatedPassageEvent = new PassageTerminatedEvent(passageTerminatedEvent);
    const passageStartedPassageEvent = new PassageStartedEvent(passageStartedEvent);

    expect(passageEventRepositoryStub.record.getCall(0)).to.have.been.calledWithExactly(
      flashcardsVersoSeenPassageEvent,
    );
    expect(passageEventRepositoryStub.record.getCall(1)).to.have.been.calledWithExactly(flashcardsStartedPassageEvent);
    expect(passageEventRepositoryStub.record.getCall(2)).to.have.been.calledWithExactly(
      flashcardsCardAutoAssessedPassageEvent,
    );
    expect(passageEventRepositoryStub.record.getCall(3)).to.have.been.calledWithExactly(
      flashcardsRectoReviewedEventPassageEvent,
    );
    expect(passageEventRepositoryStub.record.getCall(4)).to.have.been.calledWithExactly(
      flashcardsRetriedEventPassageEvent,
    );
    expect(passageEventRepositoryStub.record.getCall(5)).to.have.been.calledWithExactly(passageTerminatedPassageEvent);
    expect(passageEventRepositoryStub.record.getCall(6)).to.have.been.calledWithExactly(passageStartedPassageEvent);
  });

  context('when type of passage event does not exist', function () {
    it('should throw an error', async function () {
      // given
      const event = {
        type: 'NON_EXISTING_TYPE',
      };

      const passageRepositoryStub = {
        get: sinon.stub(),
      };
      const passageEventRepositoryStub = {
        record: sinon.stub().resolves(),
      };

      // when
      const error = await catchErr(recordPassageEvents)({
        events: [event],
        userId: null,
        passageRepository: passageRepositoryStub,
        passageEventRepository: passageEventRepositoryStub,
      });

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal(`Passage event with type ${event.type} does not exist`);
      expect(passageEventRepositoryStub.record).to.not.have.been.called;
    });
  });

  context('when there is no passage for given passage id', function () {
    it('should throw an error', async function () {
      // given
      const event = {
        type: 'PASSAGE_STARTED',
        occurredAt: new Date(),
        sequenceNumber: 2,
        contentHash: 'abc',
        passageId: 123,
      };

      const passageRepositoryStub = {
        get: sinon.stub().withArgs({ passageId: 123 }).rejects(new NotFoundError()),
      };
      const passageEventRepositoryStub = {
        record: sinon.stub().resolves(),
      };

      // when
      const error = await catchErr(recordPassageEvents)({
        events: [event],
        userId: null,
        passageRepository: passageRepositoryStub,
        passageEventRepository: passageEventRepositoryStub,
      });

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal(`Passage with id ${event.id} does not exist`);
      expect(passageEventRepositoryStub.record).to.not.have.been.called;
    });
  });

  context('when the passage for given passage id is terminated', function () {
    it('should throw an error', async function () {
      // given
      const event = {
        type: 'PASSAGE_STARTED',
        occurredAt: new Date(),
        sequenceNumber: 2,
        contentHash: 'abc',
        passageId: 123,
      };

      const passageRepositoryStub = {
        get: sinon.stub().resolves(new Passage({ id: 123, terminatedAt: new Date() })),
      };
      const passageEventRepositoryStub = {
        record: sinon.stub().resolves(),
      };

      // when
      const error = await catchErr(recordPassageEvents)({
        events: [event],
        userId: null,
        passageRepository: passageRepositoryStub,
        passageEventRepository: passageEventRepositoryStub,
      });

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal(`Passage with id ${event.id} is terminated.`);
      expect(passageEventRepositoryStub.record).to.not.have.been.called;
    });
  });

  context('when anonymous user records an event for a passage with user id', function () {
    it('should throw an error', async function () {
      // given
      const passageTerminatedEvent = {
        occurredAt: new Date(),
        passageId: 2,
        sequenceNumber: 1,
        type: 'PASSAGE_TERMINATED',
      };
      const passageUser = { id: 123 };
      const passage = domainBuilder.devcomp.buildPassage({ id: 2, userId: passageUser.id });

      const passageRepositoryStub = {
        get: sinon.stub().withArgs({ userId: passageUser.id }).resolves(passage),
      };
      const passageEventRepositoryStub = {
        record: sinon.stub(),
      };

      // when
      const error = await catchErr(recordPassageEvents)({
        events: [passageTerminatedEvent],
        userId: null,
        passageRepository: passageRepositoryStub,
        passageEventRepository: passageEventRepositoryStub,
      });

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('Anonymous user cannot record event for passage with id 2 that belongs to a user');
    });
  });
});
