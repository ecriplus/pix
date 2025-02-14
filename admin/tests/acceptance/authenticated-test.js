import { visit, within } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { authenticateAdminMemberWithRole } from '../helpers/test-init';

module('Acceptance | Authenticated pages', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('When "isPixAdminNewSidebarEnabled" feature toggle has "false" value', function (hooks) {
    hooks.beforeEach(async function () {
      // given
      class FeatureTogglesStub extends Service {
        featureToggles = { isPixAdminNewSidebarEnabled: false };

        load() {}
      }
      this.owner.register('service:featureToggles', FeatureTogglesStub);

      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    });

    test('it displays old layout with its menu-bar', async function (assert) {
      // when
      const screen = await visit('/');

      // then
      assert.dom(screen.getByRole('navigation', { name: 'Navigation principale' })).exists();
    });
  });

  module('When "isPixAdminNewSidebarEnabled" feature toggle has "true" value', function (hooks) {
    hooks.beforeEach(async function () {
      // given
      class FeatureTogglesStub extends Service {
        featureToggles = { isPixAdminNewSidebarEnabled: true };

        load() {}
      }
      this.owner.register('service:featureToggles', FeatureTogglesStub);

      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    });

    test('it displays new layout', async function (assert) {
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
