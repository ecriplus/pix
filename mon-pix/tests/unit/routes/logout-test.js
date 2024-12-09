import { setupTest } from 'ember-qunit';
import ENV from 'mon-pix/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubSessionService } from '../../helpers/service-stubs.js';

const AUTHENTICATED_SOURCE_FROM_GAR = ENV.APP.AUTHENTICATED_SOURCE_FROM_GAR;

module('Unit | Route | logout', function (hooks) {
  setupTest(hooks);

  let campaignStorageStub;
  let redirectToHomePageStub;

  hooks.beforeEach(function () {
    campaignStorageStub = { clearAll: sinon.stub() };
    redirectToHomePageStub = sinon.stub();
  });

  test('should erase campaign storage', function (assert) {
    // given
    const sessionStub = stubSessionService(this.owner);

    const route = this.owner.lookup('route:logout');
    route.set('campaignStorage', campaignStorageStub);
    route.set('session', sessionStub);
    route._redirectToHomePage = redirectToHomePageStub;

    // when
    route.beforeModel();

    // then
    sinon.assert.calledOnce(campaignStorageStub.clearAll);
    assert.ok(true);
  });

  module('when user is authenticated', function () {
    test('should disconnect the authenticated user no matter the connexion source', function (assert) {
      // given
      const sessionStub = stubSessionService(this.owner, {
        isAuthenticated: true,
        source: AUTHENTICATED_SOURCE_FROM_GAR,
      });
      const route = this.owner.lookup('route:logout');
      route.set('session', sessionStub);
      route.set('campaignStorage', campaignStorageStub);
      route._redirectToHomePage = redirectToHomePageStub;

      // when
      route.beforeModel();

      // then
      sinon.assert.calledOnce(sessionStub.invalidate);
      assert.ok(true);
    });

    test('should redirect to home when source of connexion is pix', function (assert) {
      // given
      const sessionStub = stubSessionService(this.owner, { isAuthenticated: true });

      const route = this.owner.lookup('route:logout');
      route.set('session', sessionStub);
      route.set('campaignStorage', campaignStorageStub);
      route._redirectToHomePage = redirectToHomePageStub;

      // when
      route.beforeModel();

      // then
      assert.strictEqual(route.session.alternativeRootURL, null);
    });

    test('should redirect to disconnected page when source of connexion is external', function (assert) {
      // given
      const sessionStub = stubSessionService(this.owner, {
        isAuthenticated: true,
        source: AUTHENTICATED_SOURCE_FROM_GAR,
      });

      const route = this.owner.lookup('route:logout');
      route.set('session', sessionStub);
      route.set('campaignStorage', campaignStorageStub);
      route._redirectToHomePage = redirectToHomePageStub;

      // when
      route.beforeModel();

      // then
      assert.strictEqual(route.session.alternativeRootURL, '/nonconnecte');
    });
  });

  module('when user is not authenticated', function () {
    test('should redirect to home', function (assert) {
      // given
      const sessionStub = stubSessionService(this.owner, { isAuthenticated: false });

      const route = this.owner.lookup('route:logout');
      route.set('session', sessionStub);
      route.set('campaignStorage', campaignStorageStub);
      route._redirectToHomePage = redirectToHomePageStub;

      // when
      route.beforeModel();

      // then
      sinon.assert.calledOnce(route._redirectToHomePage);
      assert.ok(true);
    });
  });
});
