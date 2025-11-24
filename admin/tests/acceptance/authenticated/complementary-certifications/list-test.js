import { visit } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

module('Acceptance | Complementary certifications | list ', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('When admin member is not logged in', function () {
    test('it should not be accessible by an unauthenticated user', async function (assert) {
      // when
      await visit('/complementary-certifications/list');

      // then
      assert.strictEqual(currentURL(), '/login');
    });
  });

  module('When admin member is logged in', function (hooks) {
    hooks.beforeEach(async () => {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    });

    test('it should be accessible for an authenticated user', async function (assert) {
      // when
      await visit('/complementary-certifications/');

      // then
      assert.strictEqual(currentURL(), '/complementary-certifications/list');
    });

    test('it should set certification frameworks menubar item active', async function (assert) {
      // when
      const screen = await visit('/complementary-certifications/list');

      // then
      assert.dom(screen.getByRole('link', { name: 'Référentiels de certification' })).hasClass('active');
    });

    test('it should render the certification frameworks list', async function (assert) {
      // given
      server.create('complementary-certification', { id: 1, key: 'AN', label: 'TOINE' });

      // when
      const screen = await visit('/complementary-certifications/list');

      // then
      assert.dom(screen.getByText('ID')).exists({ count: 1 });
      assert.dom(screen.getByText('1')).exists({ count: 1 });

      assert.dom(screen.getByText('Nom')).exists({ count: 1 });
      assert.dom(screen.getByText('TOINE')).exists({ count: 1 });
    });

    test('it should redirect to certification framework details on click if not double certification', async function (assert) {
      // given
      server.create('complementary-certification', {
        id: 1,
        key: 'AN',
        label: 'TOINE',
        hasComplementaryReferential: true,
        targetProfilesHistory: [
          {
            id: 52,
            name: 'Stephen target',
            badges: [],
          },
        ],
      });

      server.create('certification-consolidated-framework', { id: 'AN' });

      const screen = await visit('/complementary-certifications/list');

      // when
      await click(screen.getByRole('link', { name: 'TOINE' }));

      // then
      assert.strictEqual(currentURL(), '/complementary-certifications/1/framework');
    });

    test('it should redirect to complementary certification target profile details on click if double certification', async function (assert) {
      // given
      server.create('complementary-certification', {
        id: 1,
        key: 'AN',
        label: 'TOINE',
        hasComplementaryReferential: false,
        targetProfilesHistory: [
          {
            id: 52,
            name: 'Stephen target',
            badges: [],
          },
        ],
      });

      server.create('target-profile', { id: 'AN' });

      const screen = await visit('/complementary-certifications/list');

      // when
      await click(screen.getByRole('link', { name: 'TOINE' }));

      // then
      assert.strictEqual(currentURL(), '/complementary-certifications/1/target-profile');
    });
  });
});
