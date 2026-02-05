import { clickByText, fillByLabel, visit } from '@1024pix/ember-testing-library';
import { setupIntl } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Acceptance | organization invitations management', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks, 'fr');

  const now = new Date('2019-01-01T05:06:07Z');

  let intl;

  hooks.beforeEach(function () {
    intl = this.owner.lookup('service:intl');
    sinon.stub(Date, 'now').returns(now);
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('should display invitations tab', async function (assert) {
    // given
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
    const organization = this.server.create('organization', {
      name: 'Orga name',
      features: { PLACES_MANAGEMENT: { active: true } },
    });

    // when
    const screen = await visit(`/organizations/${organization.id}`);

    // then
    assert.dom(screen.getByText('Invitations (0)')).exists();
  });

  module('inviting a member', function () {
    test('should create an organization-invitation', async function (assert) {
      // given
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
      const organization = this.server.create('organization', {
        name: 'Orga name',
        features: { PLACES_MANAGEMENT: { active: true } },
      });

      // when
      const screen = await visit(`/organizations/${organization.id}/invitations`);
      await fillByLabel('Adresse e-mail du membre à inviter', 'user@example.com');

      await clickByText('Inviter');

      // then
      assert.dom(screen.getByText("Un email a bien a été envoyé à l'adresse user@example.com.")).exists();
      assert.dom(screen.getByText(intl.formatDate(now, { format: 'medium' }))).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Adresse e-mail du membre à inviter' })).hasNoValue();
    });

    test('should display an error if the creation has failed', async function (assert) {
      // given
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
      const organization = this.server.create('organization', {
        name: 'Orga name',
        features: { PLACES_MANAGEMENT: { active: true } },
      });

      this.server.post(
        '/admin/organizations/:id/invitations',
        () => ({ errors: [{ status: '500', title: 'An error occurred' }] }),
        500,
      );

      // when
      const screen = await visit(`/organizations/${organization.id}/invitations`);
      await fillByLabel('Adresse e-mail du membre à inviter', 'user@example.com');

      await clickByText('Inviter');

      // then
      assert.dom(screen.queryByText(intl.formatDate(now, { format: 'medium' }))).doesNotExist();
      assert.dom(screen.getByText('Une erreur s’est produite, veuillez réessayer.')).exists();
    });
  });
});
