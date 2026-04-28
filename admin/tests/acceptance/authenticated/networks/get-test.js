import { visit } from '@1024pix/ember-testing-library';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

import setupIntl from '../../../helpers/setup-intl';

module('Acceptance | Networks | Get', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  module('When user is authenticated as Super Admin', function (hooks) {
    hooks.beforeEach(async () => {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    });

    test('it should display network informations', async function (assert) {
      // given
      const NETWORK_ID = 1;
      const HEAD_ORGANIZATION_ID = 555;

      server.create('network', {
        id: NETWORK_ID,
        name: 'My Network',
        headOrganization: {
          name: 'Head organization',
          id: HEAD_ORGANIZATION_ID,
        },
      });

      // when
      const screen = await visit(`/networks/${NETWORK_ID}`);

      // then
      assert.dom(screen.getByRole('heading', { name: 'My Network' })).exists();
      assert.dom(screen.getByText('Head organization')).exists();
    });

    test('it should redirect to networks list if network does not exist', async function (assert) {
      // when
      await visit('/networks/999');

      // then
      assert.strictEqual(currentURL(), '/networks/list');
    });
  });

  module('when user has metier role', function (hooks) {
    hooks.beforeEach(async () => {
      await authenticateAdminMemberWithRole({ isMetier: true })(server);
    });

    test('it can access the network detail page', async function (assert) {
      // given
      const NETWORK_ID = 1;
      server.create('network', {
        id: NETWORK_ID,
        name: 'My Network',
        headOrganization: { name: 'Head organization', id: 555 },
      });

      // when
      const screen = await visit(`/networks/${NETWORK_ID}`);

      // then
      assert.strictEqual(currentURL(), `/networks/${NETWORK_ID}`);
      assert.dom(screen.getByRole('heading', { name: 'My Network' })).exists();
    });
  });
});
