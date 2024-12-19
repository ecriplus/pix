import * as certificationRepository from '../../../../../api/src/parcoursup/infrastructure/repositories/certification-repository.js';
import { domainBuilder, expect } from '../../../test-helper.js';

describe('Parcoursup | Infrastructure | Integration | Repositories | certification', function () {
  describe('#get', function () {
    describe('when a certification is found', function () {
      it('should return the certification', async function () {
        // given
        const ine = '1234';

        // when
        const result = await certificationRepository.get({
          ine,
        });

        // then
        const expectedCertification = domainBuilder.parcoursup.buildCertificationResult({ ine });
        expect(result).to.deep.equal(expectedCertification);
      });
    });
  });
});
