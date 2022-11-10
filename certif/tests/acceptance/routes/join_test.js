import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, fillIn } from '@ember/test-helpers';
import { visit, clickByName } from '@1024pix/ember-testing-library';
import setupIntl from '../../helpers/setup-intl';

module('Acceptance | Routes | join', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  module('when a user wants to join a certification center', function () {
    test('it should allow the user to create his account and display the dashboard page', async function (assert) {
      // given
      const certificationCenterInvitation = server.create('certification-center-invitation', {
        id: 1,
        certificationCenterName: 'Super Centre de Certif',
      });

      // when
      const screen = await visit(`/rejoindre?invitationId=${certificationCenterInvitation.id}&code=ABCDEF123`);
      await fillIn(screen.getByRole('textbox', { name: 'Prénom' }), 'Prénom');
      await fillIn(screen.getByRole('textbox', { name: 'Nom' }), 'Nom');
      await fillIn(screen.getByRole('textbox', { name: 'Adresse e-mail' }), 'p.n@email.com');
      await fillIn('#register-password', 'Pa$$w0rd');
      await clickByName(`Accepter les conditions d'utilisation de Pix`);
      await clickByName(`Je m'inscris`);
      await clickByName(`J’accepte les conditions d’utilisation`);

      // then
      assert.strictEqual(currentURL(), '/sessions/liste');
    });
  });
});
