import { getCertificate } from '../../../../../../src/certification/results/domain/usecases/get-certificate.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | get-certificate', function () {
  let certificateRepository, certificationCourseRepository;

  beforeEach(function () {
    certificateRepository = { getCertificate: sinon.stub() };
    certificationCourseRepository = { get: sinon.stub() };
  });

  it('should return the certificate enhanced with result competence tree', async function () {
    // given
    const locale = 'fr';

    const resultCompetenceTree = domainBuilder.buildResultCompetenceTree({ id: 'myResultTreeId' });
    const certificationAttestation = domainBuilder.buildCertificationAttestation({
      id: 123,
      resultCompetenceTree,
    });
    const certificationCourse = domainBuilder.buildCertificationCourse({ id: 123 });
    certificationCourseRepository.get.withArgs({ id: 123 }).resolves(certificationCourse);
    certificateRepository.getCertificate
      .withArgs({ certificationCourseId: 123, locale })
      .resolves(certificationAttestation);

    // when
    const actualCertificate = await getCertificate({
      certificationCourseId: 123,
      locale,
      certificateRepository,
      certificationCourseRepository,
    });

    // then
    const expectedCertificate = domainBuilder.buildCertificationAttestation({
      id: 123,
      resultCompetenceTree,
    });
    expect(actualCertificate).to.deep.equal(expectedCertificate);
  });
});
