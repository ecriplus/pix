import { visit } from '@1024pix/ember-testing-library';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

module('Acceptance | Complementary certifications | Complementary certification | Item', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it should render framework page when complementary has a complementary referential', async function (assert) {
    // given
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    server.create('complementary-certification', {
      id: 1,
      hasComplementaryReferential: true,
      key: 'KEY',
      label: 'MARIANNE CERTIF',
    });
    server.create('certification-consolidated-framework', {
      id: 'KEY',
    });

    // when
    await visit('/complementary-certifications/KEY');

    // then
    assert.strictEqual(currentURL(), '/complementary-certifications/KEY/framework');
  });

  test('it should render target profile page when complementary has no complementary referential', async function (assert) {
    // given
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    server.create('complementary-certification', {
      id: 1,
      hasComplementaryReferential: false,
      key: 'KEY',
      label: 'MARIANNE CERTIF',
      targetProfilesHistory: [
        { name: 'ALEX TARGET', id: 3, attachedAt: new Date('2023-10-10T10:50:00Z') },
        { name: 'JEREM TARGET', id: 2, attachedAt: new Date('2020-10-10T10:50:00Z') },
      ],
    });
    server.create('target-profile', {
      id: 2,
      name: 'JEREM TARGET',
    });

    // when
    await visit('/complementary-certifications/KEY');

    // then
    assert.strictEqual(currentURL(), '/complementary-certifications/KEY/target-profile');
  });
});
