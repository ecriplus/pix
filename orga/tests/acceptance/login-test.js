import { clickByName, fillByLabel, visit, within } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../helpers/setup-intl';
import { createPrescriberByUser, createUserWithMembershipAndTermsOfServiceAccepted } from '../helpers/test-init';

module('Acceptance | Login', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  let domainService;

  hooks.beforeEach(function () {
    domainService = this.owner.lookup('service:currentDomain');
    sinon.stub(domainService, 'getExtension');
  });

  module('When usePixOrgaNewAuthDesign is false', function (hooks) {
    hooks.beforeEach(function () {
      server.create('feature-toggle', {
        id: 0,
        usePixOrgaNewAuthDesign: false,
      });
    });

    test('renders legacy view', async function (assert) {
      // given & when
      const screen = await visit('/connexion');

      // then
      assert.dom('.authentication-layout__image').doesNotExist();
      const footerLink = screen.queryByRole('link', { name: t('navigation.footer.legal-notice') });
      assert.dom(footerLink).doesNotExist();
    });

    module('When on french domain (.fr)', function () {
      test('does not display locale switcher', async function (assert) {
        // given
        domainService.getExtension.returns('fr');

        // when
        const screen = await visit('/connexion');

        // then
        assert.dom(screen.queryByRole('button', { name: t('components.locale-switcher.label') })).doesNotExist();
      });
    });

    module('When on international domain (.org)', function () {
      module('when the user changes locale with the locale switcher', function () {
        test('displays the login page with the selected language', async function (assert) {
          // given
          domainService.getExtension.returns('org');

          // when
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

    test('User logs in', async function (assert) {
      // given
      const user = createUserWithMembershipAndTermsOfServiceAccepted();
      createPrescriberByUser({ user });

      const screen = await visit('/connexion');

      // when
      await fillByLabel(t('pages.login-form.email'), user.email);
      await fillByLabel(t('pages.login-form.password'), 'secret');
      await clickByName(t('pages.login-form.login'));

      // then
      const homepageHeading = screen.getByRole('heading', {
        name: t('components.index.organization-information.title'),
      });
      assert.dom(homepageHeading).exists();
    });
  });

  module('When usePixOrgaNewAuthDesign is true', function (hooks) {
    hooks.beforeEach(function () {
      server.create('feature-toggle', {
        id: 0,
        usePixOrgaNewAuthDesign: true,
      });
    });

    test('renders new layout', async function (assert) {
      // given & when
      const screen = await visit('/connexion');

      // then
      const authenticationLayoutImageContainer = document.querySelector('.authentication-layout__image');
      const image = within(authenticationLayoutImageContainer).getByAltText('');
      assert.dom(image).hasAttribute('src', '/images/authentication.svg');

      assert.dom(screen.queryByRole('link', { name: t('navigation.footer.legal-notice') })).exists();
    });

    module('When on french domain (.fr)', function () {
      test('does not display locale switcher', async function (assert) {
        // given
        domainService.getExtension.returns('fr');

        // when
        const screen = await visit('/connexion');

        // then
        assert.dom(screen.queryByRole('button', { name: t('components.locale-switcher.label') })).doesNotExist();
      });
    });

    module('When on international domain (.org)', function () {
      module('when the user changes locale with the locale switcher', function () {
        test('displays the login page with the selected language', async function (assert) {
          // given
          domainService.getExtension.returns('org');

          // when
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
      const homepageHeading = screen.getByRole('heading', {
        name: t('components.index.organization-information.title'),
      });
      assert.dom(homepageHeading).exists();
    });
  });
});
