import { NON_OIDC_IDENTITY_PROVIDERS } from '../../../../src/identity-access-management/domain/constants/identity-providers.js';
import { decodeIfValid, tokenService } from '../../../../src/shared/domain/services/token-service.js';
import { createServer, databaseBuilder, expect, knex } from '../../../test-helper.js';

describe('Acceptance | Controller | authentication-controller', function () {
  describe('POST /api/token-from-external-user', function () {
    let server;

    beforeEach(async function () {
      server = await createServer();
    });

    describe('when user has a reconciled Pix account, then connect to Pix from GAR', function () {
      it('should return a 200 with accessToken', async function () {
        // given
        const password = 'Pix123';
        const userAttributes = {
          firstName: 'saml',
          lastName: 'jackson',
          samlId: 'SAMLJACKSONID',
        };
        const user = databaseBuilder.factory.buildUser.withRawPassword({
          username: 'saml.jackson1234',
          rawPassword: password,
        });
        const expectedExternalToken = tokenService.createIdTokenForUserReconciliation(userAttributes);

        const options = {
          method: 'POST',
          url: '/api/token-from-external-user',
          headers: {
            'x-forwarded-proto': 'https',
            'x-forwarded-host': 'app.pix.fr',
          },
          payload: {
            data: {
              attributes: {
                username: user.username,
                password: password,
                'external-user-token': expectedExternalToken,
                'expected-user-id': user.id,
              },
              type: 'external-user-authentication-requests',
            },
          },
        };

        await databaseBuilder.commit();

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['access-token']).to.exist;
        const decodedAccessToken = await decodeIfValid(response.result.data.attributes['access-token']);
        expect(decodedAccessToken).to.include({
          aud: 'https://app.pix.fr',
        });
      });

      it('should add GAR authentication method', async function () {
        // given
        const password = 'Pix123';
        const userAttributes = {
          firstName: 'saml',
          lastName: 'jackson',
          samlId: 'SAMLJACKSONID',
        };
        const user = databaseBuilder.factory.buildUser.withRawPassword({
          username: 'saml.jackson1234',
          rawPassword: password,
        });
        const expectedExternalToken = tokenService.createIdTokenForUserReconciliation(userAttributes);

        const options = {
          method: 'POST',
          url: '/api/token-from-external-user',
          headers: {
            'x-forwarded-proto': 'https',
            'x-forwarded-host': 'app.pix.fr',
          },
          payload: {
            data: {
              attributes: {
                username: user.username,
                password: password,
                'external-user-token': expectedExternalToken,
                'expected-user-id': user.id,
              },
              type: 'external-user-authentication-requests',
            },
          },
        };

        await databaseBuilder.commit();

        // when
        await server.inject(options);

        // then
        const authenticationMethods = await knex('authentication-methods').where({
          identityProvider: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
          userId: user.id,
          externalIdentifier: 'SAMLJACKSONID',
        });
        expect(authenticationMethods).to.have.lengthOf(1);
        expect(authenticationMethods[0].authenticationComplement).to.deep.equal({
          firstName: 'saml',
          lastName: 'jackson',
        });
      });
    });
  });
});
