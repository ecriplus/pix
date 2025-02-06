import { FixDuplicatedChallengeScript } from '../../../../scripts/certification/remove-exact-same-challenge-recorded-twice.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | remove-exact-same-challenge-recorded-twice', function () {
  describe('when candidate has completed the test', function () {
    describe('when there is only one duplicated challenge', function () {
      it('should fix the capacities challenges ids', async function () {
        // given
        const certificationCourseId = 321;
        const options = { dryRun: false, courseIds: [certificationCourseId] };
        const logger = {
          info: sinon.stub(),
          debug: sinon.stub(),
        };

        const user = databaseBuilder.factory.buildUser();
        const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
          id: certificationCourseId,
          userId: user.id,
        });
        const assessment = databaseBuilder.factory.buildAssessment({
          certificationCourseId: certificationCourse.id,
          userId: user.id,
        });
        const firstChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
          id: 1,
          challengeId: 'rec123',
          courseId: certificationCourseId,
        });
        const secondChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
          id: 2,
          challengeId: 'rec456',
          courseId: certificationCourseId,
        });
        const doubledChallengeNotSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
          id: 22,
          challengeId: 'rec456',
          courseId: certificationCourseId,
        });
        const thirdChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
          id: 3,
          challengeId: 'rec789',
          courseId: certificationCourseId,
        });
        const fourthChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
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

        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: firstChallengeSeenByCandidate.id,
          answerId: firstAnswer.id,
          capacity: 1,
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: secondChallengeSeenByCandidate.id,
          answerId: secondAnswer.id,
          capacity: 2,
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: doubledChallengeNotSeenByCandidate.id,
          answerId: thirdAnswer.id,
          capacity: 3,
          createdAt: new Date('2020-01-01'),
        });

        databaseBuilder.factory.buildCertificationChallengeCapacity({
          certificationChallengeId: thirdChallengeSeenByCandidate.id,
          answerId: fourthAnswer.id,
          capacity: 4,
          createdAt: new Date('2020-01-01'),
        });

        await databaseBuilder.commit();

        const script = new FixDuplicatedChallengeScript();

        // when
        await script.handle({ options, logger });

        // then
        const certificationChallenges = await knex('certification-challenges');
        expect(certificationChallenges).to.deep.equal([
          {
            associatedSkillId: 'recSKIL123',
            associatedSkillName: '@twi8',
            certifiableBadgeKey: null,
            challengeId: firstAnswer.challengeId,
            competenceId: 'recCOMP789',
            courseId: 321,
            createdAt: new Date('2020-01-01'),
            difficulty: null,
            discriminant: null,
            hasBeenSkippedAutomatically: false,
            id: firstChallengeSeenByCandidate.id,
            isNeutralized: false,
            updatedAt: new Date('2020-01-02'),
          },
          {
            associatedSkillId: 'recSKIL123',
            associatedSkillName: '@twi8',
            certifiableBadgeKey: null,
            challengeId: secondAnswer.challengeId,
            competenceId: 'recCOMP789',
            courseId: 321,
            createdAt: new Date('2020-01-01'),
            difficulty: null,
            discriminant: null,
            hasBeenSkippedAutomatically: false,
            id: secondChallengeSeenByCandidate.id,
            isNeutralized: false,
            updatedAt: new Date('2020-01-02'),
          },
          {
            associatedSkillId: 'recSKIL123',
            associatedSkillName: '@twi8',
            certifiableBadgeKey: null,
            challengeId: thirdAnswer.challengeId,
            competenceId: 'recCOMP789',
            courseId: 321,
            createdAt: new Date('2020-01-01'),
            difficulty: null,
            discriminant: null,
            hasBeenSkippedAutomatically: false,
            id: thirdChallengeSeenByCandidate.id,
            isNeutralized: false,
            updatedAt: new Date('2020-01-02'),
          },
          {
            associatedSkillId: 'recSKIL123',
            associatedSkillName: '@twi8',
            certifiableBadgeKey: null,
            challengeId: fourthAnswer.challengeId,
            competenceId: 'recCOMP789',
            courseId: 321,
            createdAt: new Date('2020-01-01'),
            difficulty: null,
            discriminant: null,
            hasBeenSkippedAutomatically: false,
            id: fourthChallengeSeenByCandidate.id,
            isNeutralized: false,
            updatedAt: new Date('2020-01-02'),
          },
        ]);
        const certificationChallengeCapacities = await knex('certification-challenge-capacities');
        expect(certificationChallengeCapacities).to.have.deep.members([
          {
            certificationChallengeId: firstChallengeSeenByCandidate.id,
            answerId: firstAnswer.id,
            createdAt: new Date('2020-01-01'),
            capacity: 1,
          },
          {
            certificationChallengeId: secondChallengeSeenByCandidate.id,
            answerId: secondAnswer.id,
            createdAt: new Date('2020-01-01'),
            capacity: 2,
          },
          {
            certificationChallengeId: thirdChallengeSeenByCandidate.id,
            answerId: thirdAnswer.id,
            createdAt: new Date('2020-01-01'),
            capacity: 3,
          },
          {
            certificationChallengeId: fourthChallengeSeenByCandidate.id,
            answerId: fourthAnswer.id,
            createdAt: new Date('2020-01-01'),
            capacity: 4,
          },
        ]);
      });
    });
  });

  describe('when candidate has not completed the test', function () {
    it('should fix the capacities challenges ids', async function () {
      // given
      const certificationCourseId = 321;
      const options = { dryRun: false, courseIds: [certificationCourseId] };
      const logger = {
        info: sinon.stub(),
        debug: sinon.stub(),
      };

      databaseBuilder.factory.buildCertificationCourse({ id: certificationCourseId });
      const firstChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
        id: 1,
        challengeId: 'rec123',
        courseId: certificationCourseId,
      });
      const secondChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
        id: 2,
        challengeId: 'rec456',
        courseId: certificationCourseId,
      });
      const doubledChallengeNotSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
        id: 3,
        challengeId: 'rec456',
        courseId: certificationCourseId,
      });
      const thirdChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
        id: 4,
        challengeId: 'rec789',
        courseId: certificationCourseId,
      });
      const fourthChallengeSeenByCandidate = databaseBuilder.factory.buildCertificationChallenge({
        id: 5,
        challengeId: 'rec001',
        courseId: certificationCourseId,
      });

      const firstAnswer = databaseBuilder.factory.buildAnswer({ id: 1, challengeId: 'rec123' });
      const secondAnswer = databaseBuilder.factory.buildAnswer({ id: 2, challengeId: 'rec456' });
      const thirdAnswer = databaseBuilder.factory.buildAnswer({ id: 3, challengeId: 'rec789' });

      databaseBuilder.factory.buildCertificationChallengeCapacity({
        certificationChallengeId: firstChallengeSeenByCandidate.id,
        answerId: firstAnswer.id,
        capacity: 1,
        createdAt: new Date('2020-01-01'),
      });
      databaseBuilder.factory.buildCertificationChallengeCapacity({
        certificationChallengeId: secondChallengeSeenByCandidate.id,
        answerId: secondAnswer.id,
        capacity: 2,
        createdAt: new Date('2020-01-01'),
      });
      databaseBuilder.factory.buildCertificationChallengeCapacity({
        certificationChallengeId: doubledChallengeNotSeenByCandidate.id,
        answerId: thirdAnswer.id,
        capacity: 3,
        createdAt: new Date('2020-01-01'),
      });

      await databaseBuilder.commit();

      const script = new FixDuplicatedChallengeScript();

      // when
      await script.handle({ options, logger });

      // then
      const certificationChallenges = await knex('certification-challenges');
      expect(certificationChallenges).to.deep.equal([
        {
          associatedSkillId: 'recSKIL123',
          associatedSkillName: '@twi8',
          certifiableBadgeKey: null,
          challengeId: firstAnswer.challengeId,
          competenceId: 'recCOMP789',
          courseId: 321,
          createdAt: new Date('2020-01-01'),
          difficulty: null,
          discriminant: null,
          hasBeenSkippedAutomatically: false,
          id: firstChallengeSeenByCandidate.id,
          isNeutralized: false,
          updatedAt: new Date('2020-01-02'),
        },
        {
          associatedSkillId: 'recSKIL123',
          associatedSkillName: '@twi8',
          certifiableBadgeKey: null,
          challengeId: secondAnswer.challengeId,
          competenceId: 'recCOMP789',
          courseId: 321,
          createdAt: new Date('2020-01-01'),
          difficulty: null,
          discriminant: null,
          hasBeenSkippedAutomatically: false,
          id: secondChallengeSeenByCandidate.id,
          isNeutralized: false,
          updatedAt: new Date('2020-01-02'),
        },
        {
          associatedSkillId: 'recSKIL123',
          associatedSkillName: '@twi8',
          certifiableBadgeKey: null,
          challengeId: thirdAnswer.challengeId,
          competenceId: 'recCOMP789',
          courseId: 321,
          createdAt: new Date('2020-01-01'),
          difficulty: null,
          discriminant: null,
          hasBeenSkippedAutomatically: false,
          id: thirdChallengeSeenByCandidate.id,
          isNeutralized: false,
          updatedAt: new Date('2020-01-02'),
        },
        {
          associatedSkillId: 'recSKIL123',
          associatedSkillName: '@twi8',
          certifiableBadgeKey: null,
          challengeId: fourthChallengeSeenByCandidate.challengeId,
          competenceId: 'recCOMP789',
          courseId: 321,
          createdAt: new Date('2020-01-01'),
          difficulty: null,
          discriminant: null,
          hasBeenSkippedAutomatically: false,
          id: fourthChallengeSeenByCandidate.id,
          isNeutralized: false,
          updatedAt: new Date('2020-01-02'),
        },
      ]);
      const certificationChallengeCapacities = await knex('certification-challenge-capacities');
      expect(certificationChallengeCapacities).to.deep.equal([
        {
          certificationChallengeId: firstChallengeSeenByCandidate.id,
          answerId: firstAnswer.id,
          createdAt: new Date('2020-01-01'),
          capacity: 1,
        },
        {
          certificationChallengeId: secondChallengeSeenByCandidate.id,
          answerId: secondAnswer.id,
          createdAt: new Date('2020-01-01'),
          capacity: 2,
        },
        {
          certificationChallengeId: thirdChallengeSeenByCandidate.id,
          answerId: thirdAnswer.id,
          createdAt: new Date('2020-01-01'),
          capacity: 3,
        },
      ]);
    });
  });
});
