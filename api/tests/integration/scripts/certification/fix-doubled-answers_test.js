import { FixDoubledAnswers } from '../../../../scripts/certification/fix-doubled-answers.js';
import { CertificationAssessment } from '../../../../src/certification/session-management/domain/models/CertificationAssessment.js';
import { AlgorithmEngineVersion } from '../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { ABORT_REASONS } from '../../../../src/certification/shared/domain/models/CertificationCourse.js';
import { Assessment } from '../../../../src/shared/domain/models/index.js';
import { createTempFile, databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | fix-doubled-answers', function () {
  it('should parse input file', async function () {
    const script = new FixDoubledAnswers();
    const { options } = script.metaInfo;
    const file = 'doubled-answers.csv';
    const data =
      'certificationChallengeId,answerId,completionDate\n1,2,2021-01-02 8:20:45.000000+01:00\n3,4,2021-01-02 9:20:45.000000+01:00\n5,6,2021-01-02 10:20:45.000000+01:00\n';
    const csvFilePath = await createTempFile(file, data);

    const parsedData = await options.file.coerce(csvFilePath);

    expect(parsedData).to.deep.equal([
      { certificationChallengeId: 1, answerId: 2, completionDate: '2021-01-02 8:20:45.000000+01:00' },
      { certificationChallengeId: 3, answerId: 4, completionDate: '2021-01-02 9:20:45.000000+01:00' },
      { certificationChallengeId: 5, answerId: 6, completionDate: '2021-01-02 10:20:45.000000+01:00' },
    ]);
  });

  it('should link doubled answers to another assessment', async function () {
    // given
    const certificationCourseId = 123;
    const secondCertificationCourseId = 456;
    const logger = {
      info: sinon.stub(),
      debug: sinon.stub(),
    };

    const assessmentToUseForUpdate = await databaseBuilder.factory.buildAssessment({
      id: 123,
      type: Assessment.types.COMPETENCE_EVALUATION,
    });
    const user = databaseBuilder.factory.buildUser();

    const firstCertificationCourse = databaseBuilder.factory.buildCertificationCourse({
      id: certificationCourseId,
      userId: user.id,
      version: AlgorithmEngineVersion.V3,
      abortReason: ABORT_REASONS.TECHNICAL,
      completedAt: null,
      finalizedAt: new Date('2021-01-01'),
    });
    const secondCertificationCourse = databaseBuilder.factory.buildCertificationCourse({
      id: secondCertificationCourseId,
      userId: user.id,
      version: AlgorithmEngineVersion.V3,
      abortReason: ABORT_REASONS.TECHNICAL,
      completedAt: null,
      finalizedAt: new Date('2021-01-01'),
    });

    const firstAssessmentId = databaseBuilder.factory.buildAssessment({
      certificationCourseId: firstCertificationCourse.id,
      userId: user.id,
      type: Assessment.types.CERTIFICATION,
      state: 'endedDueToFinalization',
    }).id;
    const secondAssessmentId = databaseBuilder.factory.buildAssessment({
      certificationCourseId: secondCertificationCourse.id,
      userId: user.id,
      type: Assessment.types.CERTIFICATION,
      state: 'endedDueToFinalization',
    }).id;

    const firstCertificationChallengeToKeep = databaseBuilder.factory.buildCertificationChallenge({
      id: 1,
      challengeId: 'recYYYY',
      courseId: certificationCourseId,
    });
    const firstCertificationChallengeToBeRemoved = databaseBuilder.factory.buildCertificationChallenge({
      id: 2,
      challengeId: 'rec123',
      courseId: certificationCourseId,
    });

    const secondCertificationChallengeToKeep = databaseBuilder.factory.buildCertificationChallenge({
      id: 3,
      challengeId: 'recXXXX',
      courseId: secondCertificationCourseId,
    });
    const secondCertificationChallengeToBeRemoved = databaseBuilder.factory.buildCertificationChallenge({
      id: 4,
      challengeId: 'rec456',
      courseId: secondCertificationCourseId,
    });

    const firstAnswerToBeUpdated = databaseBuilder.factory.buildAnswer({
      id: 1,
      challengeId: 'rec123',
      assessmentId: firstAssessmentId,
    });
    const secondAnswerToBeUpdated = databaseBuilder.factory.buildAnswer({
      id: 2,
      challengeId: 'rec456',
      assessmentId: secondAssessmentId,
    });

    databaseBuilder.factory.buildCertificationChallengeCapacity({
      certificationChallengeId: firstCertificationChallengeToBeRemoved.id,
      answerId: firstAnswerToBeUpdated.id,
      capacity: 1,
    });
    databaseBuilder.factory.buildCertificationChallengeCapacity({
      certificationChallengeId: secondCertificationChallengeToBeRemoved.id,
      answerId: secondAnswerToBeUpdated.id,
      capacity: 2,
    });

    await databaseBuilder.commit();

    const file = [
      {
        certificationChallengeId: firstCertificationChallengeToBeRemoved.id,
        answerId: firstAnswerToBeUpdated.id,
        completionDate: '2021-01-02 8:20:45.000000+01:00',
      },
      {
        certificationChallengeId: secondCertificationChallengeToBeRemoved.id,
        answerId: secondAnswerToBeUpdated.id,
        completionDate: '2021-01-02 9:20:45.000000+01:00',
      },
    ];
    const script = new FixDoubledAnswers();

    // when
    await script.handle({ options: { file, assessmentId: assessmentToUseForUpdate.id, dryRun: false }, logger });

    // then
    const answers = await knex('answers').select('id', 'assessmentId').orderBy('id');
    expect(answers).to.deep.equal([
      {
        id: firstAnswerToBeUpdated.id,
        assessmentId: assessmentToUseForUpdate.id,
      },
      {
        id: secondAnswerToBeUpdated.id,
        assessmentId: assessmentToUseForUpdate.id,
      },
    ]);
    const certificationChallenges = await knex('certification-challenges').select('id');
    expect(certificationChallenges).to.deep.equal([{ id: 1 }, { id: 3 }]);

    const certificationChallengeCapacities = await knex('certification-challenge-capacities');
    expect(certificationChallengeCapacities).to.deep.equal([]);

    const assessments = await knex('assessments')
      .select('id', 'updatedAt', 'state', 'lastChallengeId', 'lastQuestionDate')
      .where({ type: Assessment.types.CERTIFICATION });
    expect(assessments).to.deep.equal([
      {
        id: firstAssessmentId,
        state: CertificationAssessment.states.COMPLETED,
        updatedAt: new Date('2021-01-02T07:20:45Z'),
        lastChallengeId: firstCertificationChallengeToKeep.challengeId,
        lastQuestionDate: new Date('2021-01-02T07:20:45Z'),
      },
      {
        id: secondAssessmentId,
        state: CertificationAssessment.states.COMPLETED,
        updatedAt: new Date('2021-01-02T08:20:45Z'),
        lastChallengeId: secondCertificationChallengeToKeep.challengeId,
        lastQuestionDate: new Date('2021-01-02T08:20:45Z'),
      },
    ]);

    const certificationCourses = await knex('certification-courses').select(
      'id',
      'completedAt',
      'updatedAt',
      'endedAt',
      'abortReason',
    );
    expect(certificationCourses).to.deep.equal([
      {
        id: certificationCourseId,
        completedAt: new Date('2021-01-02T07:20:45Z'),
        updatedAt: new Date('2021-01-02T07:20:45Z'),
        endedAt: new Date('2021-01-02T07:20:45Z'),
        abortReason: null,
      },
      {
        id: secondCertificationCourseId,
        completedAt: new Date('2021-01-02T08:20:45Z'),
        updatedAt: new Date('2021-01-02T08:20:45Z'),
        endedAt: new Date('2021-01-02T08:20:45Z'),
        abortReason: null,
      },
    ]);
  });
});
