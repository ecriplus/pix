import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubSessionService } from '../../../helpers/service-stubs.js';

module('Unit | Route | Access', function (hooks) {
  setupTest(hooks);

  let route, organization;

  hooks.beforeEach(function () {
    organization = {
      verifiedCode: {
        id: 'CAMPAIGN_CODE',
        type: 'campaign',
        campaign: { isSimplifiedAccess: false },
      },
      organizationToJoin: {
        id: 1,
        isRestrictedByIdentityProvider: sinon.stub(),
      },
    };
    route = this.owner.lookup('route:organizations.access');
    route.modelFor = sinon.stub().returns(organization);
    route.accessStorage = { hasUserSeenJoinPage: sinon.stub() };
    route.router = { replaceWith: sinon.stub(), transitionTo: sinon.stub() };

    class OidcIdentityProvidersStub extends Service {
      list = [];
    }

    this.owner.register('service:oidcIdentityProviders', OidcIdentityProvidersStub);
  });

  module('#beforeModel', function () {
    module('when user is authenticated from Pix', function (hooks) {
      let sessionStub;

      hooks.beforeEach(function () {
        sessionStub = stubSessionService(this.owner, { isAuthenticated: true });
        route.session = sessionStub;
      });

      test('should redirect to entry point when /access is directly set in the url', async function (assert) {
        //when
        await route.beforeModel({ from: null });

        //then
        sinon.assert.calledWith(route.router.replaceWith, 'campaigns.entry-point');
        assert.ok(true);
      });

      test('should continue on access route when from is set', async function (assert) {
        //when
        await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

        //then
        sinon.assert.notCalled(route.router.replaceWith);
        assert.ok(true);
      });

      test('should override authentication route', async function (assert) {
        // when
        await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

        // then

        assert.strictEqual(route.authenticationRoute, 'inscription');
      });

      test("should call parent's beforeModel and transition to authenticationRoute", async function (assert) {
        // when
        await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

        // then
        sinon.assert.calledWith(
          sessionStub.requireAuthenticationAndApprovedTermsOfService,
          { from: 'campaigns.campaign-landing-page' },
          'inscription',
        );
        assert.ok(true);
      });

      module('when campaign belongs to an oidc provider', function (hooks) {
        hooks.beforeEach(function () {
          const oidcProviderService = this.owner.lookup('service:oidcIdentityProviders');
          const oidcPartner = { id: 'oidc-partner', code: 'OIDC_PARTNER' };
          oidcProviderService['oidc-partner'] = oidcPartner;
          oidcProviderService.list = [oidcPartner];
        });

        module('and user is not connected with that provider', function () {
          test('should use provider route', async function (assert) {
            // given
            organization.organizationToJoin.isRestrictedByIdentityProvider.withArgs('OIDC_PARTNER').returns(true);

            // when
            await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

            // then
            sinon.assert.calledWith(route.router.replaceWith, 'authentication.login-oidc', 'oidc-partner');
            assert.ok(true);
          });
        });

        module('and user is connected with that provider', function () {
          test('should not use provider route', async function (assert) {
            // given
            const OIDC_PARTNER = 'OIDC_PARTNER';
            route.session.data.authenticated.identityProviderCode = OIDC_PARTNER;
            organization.organizationToJoin.isRestrictedByIdentityProvider.withArgs(OIDC_PARTNER).returns(true);

            // when
            await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

            // then
            sinon.assert.neverCalledWith(route.router.replaceWith, 'authentication.login-oidc', 'oidc-partner');
            assert.ok(true);
          });
        });
      });
    });

    module(
      'when campaign is SCO restricted and user is neither authenticated from Pix nor a user from an external platform',
      function (hooks) {
        let sessionStub;

        hooks.beforeEach(function () {
          sessionStub = stubSessionService(this.owner, { isAuthenticated: false });
          route.session = sessionStub;
          organization.organizationToJoin.isRestricted = true;
          organization.organizationToJoin.type = 'SCO';
        });

        test('should override authentication route with student-sco', async function (assert) {
          // given
          organization.organizationToJoin.hasReconciliationFields = false;

          // when
          await route.beforeModel({ from: 'campaigns.campaign-landing-page' });
          // then
          assert.strictEqual(route.authenticationRoute, 'organizations.join.student-sco');
        });

        test('should not override authentication route when campaign reconciliationRequired', async function (assert) {
          // given
          organization.organizationToJoin.hasReconciliationFields = true;

          // when
          await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

          // then
          assert.strictEqual(route.authenticationRoute, 'inscription');
        });
      },
    );

    module('when campaign is SCO restricted and user has been disconnected from sco form', function () {
      test('should override authentication route with student-sco', async function (assert) {
        // given
        const sessionStub = stubSessionService(this.owner, { isAuthenticated: false, isAuthenticatedByGar: true });
        route.session = sessionStub;
        organization.organizationToJoin.isRestricted = true;
        organization.organizationToJoin.type = 'SCO';
        route.accessStorage.hasUserSeenJoinPage.withArgs(organization.organizationToJoin.id).returns(true);

        // when
        await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

        // then
        assert.strictEqual(route.authenticationRoute, 'organizations.join.student-sco');
      });
    });

    module('when campaign is restricted and user is from an external platform', function () {
      test('should override authentication route with sco-mediacentre', async function (assert) {
        // given
        const sessionStub = stubSessionService(this.owner, { isAuthenticated: false, isAuthenticatedByGar: true });
        route.session = sessionStub;
        organization.organizationToJoin.isRestricted = true;

        // when
        await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

        // then
        assert.strictEqual(route.authenticationRoute, 'organizations.join.sco-mediacentre');
      });
    });

    module('when campaign is simplified access and user is not authenticated', function () {
      test('should override authentication route with anonymous', async function (assert) {
        // given
        const sessionStub = stubSessionService(this.owner, { isAuthenticated: false });
        route.session = sessionStub;
        organization.verifiedCode.campaign.isSimplifiedAccess = true;
        route.session.isAuthenticated = false;

        // when
        await route.beforeModel({ from: 'campaigns.campaign-landing-page' });

        // then
        assert.strictEqual(route.authenticationRoute, 'organizations.join.anonymous');
      });
    });
  });
});
