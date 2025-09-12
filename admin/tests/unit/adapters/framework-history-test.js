import { setupTest } from 'ember-qunit';
import ENV from 'pix-admin/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | framework-history', function (hooks) {
  setupTest(hooks);

  module('#queryRecord', function () {
    test('it builds request with specific payload and url', async function (assert) {
      // given
      const adapter = this.owner.lookup('adapter:framework-history');
      const store = this.owner.lookup('service:store');
      sinon.stub(adapter, 'ajax');

      // when
      adapter.queryRecord(store, 'framework-history', 'DROIT');

      // then
      const expectedUrl = `${ENV.APP.API_HOST}/api/admin/complementary-certifications/DROIT/framework-history`;
      assert.ok(adapter.ajax.calledWith(expectedUrl, 'GET'));
    });
  });
});
