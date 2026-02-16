import { Assessment } from '../../../../../src/shared/domain/models/Assessment.js';
import { getAssessment } from '../../../../../src/shared/domain/usecases/get-assessment.js';
import { domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | UseCase | get-assessment', function () {
  let assessment;
  let assessmentRepository;
  let certificationChallengeLiveAlertRepository;
  let certificationCompanionAlertRepository;
  const certificationCourseId = 1;

  beforeEach(function () {
    assessment = domainBuilder.buildAssessment({
      type: Assessment.types.PREVIEW,
      certificationCourseId,
    });

    assessmentRepository = { getWithAnswers: sinon.stub() };
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
    });

    // then
    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
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
