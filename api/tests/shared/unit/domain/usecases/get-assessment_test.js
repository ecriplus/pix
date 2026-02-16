import { Assessment } from '../../../../../src/shared/domain/models/Assessment.js';
import { getAssessment } from '../../../../../src/shared/domain/usecases/get-assessment.js';
import { domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | UseCase | get-assessment', function () {
  let assessment;
  let assessmentRepository;
  const certificationCourseId = 1;

  beforeEach(function () {
    assessment = domainBuilder.buildAssessment({
      type: Assessment.types.PREVIEW,
      certificationCourseId,
    });

    assessmentRepository = { getWithAnswers: sinon.stub() };
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
});
