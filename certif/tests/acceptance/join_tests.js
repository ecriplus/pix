import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupIntl from '../helpers/setup-intl';
import {
  createCertificationPointOfContactWithTermsOfServiceNotAccepted,
  createCertificationPointOfContactWithTermsOfServiceAccepted,
} from '../helpers/test-init';
import { currentSession } from 'ember-simple-auth/test-support';
import { clickByName, fillByLabel, visit, currentURL } from '@1024pix/ember-testing-library';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | join ', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  let loginFormButton;

  hooks.beforeEach(function () {
    loginFormButton = this.intl.t('pages.login-or-register.login-form.login');
  });

  module('Login', function (hooks) {
    let emailInputLabel;
    let passwordInputLabel;
    let loginButton;
    let toogleloginFormButton;

    hooks.beforeEach(function () {
      emailInputLabel = this.intl.t('pages.login-or-register.login-form.fields.email.label');
      passwordInputLabel = this.intl.t('pages.login-or-register.login-form.fields.password.label');
      loginButton = this.intl.t('pages.login-or-register.login-form.login');
      toogleloginFormButton = this.intl.t('pages.login-or-register.login-form.button');
    });

    module(
      'When certification center member is logging in but has not accepted terms of service yet',
      function (hooks) {
        let certificationCenterInvitationId;
        let code;
        let certificationPointOfContact;

        hooks.beforeEach(() => {
          certificationPointOfContact = createCertificationPointOfContactWithTermsOfServiceNotAccepted();
          code = 'ABCDEFGH01';
          certificationCenterInvitationId = '1234';
        });

        test('it should redirect user to the terms-of-service page', async function (assert) {
          // given
          await visit(`/rejoindre?invitationId=${certificationCenterInvitationId}&code=${code}`);
          await clickByName(toogleloginFormButton);
          await fillByLabel(emailInputLabel, certificationPointOfContact.email);
          await fillByLabel(passwordInputLabel, 'secret');

          // when
          await clickByName(loginFormButton);

          // then
          assert.strictEqual(currentURL(), '/cgu');
          assert.ok(currentSession(this.application).get('isAuthenticated'), 'The user is authenticated');
        });
      }
    );

    module('When certification center member is logging in and has accepted terms of service', function (hooks) {
      let certificationCenterInvitationId;
      let code;
      let certificationCenterPointOfContactWithCgus;

      hooks.beforeEach(() => {
        certificationCenterPointOfContactWithCgus = createCertificationPointOfContactWithTermsOfServiceAccepted();
        code = 'ABCDEFGH01';
        certificationCenterInvitationId = '12345';
      });

      test('it should redirect user to the campaigns list', async function (assert) {
        // given
        await visit(`/rejoindre?invitationId=${certificationCenterInvitationId}&code=${code}`);
        await clickByName(toogleloginFormButton);
        await fillByLabel(emailInputLabel, 'email@toto.com');
        await fillByLabel(passwordInputLabel, 'secret');

        // when
        await clickByName(loginFormButton);
        await this.pauseTest();

        // then
        //       await invalidateSession();
        // Fait un post sur api token qui renvoie une 404 > pas connecté
        assert.strictEqual(currentURL(), '/campagnes/les-miennes');
        assert.ok(currentSession(this.application).get('isAuthenticated'), 'The user is authenticated');
      });

      test('it should show prescriber name', async function (assert) {
        // given
        await visit(`/rejoindre?invitationId=${certificationCenterInvitationId}&code=${code}`);
        await clickByName(loginFormButton);
        await fillByLabel(emailInputLabel, certificationCenterPointOfContactWithCgus.email);
        await fillByLabel(passwordInputLabel, 'secret');

        // when
        await clickByName(loginButton);

        // then
        assert.ok(currentSession(this.application).get('isAuthenticated'), 'The user is authenticated');

        assert.contains('Harry Cover');
      });
    });
  });
});
