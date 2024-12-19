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
  });
});
