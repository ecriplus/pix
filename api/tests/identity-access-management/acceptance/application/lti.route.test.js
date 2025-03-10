import { cryptoService } from '../../../../src/shared/domain/services/crypto-service.js';
import { createServer, databaseBuilder, expect } from '../../../test-helper.js';

describe('Acceptance | Identity Access Management | Route | Admin | lti', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/lti/keys', function () {
    it('returns the list of all active public keys with an HTTP status code 200', async function () {
      // given
      const { publicKey } = databaseBuilder.factory.buildLtiPlatformRegistration();
      const keyPair2 = await cryptoService.generateRSAJSONWebKeyPair({ modulusLength: 512 });
      databaseBuilder.factory.buildLtiPlatformRegistration({
        clientId: 'pending_client',
        status: 'pending',
        publicKey: keyPair2.publicKey,
      });
      await databaseBuilder.commit();
      const options = {
        method: 'GET',
        url: '/api/lti/keys',
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal([publicKey]);
    });
  });
});
