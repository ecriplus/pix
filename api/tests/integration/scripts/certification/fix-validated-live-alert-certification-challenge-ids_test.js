import { FixValidatedLiveAlertCertificationChallengeIds } from '../../../../scripts/certification/fix-validated-live-alert-certification-challenge-ids.js';
import { AlgorithmEngineVersion } from '../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { CertificationChallengeLiveAlertStatus } from '../../../../src/certification/shared/domain/models/CertificationChallengeLiveAlert.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | fix-validated-live-alert-certification-challenge-ids', function () {
  describe('when candidate has completed the test', function () {
    describe('when there is a live alert', function () {
      it('should fix the capacities challenges ids', async function () {
        // given
        const certificationCourseId = 321;
        const options = {
          dryRun: false,
          batchSize: 10,
          startingFromDate: new Date(2024, 10, 4),
          stopAtDate: new Date(2024, 10, 6),
        };
        const logger = {
          info: sinon.stub(),
          debug: sinon.stub(),
        };

        const user = databaseBuilder.factory.buildUser();
        const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
          id: certificationCourseId,
          userId: user.id,
          version: AlgorithmEngineVersion.V3,
          createdAt: new Date(2024, 10, 5),
        });
        const assessment = databaseBuilder.factory.buildAssessment({
          certificationCourseId: certificationCourse.id,
          userId: user.id,
        });
        const firstChallenge = databaseBuilder.factory.buildCertificationChallenge({
          id: 1,
          challengeId: 'rec123',
          courseId: certificationCourseId,
        });
        const secondChallenge = databaseBuilder.factory.buildCertificationChallenge({
          id: 2,
          challengeId: 'rec456',
          courseId: certificationCourseId,
        });
        const thirdChallengeWithLiveAlert = databaseBuilder.factory.buildCertificationChallenge({
          id: 3,
          challengeId: 'recWithLiveAlert',
          courseId: certificationCourseId,
        });
        const fourthChallenge = databaseBuilder.factory.buildCertificationChallenge({
          id: 4,
          challengeId: 'rec789',
          courseId: certificationCourseId,
        });
        const fifthChallenge = databaseBuilder.factory.buildCertificationChallenge({
          id: 5,
          challengeId: 'rec002',
          courseId: certificationCourseId,
        });

        const firstAnswer = databaseBuilder.factory.buildAnswer({
          id: 1,
          challengeId: 'rec123',
          assessment: assessment.id,
        });
        const secondAnswer = databaseBuilder.factory.buildAnswer({
          id: 2,
          challengeId: 'rec456',
          assessment: assessment.id,
        });
        const thirdAnswer = databaseBuilder.factory.buildAnswer({
          id: 3,
          challengeId: 'rec789',
          assessment: assessment.id,
        });
        const fourthAnswer = databaseBuilder.factory.buildAnswer({
          id: 4,
          challengeId: 'rec002',
          assessment: assessment.id,
        });

        databaseBuilder.factory.buildCertificationChallengeLiveAlert({
          assessmentId: assessment.id,
          challengeId: 'recWithLiveAlert',
          status: CertificationChallengeLiveAlertStatus.VALIDATED,
          questionNumber: 3,
        });

        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: firstChallenge.id,
          answerId: firstAnswer.id,
          capacity: 1,
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: secondChallenge.id,
          answerId: secondAnswer.id,
          capacity: 2,
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: thirdChallengeWithLiveAlert.id,
          answerId: thirdAnswer.id,
          capacity: 3,
          createdAt: new Date('2020-01-01'),
        });

        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: fourthChallenge.id,
          answerId: fourthAnswer.id,
          capacity: 4,
          createdAt: new Date('2020-01-01'),
        });

        await databaseBuilder.commit();

        const script = new FixValidatedLiveAlertCertificationChallengeIds();

        // when
        await script.handle({ options, logger });

        // then
        const certificationChallengeCapacities = await knex('certification-challenge-capacities').orderBy('answerId');
        expect(certificationChallengeCapacities).to.deep.equal([
          {
            certificationChallengeId: firstChallenge.id,
            answerId: firstAnswer.id,
            capacity: 1,
            createdAt: new Date('2020-01-01'),
          },
          {
            certificationChallengeId: secondChallenge.id,
            answerId: secondChallenge.id,
            capacity: 2,
            createdAt: new Date('2020-01-01'),
          },
          {
            certificationChallengeId: fourthChallenge.id,
            answerId: thirdAnswer.id,
            capacity: 3,
            createdAt: new Date('2020-01-01'),
          },
          {
            certificationChallengeId: fifthChallenge.id,
            answerId: fourthAnswer.id,
            capacity: 4,
            createdAt: new Date('2020-01-01'),
          },
        ]);

        const certificationChallenges = await knex('certification-challenges')
          .select('id', 'challengeId')
          .orderBy('id');
        expect(certificationChallenges).to.deep.equal([
          {
            challengeId: firstChallenge.challengeId,
            id: firstChallenge.id,
          },
          {
            challengeId: secondChallenge.challengeId,
            id: secondChallenge.id,
          },
          {
            challengeId: thirdChallengeWithLiveAlert.challengeId,
            id: thirdChallengeWithLiveAlert.id,
          },
          {
            challengeId: fourthChallenge.challengeId,
            id: fourthChallenge.id,
          },
          {
            challengeId: fifthChallenge.challengeId,
            id: fifthChallenge.id,
          },
        ]);
      });
    });
  });
});
