import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/networks/index', function (hooks) {
  setupTest(hooks);

  module('#beforeModel', function () {
    test('it should redirect to the networks list route', function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/networks/index');
      const transitionToStub = sinon.stub(route.router, 'transitionTo').returns();

      // when
      route.beforeModel();

      // then
      assert.ok(transitionToStub.calledWith('authenticated.networks.list'));
    });
  });
});
