import EmberObject from '@ember/object';
import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/organizations/get/network', function (hooks) {
  setupTest(hooks);

  let route, restrictAccessToStub;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/organizations/get/network');
    sinon.stub(route.router, 'replaceWith');

    restrictAccessToStub = sinon.stub().returns();
    class AccessControlStub extends Service {
      restrictAccessTo = restrictAccessToStub;
    }
    this.owner.register('service:access-control', AccessControlStub);
  });

  module('#beforeModel', function () {
    test('it should check if current user is super admin or metier', function (assert) {
      // given
      const organization = EmberObject.create({ network: { id: 123, name: 'My Network' } });
      sinon.stub(route, 'modelFor').returns(organization);

      // when
      route.beforeModel();

      // then
      assert.ok(
        restrictAccessToStub.calledWith(['isSuperAdmin', 'isMetier'], 'authenticated.organizations.get.details'),
      );
    });

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
