import { QCUDeclarativeAnsweredEvent } from '../../../../../../src/devcomp/domain/models/passage-events/answerable-element-events.js';
import { DomainError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, expect } from '../../../../../test-helper.js';

describe('Integration | Devcomp | Domain | Models | passage-events | answerable-element-events', function () {
  describe('#QCUDeclarativeAnsweredEvent', function () {
    it('should init and keep attributes', function () {
      // given
      const id = Symbol('id');
      const occurredAt = new Date();
      const createdAt = new Date();
      const passageId = 2;
      const sequenceNumber = 3;
      const elementId = '5ad40bc9-8b5c-47ee-b893-f8ab1a1b8095';
      const answer = 'À chaque Noël';

      // when
      const qcuDeclarativeAnsweredEvent = new QCUDeclarativeAnsweredEvent({
        id,
        occurredAt,
        createdAt,
        passageId,
        sequenceNumber,
        elementId,
        answer,
      });

      // then
      expect(qcuDeclarativeAnsweredEvent.id).to.equal(id);
      expect(qcuDeclarativeAnsweredEvent.type).to.equal('QCU_DECLARATIVE_ANSWERED');
      expect(qcuDeclarativeAnsweredEvent.occurredAt).to.equal(occurredAt);
      expect(qcuDeclarativeAnsweredEvent.createdAt).to.equal(createdAt);
      expect(qcuDeclarativeAnsweredEvent.passageId).to.equal(passageId);
      expect(qcuDeclarativeAnsweredEvent.sequenceNumber).to.equal(sequenceNumber);
      expect(qcuDeclarativeAnsweredEvent.data).to.deep.equal({ elementId, answer });
    });

    describe('when answer is not given', function () {
      it('should throw an error', function () {
        // given
        const id = Symbol('id');
        const occurredAt = new Date();
        const createdAt = new Date();
        const passageId = 2;
        const sequenceNumber = 3;
        const elementId = '5ad40bc9-8b5c-47ee-b893-f8ab1a1b8095';
        const answer = undefined;

        // when
        const error = catchErrSync(
          () =>
            new QCUDeclarativeAnsweredEvent({
              id,
              occurredAt,
              createdAt,
              passageId,
              sequenceNumber,
              elementId,
              answer,
            }),
        )();

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('The answer is required for a QCUDeclarativeAnsweredEvent');
      });
    });
  });
});
