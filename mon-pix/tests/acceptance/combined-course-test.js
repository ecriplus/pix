import { getScreen } from '@1024pix/ember-testing-library';
import { click, currentURL, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import setupIntl from '../helpers/setup-intl';
import { unabortedVisit } from '../helpers/unaborted-visit';
module('Acceptance | CombinedCourse', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks, 'fr');
  let screen, user;

  async function _loginUser(screen, user) {
    await fillIn(screen.getByLabelText('Adresse e-mail ou identifiant', { exact: false }), user.email);
    await fillIn(screen.getByLabelText('Mot de passe', { exact: false }), user.password);
    await click(screen.getByRole('button', { name: 'Je me connecte' }));
  }

  module('when user is not logged in', function () {
    module('when combinedCourse is found', function () {
      test('should redirect to login page before accessing combined course page', async function (assert) {
        //given
        user = server.create('user', 'withEmail', { hasSeenAssessmentInstructions: false });
        server.create('verified-code', { id: 'combinix1', type: 'combined-course' });
        // when
        await unabortedVisit('/parcours/COMBINIX1');
        screen = getScreen();

        await _loginUser(screen, user);

        assert.strictEqual(currentURL(), '/parcours/COMBINIX1');
      });
    });
    module('when given code matches a campaign code', function () {
      test('should login user and redirect to CombinedCourse page', async function (assert) {
        //given
        server.create('verified-code', { id: 'iscampaign', type: 'campaign' });

        // when
        await unabortedVisit('/parcours/ISCAMPAIGN');
        screen = getScreen();
        assert.dom(screen.getByText(t('pages.error.first-title'))).exists();
      });
    });
  });
});
