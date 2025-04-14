import { getCertificationCourseByVerificationCode } from '../../../../../../src/certification/results/domain/usecases/get-certification-course-by-verification-code.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Certification | Results | Domain | Usecases | get-certification-course-by-verification-code', function () {
  context('when there is a certification course associated with the verification code', function () {
    it('should return the expected certification course', async function () {
      // given
      const expectedCertificate = Symbol('certificate');

      const resultsCertificationCourseRepository = {
        getByVerificationCode: sinon.stub(),
      };

      resultsCertificationCourseRepository.getByVerificationCode
        .withArgs({ verificationCode: 'P-AXAXAXAX' })
        .resolves(expectedCertificate);

      // when
      const certificationCourse = await getCertificationCourseByVerificationCode({
        verificationCode: 'P-AXAXAXAX',
        resultsCertificationCourseRepository,
      });

      // then
      expect(certificationCourse).to.equal(expectedCertificate);
    });
  });
});
