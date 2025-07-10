import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | Join', function (hooks) {
  setupTest(hooks);

  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:organizations.join');
    route.modelFor = sinon.stub();
    route.router = { replaceWith: sinon.stub() };
  });

  module('#beforeModel', function (hooks) {
    hooks.beforeEach(function () {
      route = this.owner.lookup('route:organizations.join');
      route.session = {
        prohibitAuthentication: sinon.stub(),
      };
      route.router = { replaceWith: sinon.stub() };
    });

    test('should redefine routeIfAlreadyAuthenticated', async function (assert) {
      // given

      //when
      await route.beforeModel();

      //then
      assert.strictEqual(route.routeIfAlreadyAuthenticated, 'organizations.access');
      sinon.assert.calledWith(route.session.prohibitAuthentication, 'authenticated.user-dashboard');
    });
  });

  module('#model', function () {
    test('should load model', async function (assert) {
      //when
      await route.model();

      //then
      sinon.assert.calledWith(route.modelFor, 'organizations');
      assert.ok(true);
    });
  });
});
