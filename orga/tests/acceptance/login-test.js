import { clickByName, fillByLabel, visit } from '@1024pix/ember-testing-library';
import { click, currentURL, settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import setupIntl from '../helpers/setup-intl';
import {
  createPrescriberByUser,
  createUserWithMembershipAndTermsOfServiceAccepted,
} from '../helpers/test-init';
import sinon from 'sinon';

module('Acceptance | Login', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  let domainService;

  hooks.beforeEach(function () {
    domainService = this.owner.lookup('service:currentDomain');
    sinon.stub(domainService, 'getExtension')
  });

  test('User logs in', async function (assert) {
    // given
    domainService.getExtension.returns('fr');
    const user = createUserWithMembershipAndTermsOfServiceAccepted();
    createPrescriberByUser({ user });

    const screen = await visit('/connexion');

    // when
    await fillByLabel(t('pages.login-form.email'), user.email);
    await fillByLabel(t('pages.login-form.password'), 'secret');
    await clickByName(t('pages.login-form.login'));

    // then
    const homepageHeading = screen.getByRole('heading', { name: t('components.index.organization-information.title') });
    assert.dom(homepageHeading).exists();
  });

  module('When on french domain (.fr)', function(){
    test('does not display locale switcher', async function (assert) {
      // given & when
      domainService.getExtension.returns('fr');

      const screen = await visit('/connexion');

      assert.dom(screen.queryByRole('button', { name: t('components.locale-switcher.label') })).doesNotExist();

    })
  })

  module('When on international domain (.org)', function () {
    module('when the user changes locale with the locale switcher', function () {
      test('displays the login page with the selected language', async function (assert) {
        // given & when
        domainService.getExtension.returns('org');

        const screen = await visit('/connexion?lang=en');
        await click(screen.getByRole('button', { name: t('components.locale-switcher.label') }));
        await screen.findByRole('listbox');
        await click(screen.getByRole('option', { name: 'Français' }));

        // then
        assert.strictEqual(currentURL(), '/connexion');
        assert.dom(screen.getByRole('heading', { name: 'Connectez-vous', level: 1 })).exists();
      });
    });
  });
});
