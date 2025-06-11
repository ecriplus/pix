import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | Access Storage', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    const service = this.owner.lookup('service:access-storage');
    service.clearAll();
  });

  module('#hasUserSeenJoinPage', function () {
    test(`returns false as default value`, function (assert) {
      const service = this.owner.lookup('service:access-storage');
      const organizationId = 1;

      const hasUserSeenJoinPage = service.hasUserSeenJoinPage(organizationId);

      assert.false(hasUserSeenJoinPage);
    });

    test('returns true when it has been set to true', function (assert) {
      const service = this.owner.lookup('service:access-storage');
      const organizationId = 1;
      service.setHasUserSeenJoinPage(organizationId, true);

      const hasUserSeenJoinPage = service.hasUserSeenJoinPage(organizationId);

      assert.ok(hasUserSeenJoinPage);
    });
  });
});
