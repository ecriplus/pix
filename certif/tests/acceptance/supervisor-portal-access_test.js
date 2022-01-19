import { module, test } from 'qunit';
import { fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { visit as visitScreen } from '@1024pix/ember-testing-library';
import { authenticateSession } from '../helpers/test-init';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Supervisor Portal', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const certificationPointOfContact = server.create('certification-point-of-contact', {
      firstName: 'Buffy',
      lastName: 'Summers',
      pixCertifTermsOfServiceAccepted: true,
      allowedCertificationCenterAccesses: [],
    });
    await authenticateSession(certificationPointOfContact.id);

    server.create('session-for-supervising', { id: 12345 });
  });

  module('When supervisor authentication is successful', function () {
    test('it should redirect to supervising page', async function (assert) {
      // given
      const screen = await visitScreen('/connexion-espace-surveillant');
      await fillIn(screen.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
      await fillIn(screen.getByLabelText('Mot de passe de la session'), '6789');

      // when
      await click(screen.getByRole('button', { name: 'Surveiller la session' }));

      // then
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(currentURL(), '/sessions/12345/surveiller');
    });
  });

  module('When supervisor is supervising a session', function () {
    module('When quit button is clicked', function () {
      test('it should redirect to the supervisor authentication page', async function (assert) {
        // given
        const screen = await visitScreen('/connexion-espace-surveillant');
        await fillIn(screen.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
        await fillIn(screen.getByLabelText('Mot de passe de la session'), '6789');
        await click(screen.getByRole('button', { name: 'Surveiller la session' }));

        // when
        await click(screen.getByText('Quitter'));

        // then
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(currentURL(), '/connexion-espace-surveillant');
      });
    });
  });
});
