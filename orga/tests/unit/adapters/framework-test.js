import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Adapters | framework', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:framework');
  });

  module('#urlForFindAll', function () {
    test('should build url for findAll from adapterOptions', async function (assert) {
      // when
      const url = await adapter.urlForFindAll('framework', { adapterOptions: { organizationId: 123 } });

      // then
      assert.true(url.endsWith(`/organizations/${123}/frameworks`));
    });
  });
});
