const { sinon, expect, hFake, catchErr } = require('../../../../test-helper');
const authenticationServiceRegistry = require('../../../../../lib/domain/services/authentication/authentication-service-registry');
const oidcController = require('../../../../../lib/application/authentication/oidc/oidc-controller');
const usecases = require('../../../../../lib/domain/usecases');
const settings = require('../../../../../lib/config');
const { UnauthorizedError } = require('../../../../../lib/application/http-errors');

describe('Unit | Application | Controller | Authentication | OIDC', function () {
  const identityProvider = 'OIDC';

  describe('#getRedirectLogoutUrl', function () {
    context('when identity provider is POLE_EMPLOI', function () {
      it('should call pole emploi authentication service to generate the redirect logout url', async function () {
        // given
        const request = {
          auth: { credentials: { userId: '123' } },
          query: {
            identity_provider: identityProvider,
            redirect_uri: 'http://example.net/',
            logout_url_uuid: '1f3dbb71-f399-4c1c-85ae-0a863c78aeea',
          },
        };
        const oidcAuthenticationService = {
          getRedirectLogoutUrl: sinon.stub(),
        };
        sinon
          .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
          .withArgs(identityProvider)
          .returns(oidcAuthenticationService);

        // when
        await oidcController.getRedirectLogoutUrl(request, hFake);

        // then
        expect(authenticationServiceRegistry.lookupAuthenticationService).to.have.been.calledWith(identityProvider);
        expect(oidcAuthenticationService.getRedirectLogoutUrl).to.have.been.calledWith({
          userId: '123',
          logoutUrlUUID: '1f3dbb71-f399-4c1c-85ae-0a863c78aeea',
        });
      });
    });
  });

  describe('#authenticateUser', function () {
    const code = 'ABCD';
    const redirectUri = 'http://redirectUri.fr';
    const stateSent = 'state';
    const stateReceived = 'state';

    const pixAccessToken = 'pixAccessToken';

    let request;

    beforeEach(function () {
      request = {
        auth: { credentials: { userId: 123 } },
        deserializedPayload: {
          identityProvider,
          code,
          redirectUri,
          stateSent,
          stateReceived,
        },
      };

      sinon.stub(usecases, 'authenticateOidcUser');
    });

    it('should authenticate the user with payload parameters', async function () {
      // given
      const oidcAuthenticationService = {};
      sinon
        .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
        .withArgs(identityProvider)
        .returns(oidcAuthenticationService);

      usecases.authenticateOidcUser.resolves({
        pixAccessToken,
        logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
        isAuthenticationComplete: true,
      });

      // when
      await oidcController.authenticateUser(request, hFake);

      // then
      expect(usecases.authenticateOidcUser).to.have.been.calledWith({
        authenticatedUserId: undefined,
        code,
        redirectUri,
        stateReceived,
        stateSent,
        oidcAuthenticationService,
      });
    });

    it('should return PIX access token and logout url uuid when authentication is complete', async function () {
      // given
      const oidcAuthenticationService = {};
      sinon
        .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
        .withArgs(identityProvider)
        .returns(oidcAuthenticationService);
      usecases.authenticateOidcUser.resolves({
        pixAccessToken,
        logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
        isAuthenticationComplete: true,
      });

      // when
      const response = await oidcController.authenticateUser(request, hFake);

      // then
      const expectedResult = {
        access_token: pixAccessToken,
        logout_url_uuid: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
      };
      expect(response).to.deep.equal(expectedResult);
    });

    it('should return UnauthorizedError if pix access token does not exist', async function () {
      // given
      const oidcAuthenticationService = {};
      sinon
        .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
        .withArgs(identityProvider)
        .returns(oidcAuthenticationService);
      const authenticationKey = 'aaa-bbb-ccc';
      usecases.authenticateOidcUser.resolves({ authenticationKey });

      // when
      const error = await catchErr(oidcController.authenticateUser)(request, hFake);

      // then
      expect(error).to.be.an.instanceOf(UnauthorizedError);
      expect(error.message).to.equal("L'utilisateur n'a pas de compte Pix");
      expect(error.code).to.equal('SHOULD_VALIDATE_CGU');
      expect(error.meta).to.deep.equal({ authenticationKey });
    });

    context('when isSsoAccountReconciliationEnabled is false', function () {
      it('should send the authenticated user id for pole emploi', async function () {
        // given
        settings.featureToggles.isSsoAccountReconciliationEnabled = false;
        const identityProvider = 'POLE_EMPLOI';
        const oidcAuthenticationService = {};
        sinon
          .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
          .withArgs(identityProvider)
          .returns(oidcAuthenticationService);
        request.deserializedPayload.identityProvider = identityProvider;

        usecases.authenticateOidcUser.resolves({
          pixAccessToken,
          logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
          isAuthenticationComplete: true,
        });

        // when
        await oidcController.authenticateUser(request, hFake);

        // then
        expect(usecases.authenticateOidcUser).to.have.been.calledWith({
          authenticatedUserId: 123,
          code,
          redirectUri,
          stateReceived,
          stateSent,
          oidcAuthenticationService,
        });
      });
    });

    context('when isSsoAccountReconciliationEnabled is true', function () {
      it('should not send the authenticated user id for pole emploi when toggle is enabled', async function () {
        // given
        settings.featureToggles.isSsoAccountReconciliationEnabled = true;
        const identityProvider = 'POLE_EMPLOI';
        const oidcAuthenticationService = {};
        sinon
          .stub(authenticationServiceRegistry, 'lookupAuthenticationService')
          .withArgs(identityProvider)
          .returns(oidcAuthenticationService);
        request.deserializedPayload.identityProvider = identityProvider;

        usecases.authenticateOidcUser.resolves({
          pixAccessToken,
          logoutUrlUUID: '0208f50b-f612-46aa-89a0-7cdb5fb0d312',
          isAuthenticationComplete: true,
        });

        // when
        await oidcController.authenticateUser(request, hFake);

        // then
        expect(usecases.authenticateOidcUser).to.have.been.calledWith({
          authenticatedUserId: undefined,
          code,
          redirectUri,
          stateReceived,
          stateSent,
          oidcAuthenticationService,
        });
      });
    });
  });
});
