import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | user-participation', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:user-participation');
    sinon.stub(adapter, 'ajax');
  });

  hooks.afterEach(function () {
    adapter.ajax.restore();
  });

  module('#urlForDeleteRecord', function () {
    test('should build url to delete record', async function (assert) {
      // given
      const attrStub = (name) => {
        if (name === 'campaignId') return 777;
        if (name === 'campaignParticipationId') return 1;
      };
      const snapshot = {
        attr: attrStub,
      };

      // when
      const url = await adapter.urlForDeleteRecord(123, 'user-participation', snapshot);

      // then
      assert.true(url.endsWith('/campaigns/777/campaign-participations/1'));
    });
  });
});
