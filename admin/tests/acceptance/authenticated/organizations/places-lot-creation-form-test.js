import { visit } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

module('Acceptance | Organizations | places lot creation form', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('should go to places listing page', async function (assert) {
    // given
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    const ownerOrganizationId = this.server.create('organization', {
      name: 'Orga name',
      features: { PLACES_MANAGEMENT: { active: true } },
    }).id;

    const screen = await visit(`/organizations/${ownerOrganizationId}/places/new`);

    // when
    await click(screen.getByRole('link', { name: 'Annuler' }));

    // then
    assert.strictEqual(currentURL(), `/organizations/${ownerOrganizationId}/places`);
  });
});
