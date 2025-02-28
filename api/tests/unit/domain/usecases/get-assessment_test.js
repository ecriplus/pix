import { getAssessment } from '../../../../lib/domain/usecases/get-assessment.js';
import { CertificationChallengeLiveAlertStatus } from '../../../../src/certification/shared/domain/models/CertificationChallengeLiveAlert.js';
import { NotFoundError } from '../../../../src/shared/domain/errors.js';
import { Assessment, CampaignTypes } from '../../../../src/shared/domain/models/index.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../test-helper.js';

describe('Unit | UseCase | get-assessment', function () {
  let assessment;
  let competence;
  let course;
  let assessmentRepository;
  let campaignRepository;
  let competenceRepository;
  let courseRepository;
  let certificationChallengeLiveAlertRepository;
  let certificationCompanionAlertRepository;

  const certificationCourseId = 1;

  const expectedCampaignTitle = 'Campagne Il';
  const expectedCampaignCode = 'CAMPAIGN1';
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
    campaignRepository = {
      get: sinon.stub(),
      getCampaignIdByCampaignParticipationId: sinon.stub(),
    };
    competenceRepository = { getCompetenceName: sinon.stub() };
    courseRepository = { getCourseName: sinon.stub(), get: sinon.stub() };
    certificationChallengeLiveAlertRepository = { getByAssessmentId: sinon.stub() };
    certificationCompanionAlertRepository = { getAllByAssessmentId: sinon.stub() };
    campaignRepository.get.rejects(new Error('I should not be called'));
    campaignRepository.getCampaignIdByCampaignParticipationId.rejects(new Error('I should not be called'));
  });

  it('should resolve the Assessment domain object matching the given assessment ID', async function () {
    // given
    assessmentRepository.getWithAnswers.resolves(assessment);

    // when
    const result = await getAssessment({
      assessmentId: assessment.id,
      assessmentRepository,
      campaignRepository,
      competenceRepository,
      courseRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
  });

  it('should resolve the Assessment domain object with COMPETENCE_EVALUATION title matching the given assessment ID, along with hasCheckpoints and showProgressBar', async function () {
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
      campaignRepository,
      competenceRepository,
      courseRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
    expect(result.title).to.equal(expectedAssessmentTitle);
    expect(result.hasCheckpoints).to.equal(true);
    expect(result.showProgressBar).to.equal(true);
    expect(result.showLevelup).to.equal(true);
  });

  context('Assessment of type DEMO', function () {
    it('should resolve the Assessment domain object with DEMO title matching the given assessment ID when course is playable, along with hasCheckpoints and showProgressBar', async function () {
      // given
      const playableCourse = domainBuilder.buildCourse({ name: 'Course Àpieds', isActive: true });
      assessment.type = Assessment.types.DEMO;
      assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
      courseRepository.getCourseName.withArgs(assessment.courseId).resolves(playableCourse.name);
      courseRepository.get.withArgs(assessment.courseId).resolves(playableCourse);

      // when
      const result = await getAssessment({
        assessmentId: assessment.id,
        assessmentRepository,
        campaignRepository,
        competenceRepository,
        courseRepository,
      });

      // then
      expect(result).to.be.an.instanceOf(Assessment);
      expect(result.id).to.equal(assessment.id);
      expect(result.title).to.equal(course.name);
      expect(result.hasCheckpoints).to.equal(false);
      expect(result.showProgressBar).to.equal(true);
      expect(result.showLevelup).to.equal(false);
    });

    it('should throw a NotFoundError when course is not playable', async function () {
      // given
      const unplayableCourse = domainBuilder.buildCourse({ name: 'Course Àpieds', isActive: false });
      assessment.type = Assessment.types.DEMO;
      assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
      courseRepository.getCourseName.withArgs(assessment.courseId).resolves(unplayableCourse.name);
      courseRepository.get.withArgs(assessment.courseId).resolves(unplayableCourse);

      // when
      const err = await catchErr(getAssessment)({
        assessmentId: assessment.id,
        assessmentRepository,
        campaignRepository,
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

    it('should resolve the Assessment domain object with CERTIFICATION title matching the given assessment ID, along with hasCheckpoints and showProgressBar', async function () {
      // given
      assessmentRepository.getWithAnswers.resolves(assessment);
      certificationChallengeLiveAlertRepository.getByAssessmentId.withArgs(assessment.id).resolves([]);

      // when
      const result = await getAssessment({
        assessmentId: assessment.id,
        assessmentRepository,
        campaignRepository,
        competenceRepository,
        courseRepository,
        certificationChallengeLiveAlertRepository,
        certificationCompanionAlertRepository,
      });

      // then
      expect(result).to.be.an.instanceOf(Assessment);
      expect(result.id).to.equal(assessment.id);
      expect(result.title).to.equal(certificationCourseId);
      expect(result.hasCheckpoints).to.equal(false);
      expect(result.showProgressBar).to.equal(false);
      expect(result.showLevelup).to.equal(false);
    });

    context('when no liveAlert is attached to the assessment', function () {
      it('should set hasOngoingChallengeLiveAlert to false', async function () {
        // given
        assessment.type = Assessment.types.CERTIFICATION;
        assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
        certificationChallengeLiveAlertRepository.getByAssessmentId.withArgs(assessment.id).resolves([]);
        // when
        const result = await getAssessment({
          assessmentId: assessment.id,
          assessmentRepository,
          certificationChallengeLiveAlertRepository,
          certificationCompanionAlertRepository,
        });

        // then
        expect(result.hasOngoingChallengeLiveAlert).to.equal(false);
      });
    });

    context('when a liveAlert is attached to the assessment', function () {
      context('when a live alert is ongoing', function () {
        it('should set hasOngoingChallengeLiveAlert to true', async function () {
          // given
          assessment.type = Assessment.types.CERTIFICATION;
          assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
          const ongoingLiveAlert = domainBuilder.buildCertificationChallengeLiveAlert({
            assessmentId: assessment.id,
          });
          certificationChallengeLiveAlertRepository.getByAssessmentId
            .withArgs({ assessmentId: assessment.id })
            .resolves([ongoingLiveAlert]);

          // when
          const result = await getAssessment({
            assessmentId: assessment.id,
            assessmentRepository,
            certificationChallengeLiveAlertRepository,
            certificationCompanionAlertRepository,
          });

          // then
          expect(result.hasOngoingChallengeLiveAlert).to.equal(true);
        });
      });

      context('when live alerts have been dismissed', function () {
        it('should set hasOngoingChallengeLiveAlert to false', async function () {
          // given
          assessment.type = Assessment.types.CERTIFICATION;
          assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
          const dismissedLiveAlert = domainBuilder.buildCertificationChallengeLiveAlert({
            assessmentId: assessment.id,
            status: CertificationChallengeLiveAlertStatus.DISMISSED,
          });
          certificationChallengeLiveAlertRepository.getByAssessmentId
            .withArgs(assessment.id)
            .resolves([dismissedLiveAlert]);
          // when
          const result = await getAssessment({
            assessmentId: assessment.id,
            assessmentRepository,
            certificationChallengeLiveAlertRepository,
            certificationCompanionAlertRepository,
          });

          // then
          expect(result.hasOngoingChallengeLiveAlert).to.equal(false);
        });
      });

      context('when live alerts have been accepted', function () {
        it('should set hasOngoingChallengeLiveAlert to false', async function () {
          // given
          assessment.type = Assessment.types.CERTIFICATION;
          assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
          const dismissedLiveAlert = domainBuilder.buildCertificationChallengeLiveAlert({
            assessmentId: assessment.id,
            status: CertificationChallengeLiveAlertStatus.VALIDATED,
          });
          certificationChallengeLiveAlertRepository.getByAssessmentId
            .withArgs(assessment.id)
            .resolves([dismissedLiveAlert]);
          // when
          const result = await getAssessment({
            assessmentId: assessment.id,
            assessmentRepository,
            certificationChallengeLiveAlertRepository,
            certificationCompanionAlertRepository,
          });

          // then
          expect(result.hasOngoingChallengeLiveAlert).to.equal(false);
        });
      });
    });
  });

  context('Assessment of type CAMPAIGN', function () {
    context('when campaign is assessment and assessment is FLASH', function () {
      it('should return the assessment with expected title, hasCheckpoints and showProgressBar', async function () {
        // given
        assessment.type = Assessment.types.CAMPAIGN;
        assessment.method = Assessment.methods.FLASH;
        assessment.campaignParticipationId = 123;
        campaignRepository.getCampaignIdByCampaignParticipationId.withArgs(123).resolves(456);
        campaignRepository.get.withArgs(456).resolves(
          domainBuilder.buildCampaign({
            id: 456,
            type: CampaignTypes.ASSESSMENT,
            title: expectedCampaignTitle,
            code: expectedCampaignCode,
          }),
        );
        assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);

        // when
        const result = await getAssessment({
          assessmentId: assessment.id,
          assessmentRepository,
          campaignRepository,
          competenceRepository,
          courseRepository,
        });

        // then
        expect(result).to.be.an.instanceOf(Assessment);
        expect(result.id).to.equal(assessment.id);
        expect(result.title).to.equal(expectedCampaignTitle);
        expect(result.campaignCode).to.equal(expectedCampaignCode);
        expect(result.hasCheckpoints).to.equal(false);
        expect(result.showProgressBar).to.equal(false);
        expect(result.showLevelup).to.equal(false);
      });
    });
    context('when campaign is assessment and assessment is NOT FLASH', function () {
      it('should return the assessment with expected title, hasCheckpoints and showProgressBar', async function () {
        // given
        assessment.type = Assessment.types.CAMPAIGN;
        assessment.method = Assessment.methods.SMART_RANDOM;
        assessment.campaignParticipationId = 123;
        campaignRepository.getCampaignIdByCampaignParticipationId.withArgs(123).resolves(456);
        campaignRepository.get.withArgs(456).resolves(
          domainBuilder.buildCampaign({
            id: 456,
            type: CampaignTypes.ASSESSMENT,
            title: expectedCampaignTitle,
            code: expectedCampaignCode,
          }),
        );
        assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);

        // when
        const result = await getAssessment({
          assessmentId: assessment.id,
          assessmentRepository,
          campaignRepository,
          competenceRepository,
          courseRepository,
        });

        // then
        expect(result).to.be.an.instanceOf(Assessment);
        expect(result.id).to.equal(assessment.id);
        expect(result.title).to.equal(expectedCampaignTitle);
        expect(result.campaignCode).to.equal(expectedCampaignCode);
        expect(result.hasCheckpoints).to.equal(true);
        expect(result.showProgressBar).to.equal(true);
        expect(result.showLevelup).to.equal(true);
      });
    });
    context('when campaign is exam', function () {
      it('should return the assessment with expected title, hasCheckpoints and showProgressBar', async function () {
        // given
        assessment.type = Assessment.types.CAMPAIGN;
        assessment.method = Assessment.methods.SMART_RANDOM;
        assessment.campaignParticipationId = 123;
        campaignRepository.getCampaignIdByCampaignParticipationId.withArgs(123).resolves(456);
        campaignRepository.get.withArgs(456).resolves(
          domainBuilder.buildCampaign({
            id: 456,
            type: CampaignTypes.EXAM,
            title: expectedCampaignTitle,
            code: expectedCampaignCode,
          }),
        );
        assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);

        // when
        const result = await getAssessment({
          assessmentId: assessment.id,
          assessmentRepository,
          campaignRepository,
          competenceRepository,
          courseRepository,
        });

        // then
        expect(result).to.be.an.instanceOf(Assessment);
        expect(result.id).to.equal(assessment.id);
        expect(result.title).to.equal(expectedCampaignTitle);
        expect(result.campaignCode).to.equal(expectedCampaignCode);
        expect(result.hasCheckpoints).to.equal(true);
        expect(result.showProgressBar).to.equal(true);
        expect(result.showLevelup).to.equal(true);
      });
    });
  });

  it('should resolve the Assessment domain object without title matching the given assessment ID, along with hasCheckpoints and showProgressBar', async function () {
    // given
    assessment.type = 'NO TYPE';
    assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);
    competenceRepository.getCompetenceName.resolves(competence);

    // when
    const result = await getAssessment({
      assessmentId: assessment.id,
      assessmentRepository,
      campaignRepository,
      competenceRepository,
      courseRepository,
    });

    // then
    expect(competenceRepository.getCompetenceName).to.not.have.been.called;

    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
    expect(result.title).to.equal('');
    expect(result.hasCheckpoints).to.equal(false);
    expect(result.showProgressBar).to.equal(false);
    expect(result.showLevelup).to.equal(false);
  });

  it('should resolve the Assessment domain object with Preview title matching the given assessment ID, along with hasCheckpoints and showProgressBar', async function () {
    // given
    assessment.type = Assessment.types.PREVIEW;
    assessmentRepository.getWithAnswers.withArgs(assessment.id).resolves(assessment);

    // when
    const result = await getAssessment({
      assessmentId: assessment.id,
      assessmentRepository,
      campaignRepository,
      competenceRepository,
      courseRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
    expect(result.title).to.equal('Preview');
    expect(result.hasCheckpoints).to.equal(false);
    expect(result.showProgressBar).to.equal(false);
    expect(result.showLevelup).to.equal(false);
  });
});
