import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapters | analysis-by-tube', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:analysis-by-tube');
    adapter.ajax = sinon.stub().resolves();
  });

  module('#urlForQueryRecord', () => {
    test('should build query url from organizationId', async function (assert) {
      const organizationId = 'organizationId';
      const query = { organizationId };
      const url = await adapter.urlForQueryRecord(query);

      assert.ok(url.endsWith(`api/organizations/${organizationId}/organization-learners-level-by-tubes`));
      assert.strictEqual(query.organizationId, undefined);
    });
  });
});
