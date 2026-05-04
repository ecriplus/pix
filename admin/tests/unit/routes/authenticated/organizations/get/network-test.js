import EmberObject from '@ember/object';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/organizations/get/network', function (hooks) {
  setupTest(hooks);

  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/organizations/get/network');
    sinon.stub(route.router, 'replaceWith');
  });

  module('#beforeModel', function () {
    test('it should transition to details route when organization does not belong to a network', async function (assert) {
      // given
      const organization = EmberObject.create({ network: { id: null, name: null } });
      sinon.stub(route, 'modelFor').returns(organization);

      // when
      await route.beforeModel();

      // then
      assert.ok(route.router.replaceWith.calledWith('authenticated.organizations.get.details'));
    });
  });
});
