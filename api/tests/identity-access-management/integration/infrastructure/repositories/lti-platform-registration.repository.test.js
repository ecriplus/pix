import { ltiPlatformRegistrationRepository } from '../../../../../src/identity-access-management/infrastructure/repositories/lti-platform-registration.repository.js';
import { databaseBuilder, domainBuilder, expect, nock } from '../../../../test-helper.js';

describe('Integration | Identity Access Management | Infrastructure | Repository | lti-platform-registration', function () {
  describe('#findByClientId', function () {
    it('should return LTI platform registration information', async function () {
      // given
      const clientId = 'AbCD1234';
      const expectedLtiPlatformRegistration = domainBuilder.identityAccessManagement.buildLtiPlatformRegistration();

      const savedLtiPlatformRegistration = databaseBuilder.factory.buildLtiPlatformRegistration(
        expectedLtiPlatformRegistration,
      );
      await databaseBuilder.commit();

      const platformOpenIdConfigUrl = new URL(savedLtiPlatformRegistration.platformOpenIdConfigUrl);
      const platformOpenIdConfigCall = nock(platformOpenIdConfigUrl.origin)
        .get(platformOpenIdConfigUrl.pathname)
        .reply(200, expectedLtiPlatformRegistration.platformOpenIdConfig);

      // when
      const registration = await ltiPlatformRegistrationRepository.findByClientId(clientId);

      // then
      expect(platformOpenIdConfigCall.isDone()).to.be.true;
      expect(registration).to.deepEqualInstance(expectedLtiPlatformRegistration);
    });

    it('should return null when no LTI platforms are found', async function () {
      // given
      const clientId = 'NOT-FOUND';

      // when
      const registration = await ltiPlatformRegistrationRepository.findByClientId(clientId);

      // then
      expect(registration).to.be.null;
    });
  });
});
