import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/campaigns/list/all-campaigns', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:authenticated/campaigns/list/all-campaigns');
    assert.ok(route);
  });

  module('beforeModel', function () {
    module('when user can access not campaigns', function () {
      test('it should redirect to "authenticated.index"', function (assert) {
        const currentUserService = this.owner.lookup('service:current-user');
        sinon.stub(currentUserService, 'prescriber').value({ missionsManagement: true });
        const route = this.owner.lookup('route:authenticated/campaigns/list/all-campaigns');
        const replaceWithStub = sinon.stub(route.router, 'replaceWith');
        route.beforeModel();
        assert.ok(replaceWithStub.calledOnceWith, 'authenticated.index');
      });
    });
  });
});
