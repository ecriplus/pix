import { ltiPlatformRegistrationRepository } from '../../../../../src/identity-access-management/infrastructure/repositories/lti-platform-registration.repository.js';
import { cryptoService } from '../../../../../src/shared/domain/services/crypto-service.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Identity Access Management | Infrastructure | Repository | lti-platform-registration', function () {
  describe('#findByClientId', function () {
    it('should return LTI platform registration information', async function () {
      // given
      const clientId = 'AbCD1234';
      const expectedLtiPlatformRegistration = domainBuilder.identityAccessManagement.buildLtiPlatformRegistration();

      databaseBuilder.factory.buildLtiPlatformRegistration(expectedLtiPlatformRegistration);
      await databaseBuilder.commit();

      // when
      const registration = await ltiPlatformRegistrationRepository.findByClientId(clientId);

      // then
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

  describe('#listActivePublicKeys', function () {
    it('should return the list of public keys of the active platforms', async function () {
      // given
      databaseBuilder.factory.buildLtiPlatformRegistration({
        clientId: 'client1',
        status: 'pending',
      });
      const keyPair1 = await cryptoService.generateJSONWebKeyPair({ modulusLength: 2048 });
      databaseBuilder.factory.buildLtiPlatformRegistration({
        clientId: 'client2',
        publicKey: keyPair1.publicKey,
      });
      const keyPair2 = await cryptoService.generateJSONWebKeyPair({ modulusLength: 2048 });
      databaseBuilder.factory.buildLtiPlatformRegistration({
        clientId: 'client3',
        publicKey: keyPair2.publicKey,
      });
      await databaseBuilder.commit();

      // when
      const keys = await ltiPlatformRegistrationRepository.listActivePublicKeys();

      // then
      expect(keys).to.deep.contain.members([keyPair1.publicKey, keyPair2.publicKey]);
    });
  });
});
