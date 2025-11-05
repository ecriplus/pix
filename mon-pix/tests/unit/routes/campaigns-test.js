import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | campaigns', function (hooks) {
  setupTest(hooks);

  test('activate should set metrics context', function (assert) {
    // Given
    const route = this.owner.lookup('route:campaigns');
    route.metrics = { context: {} };
    const paramsForStub = sinon.stub(route, 'paramsFor').returns({ code: 'CAMPAIGN_CODE' });

    // When
    route.activate();

    // Then
    assert.deepEqual(route.metrics.context.code, 'CAMPAIGN_CODE');
    assert.strictEqual(route.metrics.context.type, 'campaigns');
    assert.ok(paramsForStub.calledWith('campaigns'));
  });

  test('deactivate should unset metrics context', function (assert) {
    // Given
    const route = this.owner.lookup('route:campaigns');
    route.metrics = {
      context: {
        code: 'CAMPAIGN_CODE',
        type: 'campaigns',
      },
    };

    // When
    route.deactivate();

    // Then
    assert.strictEqual(route.metrics.context.code, undefined);
    assert.strictEqual(route.metrics.context.type, undefined);
  });
});
