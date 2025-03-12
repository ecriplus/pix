import { authenticationController } from '../../../../lib/application/authentication/authentication-controller.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import { RequestedApplication } from '../../../../src/identity-access-management/infrastructure/utils/network.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Application | Controller | Authentication', function () {
  describe('#authenticateExternalUser', function () {
    it('returns an access token', async function () {
      // given
      const accessToken = 'jwt.access.token';
      const user = {
        username: 'saml.jackson1234',
        password: 'Pix123',
      };
      const externalUserToken = 'SamlJacksonToken';
      const expectedUserId = 1;
      const audience = 'https://app.pix.fr';
      const requestedApplication = new RequestedApplication('app');

      const request = {
        headers: {
          'x-forwarded-proto': 'https',
          'x-forwarded-host': 'app.pix.fr',
        },
        payload: {
          data: {
            attributes: {
              username: user.username,
              password: user.password,
              'external-user-token': externalUserToken,
              'expected-user-id': expectedUserId,
            },
            type: 'external-user-authentication-requests',
          },
        },
      };

      sinon
        .stub(usecases, 'authenticateExternalUser')
        .withArgs({
          username: user.username,
          password: user.password,
          externalUserToken,
          expectedUserId,
          audience,
          requestedApplication,
        })
        .resolves(accessToken);

      // when
      const response = await authenticationController.authenticateExternalUser(request, hFake);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.source.data.attributes['access-token']).to.equal(accessToken);
    });
  });
});
