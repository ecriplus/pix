import { clickByName, fillByLabel, visit } from '@1024pix/ember-testing-library';
import { click, currentURL, fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

module('Acceptance | Organizations | Information management', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
  });

  module('editing organization', function () {
    test('should be able to edit organization information', async function (assert) {
      // given
      const organization = this.server.create('organization', {
        name: 'oldOrganizationName',
        features: {
          PLACES_MANAGEMENT: { active: false },
          LEARNER_IMPORT: { active: false },
          MULTIPLE_SENDING_ASSESSMENT: { active: false },
          COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: false },
          ATTESTATIONS_MANAGEMENT: { active: false },
          SHOW_NPS: { active: false },
          SHOW_SKILLS: { active: false },
          IS_MANAGING_STUDENTS: { active: false },
        },
        administrationTeamId: 456,
        countryCode: 99100,
      });
      this.server.create('organization', { id: '1234', features: { PLACES_MANAGEMENT: { active: true } } });

      const screen = await visit(`/organizations/${organization.id}`);

      await clickByName('Modifier');

      // when
      await fillIn(screen.getByLabelText(/Nom \*/), 'newOrganizationName');
      await fillByLabel('Prénom du DPO', 'Bru');
      await fillByLabel('Nom du DPO', 'No');
      await fillByLabel('Adresse e-mail du DPO', 'bru.no@example.net');

      await clickByName('Enregistrer');

      // then
      assert.dom(screen.getByRole('heading', { name: 'newOrganizationName', level: 1 })).exists();
      assert.dom(screen.getByText('Nom du DPO').nextElementSibling).hasText('Bru No');
      assert.dom(screen.getByText('Adresse e-mail du DPO').nextElementSibling).hasText('bru.no@example.net');
    });

    test('should display an error toast if administration team is not filled in', async function (assert) {
      // given
      const organization = this.server.create('organization', {
        name: 'oldOrganizationName',
        features: {
          PLACES_MANAGEMENT: { active: false },
          LEARNER_IMPORT: { active: false },
          MULTIPLE_SENDING_ASSESSMENT: { active: false },
          COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: false },
          ATTESTATIONS_MANAGEMENT: { active: false },
          SHOW_NPS: { active: false },
          SHOW_SKILLS: { active: false },
          IS_MANAGING_STUDENTS: { active: false },
        },
        administrationTeamId: null,
      });

      this.server.create('organization', { id: '1234', features: { PLACES_MANAGEMENT: { active: true } } });

      const screen = await visit(`/organizations/${organization.id}`);

      await clickByName('Modifier');

      // when
      await clickByName('Enregistrer');

      // then
      assert.dom(screen.getByText(t('components.organizations.editing.required-fields-error'))).exists();
    });
  });

  module('when PLACES_MANAGEMENT feature is enabled', function () {
    test('should display Places menu item', async function (assert) {
      // given
      const organization = this.server.create('organization', {
        name: 'organizationName',
        features: {
          PLACES_MANAGEMENT: { active: true },
        },
      });

      // when
      const screen = await visit(`/organizations/${organization.id}`);

      // then
      assert.dom(screen.getByRole('link', { name: t('pages.organization.navbar.places') })).exists();
    });
  });

  module('when PLACES_MANAGEMENT feature is disabled', function () {
    test('should not display Places menu item', async function (assert) {
      // given
      const organization = this.server.create('organization', {
        name: 'organizationName',
        features: {
          PLACES_MANAGEMENT: { active: false },
        },
      });

      // when
      const screen = await visit(`/organizations/${organization.id}`);

      // then
      assert.dom(screen.queryByRole('link', { name: t('pages.organization.navbar.places') })).doesNotExist();
    });
  });

  module('when organization is archived', function () {
    test('should redirect to organization target profiles page', async function (assert) {
      // given
      const organization = this.server.create('organization', {
        name: 'oldOrganizationName',
        archivedAt: '2022-12-25',
        archivistFullName: 'Clément Tine',
        features: { PLACES_MANAGEMENT: { active: true } },
      });

      // when
      await visit(`/organizations/${organization.id}`);

      // then
      assert.strictEqual(currentURL(), `/organizations/${organization.id}/target-profiles`);
    });

    test('should not allow user to access team page', async function (assert) {
      // given
      const organization = this.server.create('organization', {
        name: 'oldOrganizationName',
        archivedAt: '2022-12-25',
        archivistFullName: 'Clément Tine',
        features: { PLACES_MANAGEMENT: { active: true } },
      });

      // when
      const screen = await visit(`/organizations/${organization.id}/team`);

      // then
      assert.dom(screen.queryByLabelText('Équipe', { selector: 'a' })).doesNotExist();
      assert.strictEqual(currentURL(), `/organizations/${organization.id}/target-profiles`);
    });

    test('should not allow user to access invitation page', async function (assert) {
      // given
      const organization = this.server.create('organization', {
        name: 'oldOrganizationName',
        archivedAt: '2022-12-25',
        archivistFullName: 'Clément Tine',
        features: { PLACES_MANAGEMENT: { active: true } },
      });

      // when
      const screen = await visit(`/organizations/${organization.id}/invitations`);

      // then
      assert.dom(screen.queryByLabelText('Invitations')).doesNotExist();
      assert.strictEqual(currentURL(), `/organizations/${organization.id}/target-profiles`);
    });
  });

  module('when organization is not archived', function () {
    module('when user click on archive button', function () {
      test('should display confirmation modal', async function (assert) {
        // given
        const organization = this.server.create('organization', {
          name: 'Aude Javel Company',
          features: { PLACES_MANAGEMENT: { active: true } },
        });
        const screen = await visit(`/organizations/${organization.id}`);

        // when
        await clickByName("Archiver l'organisation");

        await screen.findByRole('dialog');

        // then
        assert.dom(screen.getByRole('heading', { name: "Archiver l'organisation Aude Javel Company" })).exists();
        assert.dom(screen.getByText('Êtes-vous sûr de vouloir archiver cette organisation ?')).exists();
      });

      module('when user confirms archiving', function () {
        test('should archive organization and display archiving details', async function (assert) {
          // given
          const organization = this.server.create('organization', {
            name: 'Aude Javel Company',
            features: { PLACES_MANAGEMENT: { active: true } },
          });
          const screen = await visit(`/organizations/${organization.id}`);
          await clickByName("Archiver l'organisation");

          await screen.findByRole('dialog');
          // when
          await clickByName('Confirmer');

          // then
          assert.dom(screen.getByText('Cette organisation a bien été archivée.')).exists();
          assert.dom(screen.getByText('Archivée le 02/02/2022 par Clément Tine.')).exists();
        });

        module('when organization has at least one active places lot', function () {
          test('should display an error notification', async function (assert) {
            // given
            const organization = this.server.create('organization', {
              name: 'Aude Javel Company',
            });
            this.server.post(
              '/admin/organizations/:id/archive',
              () => ({
                errors: [
                  {
                    code: 'ARCHIVE_ORGANIZATION_ERROR',
                    status: '422',
                  },
                ],
              }),
              422,
            );
            const screen = await visit(`/organizations/${organization.id}`);
            await clickByName("Archiver l'organisation");

            await screen.findByRole('dialog');
            // when
            await clickByName('Confirmer');

            // then
            assert
              .dom(screen.getByText("Impossible d'archiver une organisation ayant au moins 1 lot de places actif."))
              .exists();
            assert.dom(screen.queryByLabelText('Archivée le 02/02/2022 par Clément Tine.')).doesNotExist();
          });
        });

        test('should display error notification when archiving was not successful', async function (assert) {
          // given
          const organization = this.server.create('organization', {
            name: 'Aude Javel Company',
            features: { PLACES_MANAGEMENT: { active: true } },
          });
          this.server.post(
            '/admin/organizations/:id/archive',
            () => ({
              errors: [
                {
                  status: '422',
                },
              ],
            }),
            422,
          );
          const screen = await visit(`/organizations/${organization.id}`);
          await clickByName("Archiver l'organisation");

          await screen.findByRole('dialog');
          // when
          await clickByName('Confirmer');

          // then
          assert.dom(screen.getByText("L'organisation n'a pas pu être archivée.")).exists();
          assert.dom(screen.queryByLabelText('Archivée le 02/02/2022 par Clément Tine.')).doesNotExist();
        });

        test('should display error notification for other errors', async function (assert) {
          // given
          const organization = this.server.create('organization', {
            name: 'Aude Javel Company',
          features: { PLACES_MANAGEMENT: { active: true } },});
          this.server.post(
            '/admin/organizations/:id/archive',
            () => ({
              errors: [
                {
                  status: '500',
                },
              ],
            }),
            500,
          );
          const screen = await visit(`/organizations/${organization.id}`);
          await clickByName("Archiver l'organisation");

          await screen.findByRole('dialog');
          // when
          await clickByName('Confirmer');

          // then
          assert.dom(screen.getByText('Une erreur est survenue.')).exists();
          assert.dom(screen.queryByLabelText('Archivée le 02/02/2022 par Clément Tine.')).doesNotExist();
        });
      });

      module('when user click on cancel actions', function () {
        test('should close confirmation modal with cancel button', async function (assert) {
          // given
          const organization = this.server.create('organization', {
            name: 'Aude Javel Company',
          });
          const screen = await visit(`/organizations/${organization.id}`);
          await clickByName("Archiver l'organisation");

          await screen.findByRole('dialog');

          // when
          await clickByName('Annuler');

          // then
          assert.dom(screen.queryByLabelText('Archivée le 02/02/2022 par Clément Tine.')).doesNotExist();
        });

        test('should close confirmation modal with modal close button', async function (assert) {
          // given
          const organization = this.server.create('organization', {
            name: 'Aude Javel Company',
          });
          const screen = await visit(`/organizations/${organization.id}`);
          await clickByName("Archiver l'organisation");

          await screen.findByRole('dialog');
          // when
          await click(screen.getByRole('button', { name: 'Fermer' }));

          // then
          assert.dom(screen.queryByLabelText('Archivée le 02/02/2022 par Clément Tine.')).doesNotExist();
        });
      });
    });
  });
});
