import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Authenticator | oidc', function (hooks) {
  setupTest(hooks);

  module('#authenticate', function (hooks) {
    const userId = 1;
    const source = 'oidc-externe';
    const identityProviderCode = 'OIDC_PARTNER';
    const identityProviderSlug = 'oidc-partner';
    const code = 'code';
    const state = 'state';
    const request = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      data: {
        attributes: {
          identity_provider: identityProviderCode,
          code: code,
          state,
        },
      },
    });
    const accessToken =
      'aaa.' +
      btoa(`{
        "user_id": ${userId},
        "source": "${source}",
        "identity_provider": "${identityProviderCode}",
        "iat": 1545321469,
        "exp": 4702193958
      }`) +
      '.bbb';

    hooks.beforeEach(function () {
      sinon.stub(window, 'fetch').resolves({
        json: sinon.stub().resolves({ access_token: accessToken }),
        ok: true,
      });
      const oidcPartner = {
        id: identityProviderSlug,
        code: identityProviderCode,
        organizationName: 'Partenaire OIDC',
        source,
      };
      class OidcIdentityProvidersStub extends Service {
        [identityProviderSlug] = oidcPartner;
        list = [oidcPartner];
      }
      this.owner.register('service:oidcIdentityProviders', OidcIdentityProvidersStub);
    });

    hooks.afterEach(function () {
      sinon.restore();
    });

    test('fetches token with authentication key', async function (assert) {
      // given
      const authenticator = this.owner.lookup('authenticator:oidc');

      // when
      const token = await authenticator.authenticate({
        identityProviderSlug,
        authenticationKey: 'key',
        email: 'user@example.net',
      });

      // then
      request.body = JSON.stringify({
        data: {
          attributes: {
            identity_provider: identityProviderCode,
            authentication_key: 'key',
            email: 'user@example.net',
          },
        },
      });
      sinon.assert.calledWith(window.fetch, `http://localhost:3000/api/admin/oidc/user/reconcile`, request);
      assert.deepEqual(token, {
        access_token: accessToken,
        source,
        user_id: userId,
        identityProviderCode,
      });
      assert.ok(true);
    });

    test('fetches token with code and state in body', async function (assert) {
      // given
      const authenticator = this.owner.lookup('authenticator:oidc');

      // when
      const token = await authenticator.authenticate({
        code,
        state,
        identityProviderSlug,
      });

      // then
      request.body = body;
      sinon.assert.calledWith(window.fetch, 'http://localhost:3000/api/oidc/token', request);
      assert.deepEqual(token, {
        access_token: accessToken,
        source,
        user_id: userId,
        identityProviderCode,
      });
      assert.ok(true);
    });

    module('when user is authenticated', function () {
      test('invalidates session', async function (assert) {
        // given
        const sessionStub = Service.create({
          isAuthenticated: true,
          invalidate: sinon.stub(),
          data: {
            authenticated: {
              access_token: accessToken,
            },
          },
        });

        const authenticator = this.owner.lookup('authenticator:oidc');
        authenticator.session = sessionStub;

        // when
        await authenticator.authenticate({ code, state, identityProviderSlug });

        // then
        request.body = body;
        sinon.assert.calledWith(window.fetch, `http://localhost:3000/api/oidc/token`, request);
        sinon.assert.calledOnce(sessionStub.invalidate);
        assert.ok(true);
      });
    });
  });

  module('#invalidate', function () {
    module('when user has no logout_url_uuid in their session (because shouldCloseSession is false)', function () {
      test('does not set alternativeRootURL', async function (assert) {
        // given
        const sessionStub = Service.create({
          isAuthenticated: true,
        });
        const authenticator = this.owner.lookup('authenticator:oidc');
        authenticator.session = sessionStub;

        const redirectLogoutUrl = undefined;
        const requestManager = this.owner.lookup('service:request-manager');
        sinon.stub(requestManager, 'request').resolves({
          content: {
            redirectLogoutUrl,
          },
        });

        // when
        await authenticator.invalidate({
          identityProviderCode: 'OIDC_PARTNER',
        });

        // then
        assert.strictEqual(authenticator.session.alternativeRootURL, undefined);
      });
    });

    module('when user has a logout_url_uuid in their session (because shouldCloseSession is true)', function () {
      test('sets alternativeRootURL with the redirectLogoutUrl', async function (assert) {
        // given
        const sessionStub = Service.create({
          isAuthenticated: true,
          data: {
            authenticated: {
              logout_url_uuid: 'uuid',
            },
          },
        });
        const authenticator = this.owner.lookup('authenticator:oidc');
        authenticator.session = sessionStub;

        const redirectLogoutUrl =
          'https://oidc.example.net/ea5ac20c-5076-4806-860a-b0aeb01645d4/oauth2/v2.0/logout?client_id=client';
        const requestManager = this.owner.lookup('service:request-manager');
        sinon.stub(requestManager, 'request').resolves({
          content: {
            redirectLogoutUrl,
          },
        });

        // when
        await authenticator.invalidate({
          identityProviderCode: 'OIDC_PARTNER',
          logoutUrlUuid: 'uuid',
        });

        // then
        assert.strictEqual(authenticator.session.alternativeRootURL, redirectLogoutUrl);
      });
    });
  });
});
