import { CompleteAssessment } from '../../../../scripts/certification/complete-assessment.js';
import { CertificationCompletedJobController } from '../../../../src/certification/evaluation/application/jobs/certification-completed-job-controller.js';
import { LOCALE } from '../../../../src/shared/domain/constants.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

const { FRENCH_FRANCE } = LOCALE;
const locale = FRENCH_FRANCE;

describe('Integration | Scripts | Certification | complete assessment', function () {
  let assessment, certificationCourse, completeAssessmentScript, logger;

  beforeEach(async function () {
    databaseBuilder.factory.learningContent.buildArea({ id: 'recArea0', code: 'area0' });
    databaseBuilder.factory.learningContent.buildCompetence({
      id: 'recCompetence0',
      index: '1.1',
      areaId: 'recArea0',
      origin: 'Pix',
    });

    const configUser = databaseBuilder.factory.buildUser();
    databaseBuilder.factory.buildCompetenceScoringConfiguration({
      createdAt: new Date('2024-09-23'),
      createdByUserId: configUser.id,
      configuration: [
        {
          competence: '1.1',
          values: [
            {
              bounds: {
                max: 0,
                min: -5,
              },
              competenceLevel: 0,
            },
            {
              bounds: {
                max: 5,
                min: 0,
              },
              competenceLevel: 1,
            },
          ],
        },
      ],
    });
    databaseBuilder.factory.buildScoringConfiguration({
      createdAt: new Date('2024-09-23'),
      createdByUserId: configUser.id,
    });
    databaseBuilder.factory.buildFlashAlgorithmConfiguration({
      createdAt: new Date('2024-09-23'),
      createdByUserId: configUser.id,
    });

    const session = databaseBuilder.factory.buildSession({ version: 3 });
    const user = databaseBuilder.factory.buildUser();
    databaseBuilder.factory.buildCertificationCandidate({
      sessionId: session.id,
      userId: user.id,
    });
    certificationCourse = databaseBuilder.factory.buildCertificationCourse({
      createdAt: new Date('2024-10-23'),
      sessionId: session.id,
      userId: user.id,
      completedAt: null,
      isPublished: false,
      isCancelled: false,
      abortReason: null,
      version: 3,
      isRejectedForFraud: false,
      endedAt: null,
    });
    assessment = databaseBuilder.factory.buildAssessment({
      certificationCourseId: certificationCourse.id,
      userId: user.id,
      type: 'CERTIFICATION',
      state: 'completed',
      method: 'CERTIFICATION_DETERMINED',
    });

    await databaseBuilder.commit();

    logger = { info: sinon.stub() };
    completeAssessmentScript = new CompleteAssessment();
  });

  it('calls completedAssessment usecase', async function () {
    // given
    const completedAssessmentUsecase = sinon.stub().resolves(assessment);

    // when
    await completeAssessmentScript.handle({
      options: { assessmentId: assessment.id },
      logger,
      completeAssessment: completedAssessmentUsecase,
    });

    // then
    expect(completedAssessmentUsecase).to.have.been.called;
  });

  it('calls CertificationCompletedJob', async function () {
    // when
    await completeAssessmentScript.handle({
      options: { assessmentId: assessment.id },
      logger,
    });

    // then
    await expect('CertificationCompletedJob').to.have.been.performed.withJobPayload({
      assessmentId: assessment.id,
      userId: assessment.userId,
      certificationCourseId: assessment.certificationCourseId,
      locale,
    });
  });

  it('creates an AssessmentResult', async function () {
    // given
    await completeAssessmentScript.handle({
      options: { assessmentId: assessment.id },
      logger,
    });

    // when
    const certificationCompletedJobController = new CertificationCompletedJobController();
    await certificationCompletedJobController.handle({
      data: {
        assessmentId: assessment.id,
        locale,
      },
    });

    // then
    const { count: assessmentResultCount } = await knex('assessment-results')
      .where({ assessmentId: assessment.id })
      .count()
      .first();

    expect(assessmentResultCount).to.equal(1);

    const certificationCourseAfterUpdate = await knex('certification-courses')
      .where({ id: certificationCourse.id })
      .first();
    expect(certificationCourseAfterUpdate.completedAt).to.not.be.null;
  });
});
