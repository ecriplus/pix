import { CertificationCourseRejected } from '../../../../../../src/certification/session-management/domain/events/CertificationCourseRejected.js';
import { rejectCertificationCourse } from '../../../../../../src/certification/session-management/domain/usecases/reject-certification-course.js';
import { AlgorithmEngineVersion } from '../../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { CertificationCourse } from '../../../../../../src/certification/shared/domain/models/CertificationCourse.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | reject-certification-course', function () {
  describe('when certification is a V2', function () {
    it('should reject a newly created assessment result', async function () {
      // given
      const certificationCourseRepository = { get: sinon.stub(), update: sinon.stub() };
      const certificationRescoringRepository = { rescoreV2Certification: sinon.stub() };
      const juryId = 123;

      const dependencies = {
        certificationCourseRepository,
        certificationRescoringRepository,
      };
      const certificationCourse = domainBuilder.buildCertificationCourse({ version: AlgorithmEngineVersion.V2 });
      const certificationCourseId = certificationCourse.getId();

      certificationCourseRepository.get.withArgs({ id: certificationCourseId }).resolves(certificationCourse);
      certificationCourseRepository.update.resolves();
      certificationRescoringRepository.rescoreV2Certification.resolves();

      // when
      await rejectCertificationCourse({
        ...dependencies,
        juryId,
        certificationCourseId: certificationCourseId,
      });

      // then
      const expectedCertificationCourse = new CertificationCourse({
        ...certificationCourse.toDTO(),
        isRejectedForFraud: true,
      });

      expect(certificationCourseRepository.update).to.have.been.calledWithExactly({
        certificationCourse: expectedCertificationCourse,
      });

      expect(certificationRescoringRepository.rescoreV2Certification).to.have.been.calledOnceWithExactly({
        event: new CertificationCourseRejected({
          certificationCourseId,
          juryId,
        }),
      });
    });
  });

  describe('when certification is a V3', function () {
    it('should reject a newly created assessment result', async function () {
      // given
      const certificationCourseRepository = { get: sinon.stub(), update: sinon.stub() };
      const certificationRescoringRepository = { rescoreV3Certification: sinon.stub() };
      const juryId = 123;

      const dependencies = {
        certificationCourseRepository,
        certificationRescoringRepository,
      };
      const certificationCourse = domainBuilder.buildCertificationCourse({ version: AlgorithmEngineVersion.V3 });
      const certificationCourseId = certificationCourse.getId();

      certificationCourseRepository.get.withArgs({ id: certificationCourseId }).resolves(certificationCourse);
      certificationCourseRepository.update.resolves();
      certificationRescoringRepository.rescoreV3Certification.resolves();

      // when
      await rejectCertificationCourse({
        ...dependencies,
        juryId,
        certificationCourseId: certificationCourseId,
      });

      // then
      const expectedCertificationCourse = new CertificationCourse({
        ...certificationCourse.toDTO(),
        isRejectedForFraud: true,
      });

      expect(certificationCourseRepository.update).to.have.been.calledWithExactly({
        certificationCourse: expectedCertificationCourse,
      });

      expect(certificationRescoringRepository.rescoreV3Certification).to.have.been.calledOnceWithExactly({
        event: new CertificationCourseRejected({
          certificationCourseId,
          juryId,
        }),
      });
    });
  });
});
