import { PassageDoesNotExistError, PassageTerminatedError } from '../../../../../src/devcomp/domain/errors.js';
import { PassageTerminatedEvent } from '../../../../../src/devcomp/domain/models/passage-events/passage-events.js';
import { terminatePassage } from '../../../../../src/devcomp/domain/usecases/terminate-passage.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Devcomp | Domain | UseCases | terminate-passage', function () {
  describe('#terminatePassage', function () {
    describe('when passage is not found', function () {
      it('should throw a PassageDoesNotExistError', async function () {
        // given
        const passageId = Symbol('passageId');
        const passageRepository = {
          get: sinon.stub(),
        };
        passageRepository.get.withArgs({ passageId }).rejects(new NotFoundError());

        // when
        const error = await catchErr(terminatePassage)({ passageId, passageRepository });

        // then
        expect(error).to.be.instanceof(PassageDoesNotExistError);
      });
    });

    describe('when passage is found', function () {
      it('should not verify if passage is terminated', async function () {
        // given
        const passageId = Symbol('passageId');

        const passage = {
          terminatedAt: Symbol('terminatedAt'),
        };
        const passageRepository = {
          get: sinon.stub(),
        };
        passageRepository.get.withArgs({ passageId }).resolves(passage);

        // when
        const error = await catchErr(terminatePassage)({
          passageId,
          passageRepository,
        });

        // then
        expect(error).to.be.instanceof(PassageTerminatedError);
      });

      it('should call terminate method and update passage and return it, then record an event', async function () {
        // given
        const passageId = Symbol('passageId');
        const requestTimestamp = new Date('2025-01-01').getTime();

        const passageRepository = {
          get: sinon.stub(),
          update: sinon.stub(),
        };
        const passageEventRepository = {
          record: sinon.stub(),
        };

        const passage = {
          terminatedAt: null,
          terminate: sinon.stub(),
        };
        passageRepository.get.withArgs({ passageId }).resolves(passage);

        const updatedPassage = {
          terminatedAt: new Date('2025-03-04'),
          id: passageId,
        };
        passageRepository.update.withArgs({ passage }).resolves(updatedPassage);

        const event = new PassageTerminatedEvent({
          passageId: updatedPassage.id,
          occurredAt: new Date(requestTimestamp),
        });

        // when
        const returnedPassage = await terminatePassage({
          passageId,
          requestTimestamp,
          passageRepository,
          passageEventRepository,
        });

        // then
        expect(passage.terminate).to.have.been.calledOnce;
        expect(returnedPassage).to.equal(updatedPassage);
        expect(passageEventRepository.record).to.have.been.calledOnceWithExactly(event);
      });
    });
  });
});
