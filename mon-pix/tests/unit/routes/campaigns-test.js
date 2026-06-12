import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | campaigns', function (hooks) {
  setupTest(hooks);

  module('#activate', function () {
    test('should set metrics context', async function (assert) {
      // Given
      const route = this.owner.lookup('route:campaigns');
      const store = this.owner.lookup('service:store');
      route.metrics = { context: {} };
      const campaignCode = 'CAMPAIGN_CODE';
      const paramsForStub = sinon.stub(route, 'paramsFor').returns({ code: campaignCode });

      const queryRecordStub = sinon.stub(store, 'queryRecord').resolves({ recommendationEngine: false });

      // When
      await route.activate();

      // Then
      sinon.assert.calledOnceWithExactly(paramsForStub, 'campaigns');
      sinon.assert.calledOnceWithExactly(queryRecordStub, 'campaign', { filter: { code: campaignCode } });

      assert.deepEqual(route.metrics.context.code, campaignCode);
      assert.strictEqual(route.metrics.context.type, 'campaigns');
      assert.strictEqual(route.metrics.context.feature, undefined);
    });

    module('when campaign has recommendationEngine feature', function () {
      test('should set "feature" attribute in metrics context', async function (assert) {
        // Given
        const route = this.owner.lookup('route:campaigns');
        const store = this.owner.lookup('service:store');
        route.metrics = { context: {} };
        sinon.stub(route, 'paramsFor').returns({ code: 'CAMPAIGN_CODE', recommendationEngine: true });

        sinon.stub(store, 'queryRecord').resolves({ recommendationEngine: true });

        // When
        await route.activate();

        // Then
        assert.deepEqual(route.metrics.context.code, 'CAMPAIGN_CODE');
        assert.strictEqual(route.metrics.context.type, 'campaigns');
        assert.strictEqual(route.metrics.context.feature, 'RECOMMENDATION_ENGINE');
      });
    });
  });

  test('deactivate should unset metrics context', function (assert) {
    // Given
    const route = this.owner.lookup('route:campaigns');
    route.metrics = {
      context: {
        code: 'CAMPAIGN_CODE',
        type: 'campaigns',
        feature: 'RECOMMENDATION_ENGINE',
      },
    };

    // When
    route.deactivate();

    // Then
    assert.strictEqual(route.metrics.context.code, undefined);
    assert.strictEqual(route.metrics.context.type, undefined);
    assert.strictEqual(route.metrics.context.feature, undefined);
  });
});
