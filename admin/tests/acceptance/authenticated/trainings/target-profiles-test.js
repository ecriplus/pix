import { clickByName, fillByLabel, visit, within } from '@1024pix/ember-testing-library';
import { currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { module, test } from 'qunit';

module('Acceptance | Trainings | Target profiles', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks, 'fr');

  let trainingId, targetProfileSummaryId;

  hooks.beforeEach(async function () {
    trainingId = 2;
    targetProfileSummaryId = 1111;

    const targetProfileSummary = server.create('target-profile-summary', {
      id: targetProfileSummaryId,
      internalName: 'Super profil cible 2',
    });
    server.create('training', {
      id: 2,
      title: 'Devenir tailleur de citrouille',
      link: 'http://www.example2.net',
      type: 'autoformation',
      duration: '10:00:00',
      locale: 'fr-fr',
      editorName: "Ministère de l'éducation nationale et de la jeunesse. Liberté égalité fraternité",
      editorLogoUrl: 'https://mon-logo.svg',
      prerequisiteThreshold: null,
      goalThreshold: null,
      targetProfileSummaries: [targetProfileSummary],
    });
    server.create('target-profile', {});
  });

  module('When admin member is not logged in', function () {
    test('it should not be accessible by an unauthenticated user', async function (assert) {
      // when
      await visit(`/trainings/1/target-profiles`);

      // then
      assert.strictEqual(currentURL(), '/login');
    });
  });

  module('When admin member is logged in', function () {
    test('it should be accessible by an authenticated user : prerequisite edit', async function (assert) {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

      // when
      await visit(`/trainings/${trainingId}/target-profiles`);

      // then
      assert.strictEqual(currentURL(), `/trainings/${trainingId}/target-profiles`);
    });

    module('when admin role is "SUPER_ADMIN" or "METIER"', function () {
      test('is should attach a target profile to a training', async function (assert) {
        await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
        server.create('target-profile-summary', { id: 1, internalName: 'Super profil cible' });

        // when
        const screen = await visit(`/trainings/${trainingId}/target-profiles`);
        await fillByLabel('ID du ou des profil(s) cible(s)', '1');
        await clickByName('Valider');

        // then
        assert.dom(await screen.findByRole('link', { name: 'Super profil cible' })).exists();
      });

      test('it should be able to detach a target profile to a training', async function (assert) {
        await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

        // when
        const screen = await visit(`/trainings/${trainingId}/target-profiles`);
        await clickByName('Détacher');

        // then
        assert.dom(await screen.findByText('Aucun profil cible associé à ce contenu formatif')).exists();
      });

      module('When isFilteringRecommendedTrainingByOrganizationsEnabled feature toggle is true', function (hooks) {
        hooks.beforeEach(function () {
          server.create('feature-toggle', {
            id: 0,
            isFilteringRecommendedTrainingByOrganizationsEnabled: true,
          });
        });

        test('it displays a filter link within row of target profiles table', async function (assert) {
          // given
          await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

          // when
          const screen = await visit(`/trainings/${trainingId}/target-profiles`);

          // then
          const table = screen.getByRole('table');
          assert.dom(within(table).getByRole('link', { name: 'Filtrer par organisations' })).exists();
        });

        module('when clicking on filter button', function () {
          test('it redirects to filter organizations page', async function (assert) {
            // given
            await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
            server.create('target-profile-summary', { id: 1, internalName: 'Super profil cible' });

            // when
            const screen = await visit(`/trainings/${trainingId}/target-profiles`);
            await clickByName('Filtrer par organisations');

            // then
            assert.dom(await screen.findByRole('heading', { name: 'Filtrer par organisations' })).exists();
            assert.strictEqual(
              currentURL(),
              `/trainings/${trainingId}/target-profiles/${targetProfileSummaryId}/organizations`,
            );
          });
        });
      });

      module('When isFilteringRecommendedTrainingByOrganizationsEnabled feature toggle is false', function () {
        test('it should not display a filter link', async function (assert) {
          // given
          server.create('feature-toggle', {
            id: 0,
            isFilteringRecommendedTrainingByOrganizationsEnabled: false,
          });
          await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

          // when
          const screen = await visit(`/trainings/${trainingId}/target-profiles`);

          // then
          const table = screen.getByRole('table');
          assert.dom(within(table).queryByRole('link', { name: 'Filtrer par organisations' })).doesNotExist();
        });
      });
    });

    module('when admin role is "SUPPORT"', function () {
      test('is should not be able to attach a target profile to a training', async function (assert) {
        // given
        await authenticateAdminMemberWithRole({ isSupport: true })(server);
        server.create('target-profile-summary', { id: 1, internalName: 'Super profil cible' });

        // when
        const screen = await visit(`/trainings/${trainingId}/target-profiles`);

        // then
        assert.dom(screen.queryByText('ID du ou des profil(s) cible(s)')).doesNotExist();
      });
    });
  });
});
