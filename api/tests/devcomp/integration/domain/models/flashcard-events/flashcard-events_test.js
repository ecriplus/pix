import { FlashcardsStartedEvent } from '../../../../../../src/devcomp/domain/models/passage-events/flashcard-events.js';
import { DomainError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, expect } from '../../../../../test-helper.js';

describe('Integration | Devcomp | Domain | Models | passage-events | flashcard-events', function () {
  describe('#FlashcardsStartedEvent', function () {
    it('should init and keep attributes', function () {
      // given
      const id = Symbol('id');
      const occurredAt = Symbol('date');
      const createdAt = Symbol('date');
      const passageId = Symbol('passage');
      const elementId = Symbol('elementId');

      // when
      const flashcardsStartedEvent = new FlashcardsStartedEvent({ id, occurredAt, createdAt, passageId, elementId });

      // then
      expect(flashcardsStartedEvent.id).to.equal(id);
      expect(flashcardsStartedEvent.type).to.equal('FLASHCARDS_STARTED');
      expect(flashcardsStartedEvent.occurredAt).to.equal(occurredAt);
      expect(flashcardsStartedEvent.createdAt).to.equal(createdAt);
      expect(flashcardsStartedEvent.passageId).to.equal(passageId);
      expect(flashcardsStartedEvent.elementId).to.equal(elementId);
      expect(flashcardsStartedEvent.data).to.deep.equal({ elementId });
    });

    describe('when elementId is not given', function () {
      it('should throw an error', function () {
        // given
        const id = Symbol('id');
        const occurredAt = Symbol('date');
        const createdAt = Symbol('date');
        const passageId = Symbol('passage');

        // when
        const error = catchErrSync(() => new FlashcardsStartedEvent({ id, occurredAt, createdAt, passageId }))();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('The elementId is required for a FlashcardsStartedEvent');
      });
    });
  });
});
