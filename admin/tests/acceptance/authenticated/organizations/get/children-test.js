import { clickByName, fillByLabel, visit, within } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import setupIntl from 'pix-admin/tests/helpers/setup-intl';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

import { waitForDialogClose } from '../../../../helpers/wait-for';

module('Acceptance | Organizations | Children', function (hooks) {
  setupApplicationTest(hooks);
  setupIntl(hooks);
  setupMirage(hooks);

  module('when user has role "SUPER_ADMIN"', function (hooks) {
    hooks.beforeEach(async function () {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    });

    test('"Organisations filles" tab exists', async function (assert) {
      // given
      const organizationId = this.server.create('organization', { name: 'Orga name' }).id;

      // when
      const screen = await visit(`/organizations/${organizationId}/children`);

      // then
      assert.strictEqual(currentURL(), `/organizations/${organizationId}/children`);
      assert.dom(screen.getByRole('link', { name: 'Organisations filles (0)' })).hasClass('active');
    });

    test('Displays the number of child organisations in tab name', async function (assert) {
      // given
      const parentOrganizationId = this.server.create('organization', { id: 1, name: 'Orga name' }).id;
      this.server.create('organization', { id: 2, parentOrganizationId: 1, name: 'Child' });

      // when
      const screen = await visit(`/organizations/${parentOrganizationId}/children`);

      // then
      assert.dom(screen.getByRole('link', { name: 'Organisations filles (1)' })).hasClass('active');
    });

    module('when there is no child organization', function () {
      test('displays a message', async function (assert) {
        // given
        const organizationId = this.server.create('organization', { name: 'Orga name' }).id;
        this.server.get(`/admin/organizations/${organizationId}/children`, () => ({ data: [] }));

        // when
        const screen = await visit(`/organizations/${organizationId}/children`);

        // then
        assert.dom(screen.getByText('Aucune organisation fille')).exists();
        assert.dom(screen.getByRole('heading', { name: 'Organisations filles', level: 2 })).exists();
      });
    });

    module('when there is at least one child organization', function () {
      test('displays a list of child organizations', async function (assert) {
        // given
        const parentOrganizationId = this.server.create('organization', { id: 1, name: 'Orga name' }).id;
        this.server.create('organization', { id: 2, parentOrganizationId: 1, name: 'Child' });

        // when
        const screen = await visit(`/organizations/${parentOrganizationId}/children`);

        // then
        assert.dom(screen.queryByText('Aucune organisation fille')).doesNotExist();
        assert.dom(screen.getByRole('table', { name: 'Liste des organisations filles' })).exists();
      });
    });

    module('when attaching child organization', function () {
      test('attaches child organization to parent organization and displays success notification', async function (assert) {
        // given
        const parentOrganization = this.server.create('organization', { id: 1, name: 'Parent Organization Name' });
        this.server.create('organization', { id: 2, name: 'Child Organization Name' });
        const screen = await visit(`/organizations/${parentOrganization.id}/children`);
        await fillByLabel(`Ajouter une ou plusieurs organisations filles ID d'organisation(s) à ajouter`, '2');

        // when
        await clickByName('Ajouter');

        // then
        assert.dom(await screen.findByRole('cell', { name: 'Child Organization Name' })).exists();
        assert.dom(screen.getByText(`L'organisation fille a bien été liée à l'organisation mère`)).exists();
      });
    });

    module('when detaching child organization', function () {
      test('it should display success notification and remove child organization from list', async function (assert) {
        // given
        const parentOrganization = this.server.create('organization', { id: 1, name: 'Parent Organization Name' });
        this.server.create('organization', {
          id: 2,
          name: 'Child Organization Name',
          parentOrganizationId: parentOrganization.id,
        });
        const screen = await visit(`/organizations/${parentOrganization.id}/children`);

        // when
        await click(
          screen.getByRole('button', {
            name: t('components.organizations.children-list.actions.detach.button'),
          }),
        );

        const modal = await screen.findByRole('dialog');
        await click(within(modal).getByRole('button', { name: t('common.actions.confirm') }));

        await waitForDialogClose();

        // then
        assert.ok(
          await screen.findByText(t('pages.organization-children.notifications.success.detach-child-organization')),
        );
      });
    });

    module('when creating child organization from parent page', function () {
      test('it should redirect to New organization page, with parent infos in query params', async function (assert) {
        // given
        const parentOrganization = this.server.create('organization', { id: 1, name: 'Parent Organization Name' });
        const screen = await visit(`/organizations/${parentOrganization.id}/children`);

        // when
        await click(
          screen.getByRole('link', { name: t('components.organizations.children.create-child-organization-button') }),
        );

        const expectedQueryParams = `?parentOrganizationId=${parentOrganization.id}&parentOrganizationName=${encodeURIComponent(parentOrganization.name)}`;

        // then
        assert.strictEqual(currentURL(), `/organizations/new${expectedQueryParams}`);
      });
    });
  });

  [
    { name: 'METIER', authData: { isMetier: true } },
    { name: 'SUPPORT', authData: { isSupport: true } },
  ].forEach((role) => {
    module(`when user has role "${role.name}"`, function (hooks) {
      let parentOrganizationId;

      hooks.beforeEach(async function () {
        await authenticateAdminMemberWithRole(role.authData)(server);
        parentOrganizationId = this.server.create('organization', { name: 'Parent Orga name' }).id;
      });

      test('it displays actions section with create child organization button', async function (assert) {
        // when
        const screen = await visit(`/organizations/${parentOrganizationId}/children`);

        // then
        assert.ok(
          screen.getByRole('link', { name: t('components.organizations.children.create-child-organization-button') }),
        );
      });
    });
  });

  module('when user has role "CERTIF"', function () {
    test('it should not display actions section', async function (assert) {
      await authenticateAdminMemberWithRole({ isCertif: true })(server);
      const parentOrganizationId = this.server.create('organization', { name: 'Parent Orga name' }).id;
      this.server.create('organization', { name: 'Child Orga name', parentOrganizationId });

      // when
      const screen = await visit(`/organizations/${parentOrganizationId}/children`);

      // then
      assert.notOk(
        screen.queryByRole(('link', { name: t('components.organizations.children.create-child-organization-button') })),
      );
    });
  });
});
