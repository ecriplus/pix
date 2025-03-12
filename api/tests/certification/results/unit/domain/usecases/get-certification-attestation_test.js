import { getCertificationAttestation } from '../../../../../../src/certification/results/domain/usecases/get-certification-attestation.js';
import { UnauthorizedError } from '../../../../../../src/shared/application/http-errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | get-certification-attestation', function () {
  let certificateRepository, certificationCourseRepository;

  beforeEach(function () {
    certificateRepository = { getCertificationAttestation: sinon.stub() };
    certificationCourseRepository = { get: sinon.stub() };
  });

  context('when the user is not owner of the certification attestation', function () {
    it('should throw an error', async function () {
      // given
      const certificationCourse = domainBuilder.buildCertificationCourse({
        id: 123,
        userId: 567,
      });
      certificationCourseRepository.get.withArgs({ id: 123 }).resolves(certificationCourse);

      // when
      const error = await catchErr(getCertificationAttestation)({
        certificationCourseId: 123,
        userId: 789,
        certificateRepository,
        certificationCourseRepository,
      });

      // then
      expect(error).to.be.instanceOf(UnauthorizedError);
    });
  });

  context('when the user is owner of the certification attestation', function () {
    it('should return the certification attestation enhanced with result competence tree', async function () {
      // given
      const resultCompetenceTree = domainBuilder.buildResultCompetenceTree({ id: 'myResultTreeId' });
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        id: 123,
        userId: 456,
        resultCompetenceTree,
      });
      const certificationCourse = domainBuilder.buildCertificationCourse({
        id: 123,
        userId: 456,
      });
      certificationCourseRepository.get.withArgs({ id: 123 }).resolves(certificationCourse);
      certificateRepository.getCertificationAttestation
        .withArgs({ certificationCourseId: 123 })
        .resolves(certificationAttestation);

      // when
      const actualCertificationAttestation = await getCertificationAttestation({
        certificationCourseId: 123,
        userId: 456,
        certificateRepository,
        certificationCourseRepository,
      });

      // then
      const expectedCertificationAttestation = domainBuilder.buildCertificationAttestation({
        id: 123,
        userId: 456,
        resultCompetenceTree,
      });
      expect(actualCertificationAttestation).to.deep.equal(expectedCertificationAttestation);
    });
  });
});
