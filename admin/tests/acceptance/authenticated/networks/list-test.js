import { clickByName, visit } from '@1024pix/ember-testing-library';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

module('Acceptance | Networks | List', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('when user has super admin role', function (hooks) {
    hooks.beforeEach(async function () {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    });

    test('it should redirect to network creation form on click "Nouveau réseau"', async function (assert) {
      // given
      await visit('/networks/list');

      // when
      await clickByName('Nouveau réseau');

      // then
      assert.strictEqual(currentURL(), '/networks/new');
    });
  });
});
