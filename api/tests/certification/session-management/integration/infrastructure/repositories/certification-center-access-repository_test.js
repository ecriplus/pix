import sinon from 'sinon';

import { repositories } from '../../../../../../src/certification/session-management/infrastructure/repositories/index.js';
import { config as settings } from '../../../../../../src/shared/config.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Session Management | Integration | Infrastructure | Repository | certification center access', function () {
  describe('#getCertificationCenterAccess', function () {
    let pixCertifBlockedAccessUntilDateBeforeTest;

    beforeEach(function () {
      pixCertifBlockedAccessUntilDateBeforeTest = settings.features.pixCertifBlockedAccessUntilDate;
    });

    afterEach(function () {
      settings.features.pixCertifBlockedAccessUntilDate = pixCertifBlockedAccessUntilDateBeforeTest;
    });

    it('should return the certification center access information', async function () {
      // given
      const date = '2022-10-10';
      sinon.stub(settings.features, 'pixCertifBlockedAccessUntilDate').value(date);
      const certificationCenter = databaseBuilder.factory.buildCertificationCenter();

      await databaseBuilder.commit();

      // when
      const certificationCenterAccess =
        await repositories.certificationCenterAccessRepository.getCertificationCenterAccess({
          certificationCenterId: certificationCenter.id,
        });

      // then
      expect(certificationCenterAccess).to.deep.equal({
        isAccessBlockedUntilDate: false,
        pixCertifBlockedAccessUntilDate: '2022-10-10',
      });
    });
  });
});
