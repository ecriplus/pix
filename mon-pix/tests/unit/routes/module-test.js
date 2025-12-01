import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | module', function (hooks) {
  setupTest(hooks);

  test('should exist', function (assert) {
    // when
    const route = this.owner.lookup('route:module');

    // then
    assert.ok(route);
  });

  module('when no corresponding module data exists', function () {
    test('should load the corresponding model', async function (assert) {
      // given
      const route = this.owner.lookup('route:module');
      const store = this.owner.lookup('service:store');

      const module = Symbol('the-module');

      store.queryRecord = sinon.stub();
      store.queryRecord
        .withArgs('module', { shortId: 'dfc4isne', encryptedRedirectionUrl: 'somehash' })
        .resolves(module);

      // when
      const model = await route.model({ shortId: 'dfc4isne', redirection: 'somehash' });

      // then
      assert.strictEqual(model, module);
    });
  });

  module('when the module data exists', function () {
    test('should load data', async function (assert) {
      // given
      const route = this.owner.lookup('route:module');
      const store = this.owner.lookup('service:store');
      const shortId = 'dfc4isne';

      const module = { shortId };

      store.queryRecord = sinon.stub();
      store.peekAll = sinon.stub();
      store.peekAll.returns([module]);

      // when
      const model = await route.model({ shortId: 'dfc4isne', redirection: 'somehash' });

      // then
      sinon.assert.notCalled(store.queryRecord);
      assert.strictEqual(model, module);
    });
  });

  test('activate should set metrics context', function (assert) {
    // Given
    const route = this.owner.lookup('route:module');
    route.metrics = { context: {} };
    const paramsForStub = sinon.stub(route, 'paramsFor').returns({ slug: 'MODULE_SLUG' });

    // When
    route.activate();

    // Then
    assert.deepEqual(route.metrics.context.code, 'MODULE_SLUG');
    assert.strictEqual(route.metrics.context.type, 'module');
    assert.ok(paramsForStub.calledWith('module'));
  });

  test('deactivate should unset metrics context', function (assert) {
    // Given
    const route = this.owner.lookup('route:module');
    route.metrics = {
      context: {
        code: 'MODULE_SLUG',
        type: 'module',
      },
    };

    // When
    route.deactivate();

    // Then
    assert.strictEqual(route.metrics.context.code, undefined);
    assert.strictEqual(route.metrics.context.type, undefined);
  });
});
