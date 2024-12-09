import { certificationController } from '../../../../../src/certification/evaluation/application/certification-controller.js';
import { ChallengeDeneutralized } from '../../../../../src/certification/evaluation/domain/events/ChallengeDeneutralized.js';
import { ChallengeNeutralized } from '../../../../../src/certification/evaluation/domain/events/ChallengeNeutralized.js';
import { usecases } from '../../../../../src/certification/evaluation/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Certification | Evaluation | Unit | Application | Controller | certification', function () {
  describe('#neutralizeChallenge', function () {
    it('neutralizes the challenge and dispatches the event', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'neutralizeChallenge');
      const eventsStub = {
        eventDispatcher: {
          dispatch: sinon.stub(),
        },
      };

      // when
      await certificationController.neutralizeChallenge(request, hFake, { events: eventsStub });

      // then
      expect(usecases.neutralizeChallenge).to.have.been.calledWithExactly({
        certificationCourseId: 1,
        challengeRecId: 'rec43mpMIR5dUzdjh',
        juryId: 7,
      });
    });

    it('returns 204', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'neutralizeChallenge');

      const eventsStub = {
        eventDispatcher: {
          dispatch: sinon.stub(),
        },
      };
      // when
      const response = await certificationController.neutralizeChallenge(request, hFake, { events: eventsStub });

      // then
      expect(response.statusCode).to.equal(204);
    });

    it('dispatches an event', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      const eventToBeDispatched = new ChallengeNeutralized({ certificationCourseId: 1, juryId: 7 });
      sinon.stub(usecases, 'neutralizeChallenge').resolves(eventToBeDispatched);
      const eventsStub = {
        eventDispatcher: {
          dispatch: sinon.stub(),
        },
      };

      // when
      await certificationController.neutralizeChallenge(request, hFake, { events: eventsStub });

      // then
      expect(eventsStub.eventDispatcher.dispatch).to.have.been.calledWithExactly(eventToBeDispatched);
    });
  });

  describe('#deneutralizeChallenge', function () {
    it('deneutralizes the challenge', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'deneutralizeChallenge');
      const eventsStub = {
        eventDispatcher: {
          dispatch: sinon.stub(),
        },
      };

      // when
      await certificationController.deneutralizeChallenge(request, hFake, { events: eventsStub });

      // then
      expect(usecases.deneutralizeChallenge).to.have.been.calledWithExactly({
        certificationCourseId: 1,
        challengeRecId: 'rec43mpMIR5dUzdjh',
        juryId: 7,
      });
    });

    it('returns 204', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'deneutralizeChallenge');
      const eventsStub = {
        eventDispatcher: {
          dispatch: sinon.stub(),
        },
      };
      // when
      const response = await certificationController.deneutralizeChallenge(request, hFake, { events: eventsStub });

      // then
      expect(response.statusCode).to.equal(204);
    });

    it('dispatches the event', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      const eventToBeDispatched = new ChallengeDeneutralized({ certificationCourseId: 1, juryId: 7 });

      sinon.stub(usecases, 'deneutralizeChallenge').resolves(eventToBeDispatched);
      const eventsStub = {
        eventDispatcher: {
          dispatch: sinon.stub(),
        },
      };

      // when
      await certificationController.deneutralizeChallenge(request, hFake, { events: eventsStub });

      // then
      expect(eventsStub.eventDispatcher.dispatch).to.have.been.calledWithExactly(eventToBeDispatched);
    });
  });
});
