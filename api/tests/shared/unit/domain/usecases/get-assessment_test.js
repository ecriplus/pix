import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { Assessment } from '../../../../../src/shared/domain/models/index.js';
import { getAssessment } from '../../../../../src/shared/domain/usecases/get-assessment.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | UseCase | get-assessment', function () {
  let assessment;
  let competence;
  let course;
  let assessmentRepository;
  let competenceRepository;
  let courseRepository;
  let certificationChallengeLiveAlertRepository;
  let certificationCompanionAlertRepository;
  const certificationCourseId = 1;
  const expectedCourseName = 'Course Àpieds';
  const expectedAssessmentTitle = 'Traiter des données';

  beforeEach(function () {
    competence = domainBuilder.buildCompetence({ id: 'recsvLz0W2ShyfD63', name: expectedAssessmentTitle });
    course = domainBuilder.buildCourse({ id: 'ABC123', name: expectedCourseName });

    assessment = domainBuilder.buildAssessment({
      type: Assessment.types.PREVIEW,
      competenceId: competence.id,
      courseId: course.id,
      certificationCourseId,
    });

    assessmentRepository = { getWithAnswers: sinon.stub() };
    competenceRepository = { getCompetenceName: sinon.stub() };
    courseRepository = { get: sinon.stub() };
    certificationChallengeLiveAlertRepository = { getByAssessmentId: sinon.stub() };
    certificationCompanionAlertRepository = { getAllByAssessmentId: sinon.stub() };
  });

  it('should resolve the Assessment domain object matching the given assessment ID', async function () {
    // given
    assessmentRepository.getWithAnswers.resolves(assessment);

    // when
    const result = await getAssessment({
      assessmentId: assessment.id,
      assessmentRepository,
      competenceRepository,
      courseRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
  });

  it('should resolve the Assessment domain object with COMPETENCE_EVALUATION title matching the given assessment ID', async function () {
    // given
    const locale = 'fr';
    assessment.type = Assessment.types.COMPETENCE_EVALUATION;
    assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
    competenceRepository.getCompetenceName.withArgs({ id: assessment.competenceId, locale }).resolves(competence.name);

    // when
    const result = await getAssessment({
      assessmentId: assessment.id,
      locale,
      assessmentRepository,
      competenceRepository,
      courseRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
    expect(result.title).to.equal(expectedAssessmentTitle);
  });

  context('Assessment of type DEMO', function () {
    it('should resolve the Assessment domain object with DEMO title matching the given assessment ID when course is playable', async function () {
      // given
      const playableCourse = domainBuilder.buildCourse({ name: 'Course Àpieds', isActive: true });
      assessment.type = Assessment.types.DEMO;
      assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
      courseRepository.get.withArgs(assessment.courseId).resolves(playableCourse);

      // when
      const result = await getAssessment({
        assessmentId: assessment.id,
        assessmentRepository,
        competenceRepository,
        courseRepository,
      });

      // then
      expect(result).to.be.an.instanceOf(Assessment);
      expect(result.id).to.equal(assessment.id);
      expect(result.title).to.equal(course.name);
    });

    it('should throw a NotFoundError when course is not playable', async function () {
      // given
      const unplayableCourse = domainBuilder.buildCourse({ name: 'Course Àpieds', isActive: false });
      assessment.type = Assessment.types.DEMO;
      assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
      courseRepository.get.withArgs(assessment.courseId).resolves(unplayableCourse);

      // when
      const err = await catchErr(getAssessment)({
        assessmentId: assessment.id,
        assessmentRepository,
        competenceRepository,
        courseRepository,
      });

      // then
      expect(err).to.be.an.instanceOf(NotFoundError);
      expect(err.message).to.equal("Le test demandé n'existe pas");
    });
  });

  context('Assessment of type CERTIFICATION', function () {
    beforeEach(function () {
      assessment.type = Assessment.types.CERTIFICATION;
    });

    it('should resolve the corresponding Assessment matching the given assessment ID', async function () {
      // given
      assessmentRepository.getWithAnswers.resolves(assessment);
      const certificationChallengeLiveAlert = domainBuilder.buildCertificationChallengeLiveAlert({
        assessmentId: assessment.id,
      });
      const certificationCompanionLiveAlert = domainBuilder.buildCertificationCompanionLiveAlert({
        assessmentId: assessment.id,
      });
      certificationChallengeLiveAlertRepository.getByAssessmentId
        .withArgs({ assessmentId: assessment.id })
        .resolves([certificationChallengeLiveAlert]);
      certificationCompanionAlertRepository.getAllByAssessmentId
        .withArgs({ assessmentId: assessment.id })
        .resolves([certificationCompanionLiveAlert]);

      // when
      const result = await getAssessment({
        assessmentId: assessment.id,
        assessmentRepository,
        competenceRepository,
        courseRepository,
        certificationChallengeLiveAlertRepository,
        certificationCompanionAlertRepository,
      });

      // then
      expect(result).to.be.an.instanceOf(Assessment);
      expect(result.id).to.equal(assessment.id);
      expect(result.challengeLiveAlerts).to.deep.equal([certificationChallengeLiveAlert]);
      expect(result.companionLiveAlerts).to.deep.equal([certificationCompanionLiveAlert]);
    });
  });
});
