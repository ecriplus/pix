import { visit, within } from '@1024pix/ember-testing-library';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { authenticateAdminMemberWithRole } from '../helpers/test-init';

module('Acceptance | Authenticated pages', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('When admin member is authenticated', function (hooks) {
    hooks.beforeEach(async function () {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    });

    test('it displays the layout', async function (assert) {
      // when
      const screen = await visit('/');

      // then
      const navBar = screen.getByRole('complementary');
      const footer = within(navBar).getByRole('contentinfo');

      assert.dom(footer).exists();
      assert.ok(within(footer).getByRole('link', { name: 'Se déconnecter' }));
    });
  });
});
