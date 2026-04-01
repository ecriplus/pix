// TODO: delete file at the end of EPIX PIX-21277

import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Route | authenticated/organizations/get/children', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:authenticated/organizations/get/children');
    assert.ok(route);
  });
});
