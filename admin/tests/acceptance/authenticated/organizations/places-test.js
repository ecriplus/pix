import { visit } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

module('Acceptance | Organizations | places', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('when PLACES_MANAGEMENT feature is enabled', function () {
    module('When user is authenticated as support', function (hooks) {
      let ownerOrganizationId;
      hooks.beforeEach(async function () {
        ownerOrganizationId = this.server.create('organization', {
          name: 'Orga name',
          features: { PLACES_MANAGEMENT: { active: true } },
        }).id;
        await authenticateAdminMemberWithRole({ isSupport: true })(server);
      });

      test('should display organization places', async function (assert) {
        // given
        this.server.create('organization-place', {
          count: 7777,
          reference: 'FFVII',
          category: 'SquareEnix',
          status: 'ACTIVE',
          activationDate: '1997-01-31',
          expirationDate: '2100-12-31',
          createdAt: '1996-01-12',
          creatorFullName: 'Hironobu Sakaguchi',
        });

        // when
        const screen = await visit(`/organizations/${ownerOrganizationId}/places`);

        // then
        assert.dom(screen.getByText('FFVII')).exists();
      });

      test('should not diplay add places lot button', async function (assert) {
        // given

        // when
        const screen = await visit(`/organizations/${ownerOrganizationId}/places`);

        // then
        assert.dom(screen.queryByText('Ajouter des places')).doesNotExist();
      });
    });

    module('When user is authenticated as super admin', function (hooks) {
      let ownerOrganizationId;
      hooks.beforeEach(async function () {
        ownerOrganizationId = this.server.create('organization', {
          name: 'Orga name',
          features: { PLACES_MANAGEMENT: { active: true } },
        }).id;
        await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
      });

      test('should go to add places lot page', async function (assert) {
        // given

        const screen = await visit(`/organizations/${ownerOrganizationId}/places`);
        // when
        await click(screen.getByRole('link', { name: 'Ajouter des places' }));

        // then
        assert.strictEqual(currentURL(), `/organizations/${ownerOrganizationId}/places/new`);
      });
    });
  });

  module('when PLACES_MANAGEMENT feature is disabled', function () {
    test('should redirect to organization details page', async function (assert) {
      // given
      const ownerOrganizationId = this.server.create('organization', {
        name: 'Orga name',
        features: { PLACES_MANAGEMENT: { active: false } },
      }).id;
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

      // when
      await visit(`/organizations/${ownerOrganizationId}/places`);

      // then
      assert.strictEqual(currentURL(), `/organizations/${ownerOrganizationId}/team`);
    });
  });
});
