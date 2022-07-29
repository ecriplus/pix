import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Service from '@ember/service';
import * as fetch from 'fetch';

import ENV from '../../../config/environment';

const AUTHENTICATED_SOURCE_FROM_POLE_EMPLOI = ENV.APP.AUTHENTICATED_SOURCE_FROM_POLE_EMPLOI;

module('Unit | Authenticator | oidc', function (hooks) {
  setupTest(hooks);

  module('#authenticate', function () {
    const userId = 1;
    const source = 'source';
    const logoutUrlUuid = 'uuid';
    const identityProviderCode = 'OIDC';
    const identityProviderSlug = 'oidc';
    const request = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    };
    const accessToken =
      'aaa.' +
      btoa(`{
        "user_id": ${userId},
        "source": "${source}",
        "identity_provider_code": "${identityProviderCode}",
        "iat": 1545321469,
        "exp": 4702193958
      }`) +
      '.bbb';

    hooks.beforeEach(function () {
      sinon.stub(fetch, 'default').resolves({
        json: sinon.stub().resolves({ access_token: accessToken, logout_url_uuid: logoutUrlUuid }),
        ok: true,
      });
    });

    hooks.afterEach(function () {
      sinon.restore();
    });

    test('should fetch token with authentication key', async function (assert) {
      // given
      const authenticator = this.owner.lookup('authenticator:oidc');

      // when
      const token = await authenticator.authenticate({ identityProviderSlug, authenticationKey: 'key' });

      // then
      sinon.assert.calledWith(
        fetch.default,
        `http://localhost:3000/api/${identityProviderSlug}/users?authentication-key=key`,
        request
      );
      assert.deepEqual(token, {
        access_token: accessToken,
        logout_url_uuid: logoutUrlUuid,
        source,
        user_id: userId,
        identity_provider_code: identityProviderCode,
      });
    });

    test('should fetch token with code, redirectUri, and state in body', async function (assert) {
      // given
      const code = 'code';
      const redirectUri = 'redirectUri';
      const state = 'state';
      const authenticator = this.owner.lookup('authenticator:oidc');

      // when
      const token = await authenticator.authenticate({ code, redirectUri, state, identityProviderSlug });

      // then
      request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      request.body = `code=${code}&redirect_uri=${redirectUri}&state_sent=undefined&state_received=${state}`;
      sinon.assert.calledWith(fetch.default, `http://localhost:3000/api/${identityProviderSlug}/token`, request);
      assert.deepEqual(token, {
        access_token: accessToken,
        logout_url_uuid: logoutUrlUuid,
        source,
        user_id: userId,
        identity_provider_code: identityProviderCode,
      });
    });

    test('should pass the access token in the header authorization when user is authenticated', async function (assert) {
      // given
      const code = 'code';
      const redirectUri = 'redirectUri';
      const state = 'state';

      const sessionStub = Service.create({
        isAuthenticated: true,
        invalidate: sinon.stub(),
        data: {
          authenticated: {
            source: AUTHENTICATED_SOURCE_FROM_POLE_EMPLOI,
            logout_url_uuid: logoutUrlUuid,
            access_token: accessToken,
          },
        },
      });

      const authenticator = this.owner.lookup('authenticator:oidc');
      authenticator.session = sessionStub;

      // when
      const token = await authenticator.authenticate({ code, redirectUri, state, identityProviderSlug });

      // then
      request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      request.headers['Authorization'] = `Bearer ${accessToken}`;
      request.body = `code=${code}&redirect_uri=${redirectUri}&state_sent=undefined&state_received=${state}`;
      sinon.assert.calledWith(fetch.default, `http://localhost:3000/api/${identityProviderSlug}/token`, request);
      sinon.assert.calledOnce(sessionStub.invalidate);
      assert.deepEqual(token, {
        access_token: accessToken,
        logout_url_uuid: logoutUrlUuid,
        source,
        user_id: userId,
        identity_provider_code: identityProviderCode,
      });
    });
  });

  module('#invalidate', function () {
    module('when user still has an idToken in their session', function () {
      test('should redirect to the correct url', async function (assert) {
        // given
        const replaceLocationStub = sinon.stub().resolves();
        this.owner.register(
          'service:location',
          // eslint-disable-next-line ember/no-classic-classes
          Service.extend({
            replace: replaceLocationStub,
          })
        );

        const sessionStub = Service.create({
          isAuthenticated: true,
          data: {
            authenticated: {
              source: AUTHENTICATED_SOURCE_FROM_POLE_EMPLOI,
              id_token: 'ID_TOKEN',
            },
          },
        });

        const authenticator = this.owner.lookup('authenticator:oidc');
        authenticator.session = sessionStub;

        // when
        await authenticator.invalidate({ identity_provider_code: 'POLE_EMPLOI' });

        // then
        assert.equal(
          replaceLocationStub.getCall(0).args[0],
          'https://authentification-candidat-r.pe-qvr.fr/compte/deconnexion?id_token_hint=ID_TOKEN'
        );
      });
    });

    module('when user has logoutUrlUUID in their session', function (hooks) {
      hooks.beforeEach(function () {
        sinon.restore();
      });

      test('should redirect to the correct url', async function (assert) {
        // given
        const replaceLocationStub = sinon.stub().resolves();
        this.owner.register(
          'service:location',
          // eslint-disable-next-line ember/no-classic-classes
          Service.extend({
            replace: replaceLocationStub,
          })
        );
        const sessionStub = Service.create({
          isAuthenticated: true,
          data: {
            authenticated: {
              source: AUTHENTICATED_SOURCE_FROM_POLE_EMPLOI,
              logout_url_uuid: 'uuid',
            },
          },
        });
        const authenticator = this.owner.lookup('authenticator:oidc');
        authenticator.session = sessionStub;
        const redirectLogoutUrl =
          'http://identity_provider_base_url/deconnexion?id_token_hint=ID_TOKEN&redirect_uri=http%3A%2F%2Flocalhost.fr%3A4200%2Fconnexion';
        sinon.stub(fetch, 'default').resolves({
          json: sinon.stub().resolves({ redirectLogoutUrl }),
        });

        // when
        await authenticator.invalidate({ identity_provider_code: 'POLE_EMPLOI' });

        // then
        assert.equal(replaceLocationStub.getCall(0).args[0], redirectLogoutUrl);
      });
    });
  });
});
