import { visit, within } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { module, test } from 'qunit';

module('Acceptance | Complementary certifications | Complementary certification | Item', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it should display target profile and framework tabs', async function (assert) {
    // given
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    server.create('complementary-certification', {
      id: 1,
      key: 'KEY',
      label: 'Pix+Droit',
    });

    // when
    const screen = await visit('/complementary-certifications/item/1/framework');

    // then
    const navigation = screen.getByRole('navigation', {
      name: t('components.complementary-certifications.item.navigation.aria-label'),
    });
    assert.ok(
      within(navigation).getByRole('link', { name: t('components.complementary-certifications.item.framework.tab') }),
    );
    assert.ok(
      within(navigation).getByRole('link', { name: t('components.complementary-certifications.item.target-profile') }),
    );
    await click(
      within(navigation).getByRole('link', { name: t('components.complementary-certifications.item.target-profile') }),
    );
    assert.strictEqual(currentURL(), '/complementary-certifications/item/1/target-profile');
  });
});
