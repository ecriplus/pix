import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { redactUrlForAnalytics } from 'mon-pix/routes/application.js';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | application', function (hooks) {
  setupTest(hooks);

  module('#redactUrlForAnalytics', function () {
    test.each(
      'should rewrite url with redacted IDs',
      [
        { actual: '/candidat/123/informations', params: ['123'], expected: '/candidat/_ID_/informations' },
        { actual: '/candidat/1/informations', params: ['1'], expected: '/candidat/_ID_/informations' },
        {
          actual: '/competences/rec123/resultats/0',
          params: ['rec123', '0'],
          expected: '/competences/_ID_/resultats/_ID_',
        },
        {
          actual: '/competences/rec123/resultats/789',
          params: ['rec123', '789'],
          expected: '/competences/_ID_/resultats/_ID_',
        },
        {
          actual: '/competences/competence123/resultats/789',
          params: ['competence123', '789'],
          expected: '/competences/_ID_/resultats/_ID_',
        },
        {
          actual: '/competences/competence123/resultats/789?id=789',
          params: ['competence123', '789'],
          expected: '/competences/_ID_/resultats/_ID_?id=789',
        },
      ],
      function (assert, input) {
        const redatedUrl = redactUrlForAnalytics(input.actual, input.params);
        assert.strictEqual(redatedUrl, input.expected);
      },
    );
  });
  test('hides the splash when the route is activated', function (assert) {
    // Given
    const SplashServiceStub = Service.create({
      hideCount: 0,
      hide() {
        this.hideCount++;
      },
    });

    const route = this.owner.lookup('route:application');
    route.set('splash', SplashServiceStub);

    // When
    route.activate();

    // Then
    assert.strictEqual(SplashServiceStub.hideCount, 1);
  });

  module('#beforeModel', function (hooks) {
    let featureTogglesServiceStub, sessionServiceStub, oidcIdentityProvidersStub;

    hooks.beforeEach(function () {
      const catchStub = sinon.stub();

      featureTogglesServiceStub = Service.create({
        load: sinon.stub().resolves(catchStub),
      });
      sessionServiceStub = Service.create({
        setup: sinon.stub().resolves(),
        handleUserLanguageAndLocale: sinon.stub().resolves(),
      });
      oidcIdentityProvidersStub = Service.create({
        load: sinon.stub().resolves(),
      });

      this.intl = this.owner.lookup('service:intl');
    });

    test('should setup the session', async function (assert) {
      // given
      const route = this.owner.lookup('route:application');
      route.set('featureToggles', featureTogglesServiceStub);
      route.set('session', sessionServiceStub);
      route.set('oidcIdentityProviders', oidcIdentityProvidersStub);

      // when
      await route.beforeModel();

      // then
      sinon.assert.calledOnce(sessionServiceStub.setup);
      assert.ok(true);
    });

    test('should get feature toogles', async function (assert) {
      // given
      const route = this.owner.lookup('route:application');
      route.set('featureToggles', featureTogglesServiceStub);
      route.set('session', sessionServiceStub);
      route.set('oidcIdentityProviders', oidcIdentityProvidersStub);

      // when
      await route.beforeModel();

      // then
      sinon.assert.calledOnce(featureTogglesServiceStub.load);
      assert.ok(true);
    });

    test('should get language and local of user', async function (assert) {
      // given
      const route = this.owner.lookup('route:application');
      route.set('featureToggles', featureTogglesServiceStub);
      route.set('session', sessionServiceStub);
      route.set('oidcIdentityProviders', oidcIdentityProvidersStub);
      const transition = { from: 'inscription' };
      // when
      await route.beforeModel(transition);

      // then
      sinon.assert.calledWith(sessionServiceStub.handleUserLanguageAndLocale, transition);
      assert.ok(true);
    });
  });

  module('error', function () {
    module('when the error is a 401', function () {
      test('should return false to prevent ember error handling', async function (assert) {
        // given
        const route = this.owner.lookup('route:application');

        const currentError = { errors: [{ status: '401' }] };

        // when
        const err = await route.error(currentError);

        // then
        assert.false(err);
      });
    });

    module('when the error is a 403 with HTML content-type', function () {
      test('should return false to prevent ember error handling', async function (assert) {
        // given
        const route = this.owner.lookup('route:application');

        const currentError = { error: '...Payload (text/html;...', errors: [{ status: '403' }] };

        // when
        const err = await route.error(currentError);

        // then
        assert.false(err);
      });
    });

    module('when the error is not a 401 or a a 403 with HTML content-type', function () {
      test('should return true to keep ember error handling', async function (assert) {
        // given
        const route = this.owner.lookup('route:application');

        const currentError = { errors: [{ status: '404' }] };

        // when
        const err = await route.error(currentError);

        // then
        assert.true(err);
      });
    });
  });
});
