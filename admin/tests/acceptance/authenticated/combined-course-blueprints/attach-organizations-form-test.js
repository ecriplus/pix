import { clickByName, fillByLabel, visit } from '@1024pix/ember-testing-library';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

import setupIntl from '../../../helpers/setup-intl';

module('Acceptance | Attach organizations form', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);
  let combinedCourseBlueprintId;

  hooks.beforeEach(async function () {
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
  });

  //then
  test('should be able to add new organization to the combined course blueprint', async function (assert) {
    // given
    combinedCourseBlueprintId = 1;
    server.create('combined-course-blueprint', { id: combinedCourseBlueprintId, internalName: 'toto' });

    const screen = await visit(`/combined-course-blueprints/${combinedCourseBlueprintId}/organizations`);

    // when
    await fillByLabel('Rattacher une ou plusieurs organisation(s)', '42');
    await clickByName('Valider le rattachement');

    // then
    assert.dom(await screen.findByRole('cell', { name: 'Organization 42' })).isVisible();
  });

  test('should be able to add new organization to the target profile', async function (assert) {
    server.create('organization', {
      id: 456,
      name: 'My organization',
      features: { PLACES_MANAGEMENT: { active: false } },
    });

    server.create('target-profile', { id: 1, ownerOrganizationId: 456, name: 'Mon super profil cible' });

    // given
    const screen = await visit('/target-profiles/1');
    await clickByName('Organisations du profil cible');

    // when
    await fillByLabel('Rattacher une ou plusieurs organisation(s)', '42');
    await clickByName('Valider le rattachement');

    // then
    assert.dom(await screen.findByRole('cell', { name: 'Organization 42' })).isVisible();
  });
});
