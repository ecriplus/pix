import { getCertificationCourse } from '../../../../../../src/certification/evaluation/domain/usecases/get-certification-course.js';
import { AlgorithmEngineVersion } from '../../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | get-certification-course', function () {
  let certificationCourse;
  let version;

  let certificationCourseRepository;
  let versionRepository;

  beforeEach(function () {
    certificationCourse = domainBuilder.buildCertificationCourse({
      id: 'certification_course_id',
      sessionId: 'session_id',
      userId: 'user_id',
      version: AlgorithmEngineVersion.V3,
      versionId: 123,
    });

    certificationCourseRepository = {
      get: sinon.stub(),
    };

    versionRepository = {
      getById: sinon.stub(),
    };

    version = domainBuilder.certification.shared.buildVersion({
      id: 123,
      challengesConfiguration: { maximumAssessmentLength: 42 },
    });
  });

  it('should get the certificationCourse with numberOfChallenges from version', async function () {
    certificationCourseRepository.get.withArgs({ id: certificationCourse.getId() }).resolves(certificationCourse);
    versionRepository.getById.resolves(version);

    const actualCertificationCourse = await getCertificationCourse({
      certificationCourseId: certificationCourse.getId(),
      certificationCourseRepository,
      versionRepository,
    });

    expect(certificationCourseRepository.get).to.have.been.calledOnceWithExactly({
      id: certificationCourse.getId(),
    });
    expect(versionRepository.getById).to.have.been.calledOnceWithExactly(123);
    expect(actualCertificationCourse.getNumberOfChallenges()).to.equal(42);
    expect(actualCertificationCourse.getId()).to.equal(certificationCourse.getId());
  });
});
