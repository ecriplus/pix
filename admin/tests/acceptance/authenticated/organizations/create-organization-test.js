import { clickByName, fillByLabel, visit } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

import setupIntl from '../../../helpers/setup-intl';

module('Acceptance | Organizations | Create', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    this.intl = this.owner.lookup('service:intl');
    server.create('country', { code: '99100', name: 'France' });

    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
  });

  test('it should set organizations menubar item active', async function (assert) {
    // when
    const screen = await visit('/organizations/new');

    // then
    assert.dom(screen.getByRole('link', { name: 'Organisations' })).hasClass('active');
  });

  module('when creating an organization without a parent organization', function () {
    test('it shows the creation form without parent organization name', async function (assert) {
      // when
      const screen = await visit('/organizations/new');

      // then
      assert.dom(screen.queryByText('Organisation mère', { exact: false })).doesNotExist();
      assert.dom(screen.getByText('Nouvelle organisation')).exists();
      assert.dom(screen.getByRole('button', { name: this.intl.t('common.actions.add') })).exists();
    });

    test('it redirects the user to organizations list when cancelling', async function (assert) {
      // given
      const screen = await visit('/organizations/new');

      // when
      const cancelButton = await screen.getByRole('button', { name: this.intl.t('common.actions.cancel') });
      await click(cancelButton);

      // then
      assert.strictEqual(currentURL(), '/organizations/list');
    });
  });

  module('when creating an organization with a parent organization', function (hooks) {
    let parentOrganization;

    hooks.beforeEach(function () {
      parentOrganization = server.create('organization', { name: 'Wayne Enterprises' });
    });

    test('it shows the creation form with parent organization name', async function (assert) {
      // when
      const screen = await visit(
        `/organizations/new?parentOrganizationId=${parentOrganization.id}&parentOrganizationName=${encodeURIComponent(
          parentOrganization.name,
        )}`,
      );

      // then
      assert
        .dom(
          screen.getByRole('heading', {
            name: this.intl.t('components.organizations.creation.parent-organization-name', {
              parentOrganizationName: parentOrganization.name,
            }),
            level: 2,
          }),
        )
        .exists();
      assert.dom(screen.getByText('Nouvelle organisation fille')).exists();
      assert
        .dom(
          screen.getByRole('button', {
            name: this.intl.t('components.organizations.creation.actions.add-child-organization'),
          }),
        )
        .exists();
    });

    test('it redirects the user to parent organization page when cancelling', async function (assert) {
      // given
      const screen = await visit(
        `/organizations/new?parentOrganizationId=${parentOrganization.id}&parentOrganizationName=${encodeURIComponent(
          parentOrganization.name,
        )}`,
      );
      // when
      const cancelButton = await screen.getByRole('button', { name: this.intl.t('common.actions.cancel') });
      await click(cancelButton);

      // then
      assert.strictEqual(currentURL(), `/organizations/${parentOrganization.id}/children`);
    });
  });

  module('when an organization is created', function () {
    test('it redirects the user on the organization details page on tags tab', async function (assert) {
      // given
      const screen = await visit('/organizations/new');
      await fillByLabel('Nom *', 'Stark Corp.');

      await click(screen.getByRole('button', { name: `Sélectionner un type d'organisation *` }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'Établissement scolaire' }));

      await click(
        screen.getByRole('button', {
          name: `${t('components.organizations.creation.administration-team.selector.label')} *`,
        }),
      );
      await screen.findByRole('listbox');
      await click(screen.getByText('Équipe 2'));

      await click(
        screen.getByRole('button', {
          name: `${t('components.organizations.creation.country.selector.label')} *`,
        }),
      );
      await screen.findByRole('listbox');
      await click(screen.getByText('France (99100)'));

      await fillByLabel('Crédits', 120);

      await fillByLabel('Prénom du DPO', 'Justin');
      await fillByLabel('Nom du DPO', 'Ptipeu');
      await fillByLabel('Adresse e-mail du DPO', 'justin.ptipeu@example.net');

      // when
      await clickByName('Ajouter');

      // then
      assert.strictEqual(currentURL(), '/organizations/1/all-tags');
    });

    test('it shows validation errors if form is not correctly filled', async function (assert) {
      // given
      const screen = await visit('/organizations/new');
      await fillByLabel('Nom *', 'Stark Corp.');

      // when
      await clickByName('Ajouter');

      // then
      assert.dom(screen.getByText(t('components.organizations.creation.required-fields-error'))).exists();
    });
  });
});
