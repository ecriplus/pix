import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { EmptyAnswerError } from '../../../../../../src/evaluation/domain/errors.js';
import {
  CertificationEndedByFinalizationError,
  CertificationEndedByInvigilatorError,
  ChallengeAlreadyAnsweredError,
  ChallengeNotAskedError,
  ForbiddenAccess,
  NotFoundError,
} from '../../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

const { evaluateAndSaveAnswer } = usecases;

describe('Certification | Evaluation | Integration | Domain | UseCase | evaluate-and-save-answer', function () {
  const STATES = domainBuilder.certification.evaluation.buildAssessmentSheet.STATES;

  context('when certification does not exist', function () {
    it('throws a NotFound error', async function () {
      const err = await catchErr(evaluateAndSaveAnswer)({
        certificationCourseId: 123,
      });

      expect(err).to.deepEqualInstance(new NotFoundError('No certification test found with id 123'));
    });
  });

  context('when certification does exist', function () {
    let certificationCourseId;

    context('when user submitting the answer is not the owner of the certification test', function () {
      it('throws a ForbiddenAccess error', async function () {
        certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        databaseBuilder.factory.buildAssessment({ certificationCourseId });
        await databaseBuilder.commit();

        const err = await catchErr(evaluateAndSaveAnswer)({
          certificationCourseId,
          userId: 1111111111,
        });

        expect(err).to.deepEqualInstance(
          new ForbiddenAccess('User is not allowed to add an answer for this certification test.'),
        );
      });
    });

    context('when user submitting the answer is the owner of the certification test', function () {
      let userId;

      beforeEach(function () {
        userId = databaseBuilder.factory.buildUser().id;
        return databaseBuilder.commit();
      });

      context('when certification test has been ended by the invigilator', function () {
        it('throws a CertificationEndedByInvigilatorError error', async function () {
          certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ userId }).id;
          databaseBuilder.factory.buildAssessment({
            certificationCourseId,
            userId,
            state: STATES.ENDED_BY_INVIGILATOR,
          });
          await databaseBuilder.commit();

          const err = await catchErr(evaluateAndSaveAnswer)({
            certificationCourseId,
            userId,
          });

          expect(err).to.deepEqualInstance(new CertificationEndedByInvigilatorError());
        });
      });

      context('when certification test has been ended by session finalization', function () {
        it('throws a CertificationEndedByFinalizationError error', async function () {
          certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ userId }).id;
          databaseBuilder.factory.buildAssessment({
            certificationCourseId,
            userId,
            state: STATES.ENDED_DUE_TO_FINALIZATION,
          });
          await databaseBuilder.commit();

          const err = await catchErr(evaluateAndSaveAnswer)({
            certificationCourseId,
            userId,
          });

          expect(err).to.deepEqualInstance(new CertificationEndedByFinalizationError());
        });
      });

      context('when certification test is still ongoing', function () {
        let assessmentId;

        beforeEach(function () {
          certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ userId }).id;
          assessmentId = databaseBuilder.factory.buildAssessment({
            certificationCourseId,
            userId,
            state: STATES.STARTED,
            lastChallengeId: 'myFavoriteChallengeId',
          }).id;
          return databaseBuilder.commit();
        });

        context('when answered challenge was not the one expected to be answered', function () {
          it('throws a ChallengeNotAskedError error', async function () {
            const err = await catchErr(evaluateAndSaveAnswer)({
              certificationCourseId,
              userId,
              answer: domainBuilder.buildAnswer({ challengeId: 'someOtherChallengeId' }),
            });

            expect(err).to.deepEqualInstance(new ChallengeNotAskedError());
          });
        });

        context('when answered challenge has already been answered', function () {
          it('throws a ChallengeAlreadyAnsweredError error', async function () {
            databaseBuilder.factory.buildAnswer({
              assessmentId,
              challengeId: 'myFavoriteChallengeId',
            });
            await databaseBuilder.commit();

            const err = await catchErr(evaluateAndSaveAnswer)({
              certificationCourseId,
              userId,
              answer: domainBuilder.buildAnswer({ challengeId: 'myFavoriteChallengeId' }),
            });

            expect(err).to.deepEqualInstance(new ChallengeAlreadyAnsweredError());
          });
        });

        context('when answer has no value and is not a timeout', function () {
          it('throws a EmptyAnswerError error', async function () {
            const err = await catchErr(evaluateAndSaveAnswer)({
              certificationCourseId,
              userId,
              answer: domainBuilder.buildAnswer({ challengeId: 'myFavoriteChallengeId', value: null, timeout: null }),
            });

            expect(err).to.deepEqualInstance(new EmptyAnswerError());
          });
        });

        it('returns coucou', async function () {
          databaseBuilder.factory.buildAnswer({
            assessmentId,
            challengeId: 'someOtherChallengeId',
          });
          await databaseBuilder.commit();
          const currentAnswer = domainBuilder.buildAnswer({
            challengeId: 'myFavoriteChallengeId',
            value: 'The answer is 42',
          });

          const evaluatedAnswer = await evaluateAndSaveAnswer({
            certificationCourseId,
            userId,
            answer: currentAnswer,
          });

          expect(evaluatedAnswer).to.equal('coucou');
        });
      });
    });
  });
});
