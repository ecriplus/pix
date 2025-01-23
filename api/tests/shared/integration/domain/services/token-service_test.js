import { config as settings } from '../../../../../src/shared/config.js';
import { tokenService } from '../../../../../src/shared/domain/services/token-service.js';
import { expect } from '../../../../test-helper.js';

describe('Integration | Shared | Domain | Services | Token Service', function () {
  describe('#createAccessTokenForSaml', function () {
    it('should return a valid json web token', function () {
      // given
      const userId = 123;
      const audience = 'https://app.pix.fr';

      // when
      const result = tokenService.createAccessTokenForSaml({ userId, audience });

      // then
      const token = tokenService.getDecodedToken(result);
      expect(token).to.include({ source: 'external', user_id: userId, aud: audience });

      const expirationDelaySeconds = token.exp - token.iat;
      const expectedExpirationDelaySeconds = settings.saml.accessTokenLifespanMs / 1000;
      expect(expirationDelaySeconds).to.equal(expectedExpirationDelaySeconds);
    });
  });
});
