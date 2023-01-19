import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { clickByName, visit, fillByLabel } from '@1024pix/ember-testing-library';
import { currentURL, click } from '@ember/test-helpers';

module('Acceptance | Organizations | Create', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
  });

  module('when an organization is created', function () {
    test('it redirects the user on the organization details page with the tags tab opened', async function (assert) {
      // given
      const screen = await visit('/organizations/new');
      await fillByLabel('Nom', 'Stark Corp.');

      await click(screen.getByRole('button', { name: `Sélectionner un type d'organisation` }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'Établissement scolaire' }));

      await fillByLabel('Crédits', 120);
      await fillByLabel('Prénom du DPO', 'Justin');
      await fillByLabel('Nom du DPO', 'Ptipeu');
      await fillByLabel('Adresse e-mail du DPO', 'justin.ptipeu@example.net');

      // when
      await clickByName('Ajouter');

      // then
      assert.strictEqual(currentURL(), '/organizations/1/all-tags');
    });
  });
});
