import Object from '@ember/object';
import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Service | oidc-identity-providers', function (hooks) {
  setupTest(hooks);

  let oidcIdentityProvidersService;
  let storeStub;

  const oidcPartner = {
    id: 'oidc-partner',
    code: 'OIDC_PARTNER',
    slug: 'partenaire-oidc',
    organizationName: 'Partenaire OIDC',
    shouldCloseSession: false,
    source: 'oidc-externe',
  };

  hooks.beforeEach(function () {
    oidcIdentityProvidersService = this.owner.lookup('service:oidcIdentityProviders');
  });

  module('load', function () {
    test('loads all identity providers into the store', async function (assert) {
      // given
      storeStub = Service.create({
        findAll: sinon.stub().resolves([Object.create(oidcPartner)]),
        peekAll: sinon.stub().returns([Object.create(oidcPartner)]),
      });
      oidcIdentityProvidersService.set('store', storeStub);

      // when
      await oidcIdentityProvidersService.load();

      // then
      assert.strictEqual(oidcIdentityProvidersService.list[0].id, oidcPartner.id);
      assert.strictEqual(oidcIdentityProvidersService.list[0].code, oidcPartner.code);
      assert.strictEqual(oidcIdentityProvidersService.list[0].organizationName, oidcPartner.organizationName);
      assert.strictEqual(oidcIdentityProvidersService.list[0].shouldCloseSession, oidcPartner.shouldCloseSession);
      assert.strictEqual(oidcIdentityProvidersService.list[0].source, oidcPartner.source);
    });
  });

  module('getIdentityProviderNamesByAuthenticationMethods', function () {
    test('should return identity provider names for methods', function (assert) {
      // given
      const methods = [
        { identityProvider: 'FRANCE_CONNECT' },
        { identityProvider: 'IMPOTS_GOUV' },
        { identityProvider: 'AUTRE_FOURNISSEUR_D_IDENTITE' },
      ];
      const oidcPartnerObject = Object.create({
        id: 'france-connect',
        code: 'FRANCE_CONNECT',
        organizationName: 'France Connect',
        shouldCloseSession: false,
        source: 'france-connect',
      });
      const secondOidcPartnerObject = Object.create({
        id: 'impots-gouv',
        code: 'IMPOTS_GOUV',
        organizationName: 'Impots.gouv',
        shouldCloseSession: false,
        source: 'impots-gouv',
      });
      const thirdOidcPartnerObject = Object.create({
        id: 'la-poste',
        code: 'LA_POSTE',
        organizationName: 'la-poste.gouv',
        shouldCloseSession: false,
        source: 'la-poste-gouv',
      });
      oidcIdentityProvidersService.set(
        'store',
        Service.create({
          peekAll: sinon.stub().returns([oidcPartnerObject, secondOidcPartnerObject, thirdOidcPartnerObject]),
        }),
      );

      // when
      const names = oidcIdentityProvidersService.getIdentityProviderNamesByAuthenticationMethods(methods);

      // expect
      assert.deepEqual(names, ['France Connect', 'Impots.gouv']);
    });
  });

  module('list', function () {
    test('lists all identity providers loaded', async function (assert) {
      // given
      storeStub = Service.create({
        findAll: sinon.stub().resolves([Object.create(oidcPartner)]),
        peekAll: sinon.stub().returns([Object.create(oidcPartner)]),
      });
      oidcIdentityProvidersService.set('store', storeStub);

      // when
      const allProviders = oidcIdentityProvidersService.list;

      // then
      assert.strictEqual(allProviders.length, 1);
      assert.strictEqual(allProviders[0].code, oidcPartner.code);
    });
  });

  module('findBySlug', function () {
    module('when the requested identity provider is available', function () {
      test('returns the identity provider', async function (assert) {
        // given
        storeStub = Service.create({
          findAll: sinon.stub().resolves([Object.create(oidcPartner)]),
          peekAll: sinon.stub().returns([Object.create(oidcPartner)]),
        });
        oidcIdentityProvidersService.set('store', storeStub);

        // when
        const identityProvider = await oidcIdentityProvidersService.findBySlug(oidcPartner.slug);

        // then
        assert.strictEqual(identityProvider.code, oidcPartner.code);
      });
    });

    module('when the requested identity provider is not available', function () {
      test('returns undefined', async function (assert) {
        // given
        storeStub = Service.create({
          findAll: sinon.stub().resolves([Object.create(oidcPartner)]),
          peekAll: sinon.stub().returns([Object.create(oidcPartner)]),
        });
        oidcIdentityProvidersService.set('store', storeStub);

        // when
        const identityProvider = await oidcIdentityProvidersService.findBySlug('not-existing-slug');

        // then
        assert.strictEqual(identityProvider, undefined);
      });
    });
  });

  module('hasIdentityProviders', function () {
    module('when there is at least one provider', function () {
      test('returns true', async function (assert) {
        // given
        storeStub = Service.create({
          findAll: sinon.stub().resolves([Object.create(oidcPartner)]),
          peekAll: sinon.stub().returns([Object.create(oidcPartner)]),
        });
        oidcIdentityProvidersService.set('store', storeStub);

        // when
        const hasIdentityProviders = oidcIdentityProvidersService.hasIdentityProviders;

        // then
        assert.true(hasIdentityProviders);
      });
    });

    module('when there are no providers', function () {
      test('returns false', async function (assert) {
        // given
        storeStub = Service.create({
          findAll: sinon.stub().resolves([]),
          peekAll: sinon.stub().returns([]),
        });
        oidcIdentityProvidersService.set('store', storeStub);

        // when
        const hasIdentityProviders = oidcIdentityProvidersService.hasIdentityProviders;

        // then
        assert.false(hasIdentityProviders);
      });
    });
  });
});
