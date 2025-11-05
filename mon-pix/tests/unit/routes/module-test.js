import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | module', function (hooks) {
  setupTest(hooks);

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
