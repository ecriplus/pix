import { getCertificationResult } from '../../../../../src/parcoursup/domain/usecases/get-certification-result.js';
import { domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Parcoursup | unit | domain | usecases | get certification', function () {
  describe('#getCertification', function () {
    it('returns certification', async function () {
      // given
      const ine = '1234';
      const certificationRepository = {
        get: sinon.stub(),
      };

      const expectedCertification = domainBuilder.parcoursup.buildCertificationResult({ ine });
      certificationRepository.get.withArgs({ ine }).resolves(expectedCertification);

      // when
      const certification = await getCertificationResult({ ine, certificationRepository });

      // then
      expect(certification).to.deep.equal(expectedCertification);
    });
    context('with organizationUai, last name, first name and birthdate', function () {
      it('returns matching certification', async function () {
        // given
        const organizationUai = '1234567A';
        const lastName = 'LEPONGE';
        const firstName = 'Bob';
        const birthdate = '2000-01-01';
        const certificationRepository = {
          getByStudentDetails: sinon.stub(),
        };

        const expectedCertification = domainBuilder.parcoursup.buildCertificationResult({
          organizationUai,
          lastName,
          firstName,
          birthdate,
        });
        certificationRepository.getByStudentDetails
          .withArgs({
            organizationUai,
            lastName,
            firstName,
            birthdate,
          })
          .resolves(expectedCertification);

        // when
        const certification = await getCertificationResult({
          organizationUai,
          lastName,
          firstName,
          birthdate,
          certificationRepository,
        });

        // then
        expect(certification).to.deep.equal(expectedCertification);
      });
    });
  });
});
