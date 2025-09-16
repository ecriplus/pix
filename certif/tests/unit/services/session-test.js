import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Service | session', function (hooks) {
  setupTest(hooks);

  let user;
  let routerService;
  let service;

  hooks.beforeEach(function () {
    user = { lang: 'fr' };

    routerService = this.owner.lookup('service:router');
    routerService.transitionTo = sinon.stub();

    service = this.owner.lookup('service:session');
    service.currentUser = { load: sinon.stub(), certificationPointOfContact: user };
  });

  module('#handleAuthentication', function () {
    test('loads current user', async function (assert) {
      // when
      await service.handleAuthentication();

      // then
      sinon.assert.calledOnce(service.currentUser.load);
      assert.ok(true);
    });
  });

  module('#handleInvalidation', function () {
    test('overrides handleInvalidation method', function (assert) {
      // then
      assert.true(service.handleInvalidation instanceof Function);
    });

    test('calls clear method from session store', function (assert) {
      // given
      sinon.stub(service.store, 'clear');

      // when
      service.handleInvalidation();

      // then
      assert.true(service.store.clear.calledOnce);
    });
  });

  module('#updateDataAttribute', function () {
    test('updates session data attribute value', function (assert) {
      // when
      service.updateDataAttribute('message', 'This is a message!');
      service.updateDataAttribute('isItUsed', true);
      service.updateDataAttribute('notDisplayed', false);

      // then
      assert.strictEqual(service.data.message, 'This is a message!');
      assert.true(service.data.isItUsed);
      assert.false(service.data.notDisplayed);
    });
  });
});
