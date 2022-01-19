import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | Campaign', function (hooks) {
  setupTest(hooks);
  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:campaign');
  });

  module('#urlForQueryRecord', function () {
    test('should add organizationId inside the default query url', function (assert) {
      // when
      const query = { organizationId: 10 };
      const url = adapter.urlForQuery(query);

      // then
      assert.ok(url.endsWith('/admin/organizations/10/campaigns'));
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(query.organizationId, undefined);
    });
  });
});
