import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Route | login', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:authentication.login');
    assert.ok(route);
  });
});
