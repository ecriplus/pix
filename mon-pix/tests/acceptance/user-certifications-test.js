import { visit } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { authenticate } from '../helpers/authentication';

module('Acceptance | User certifications page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  let userWithNoCertificates;

  hooks.beforeEach(function () {
    userWithNoCertificates = server.create('user', 'withEmail');
  });

  module('Access to the user certifications page', function () {
    test('should not be accessible when user is not connected', async function (assert) {
      // when
      await visit('/mes-certifications');

      // then
      assert.strictEqual(currentURL(), '/connexion');
    });

    test('should be accessible when user is connected', async function (assert) {
      // given
      await authenticate(userWithNoCertificates);

      // when
      const screen = await visit('/mes-certifications');

      // then
      assert.strictEqual(currentURL(), '/mes-certifications');
      assert.dom(screen.getByRole('heading', { name: t('pages.certifications-list.title') })).exists();
    });
  });

  module('when user has some certificates', function () {
    test('should access to the certificate page', async function (assert) {
      // given
      const userWithSomeCertificates = server.create('user', 'withEmail', 'withSomeCertificates');
      await authenticate(userWithSomeCertificates);
      const screen = await visit('/mes-certifications');

      // when
      await click(screen.getByText(t('pages.certifications-list.buttons.details')));

      // then
      assert.strictEqual(currentURL(), '/mes-certifications/2');
    });
  });
});
