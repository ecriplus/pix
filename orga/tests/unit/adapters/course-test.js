import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Adapters | courses', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:course');
  });

  module('#urlForFindAll', function () {
    test('should build url for findAll from adapterOptions', async function (assert) {
      // when
      const url = await adapter.urlForFindAll('courses', { adapterOptions: { organizationId: 123 } });

      // then
      assert.true(url.endsWith(`/organizations/${123}/courses`));
    });
  });
});
