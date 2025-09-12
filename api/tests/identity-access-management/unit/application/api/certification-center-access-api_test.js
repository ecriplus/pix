import sinon from 'sinon';

import { getCertificationCenterAccess } from '../../../../../src/identity-access-management/application/api/certification-center-access-api.js';
import { AllowedCertificationCenterAccessDTO } from '../../../../../src/identity-access-management/application/api/models/AllowedCertificationCenterAccessDTO.js';
import { config as settings } from '../../../../../src/shared/config.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Application | API | Certification Center Access', function () {
  describe('#getCertificationCenterAccess', function () {
    let pixCertifBlockedAccessUntilDateBeforeTest;

    beforeEach(function () {
      pixCertifBlockedAccessUntilDateBeforeTest = settings.features.pixCertifBlockedAccessUntilDate;
    });

    afterEach(function () {
      settings.features.pixCertifBlockedAccessUntilDate = pixCertifBlockedAccessUntilDateBeforeTest;
    });

    it('should return certification center access DTO', async function () {
      // given
      const certificationPointOfContactRepository = {
        getCertificationCenterAccess: sinon.stub(),
      };
      const certificationCenterId = 123;
      const allowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
        id: certificationCenterId,
      });
      const date = '2022-10-10';
      sinon.stub(settings.features, 'pixCertifBlockedAccessUntilDate').value(date);

      certificationPointOfContactRepository.getCertificationCenterAccess
        .withArgs({ certificationCenterId })
        .resolves(allowedCertificationCenterAccess);

      // when
      const certificationCenterAccess = await getCertificationCenterAccess({
        certificationCenterId,
        dependencies: { certificationPointOfContactRepository },
      });

      // then
      const expectedCertificationCenterAccessDTO = new AllowedCertificationCenterAccessDTO({
        isAccessBlockedUntilDate: false,
        pixCertifBlockedAccessUntilDate: date,
      });
      expect(certificationCenterAccess).to.deep.equal(expectedCertificationCenterAccessDTO);
    });
  });
});
