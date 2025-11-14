import { clickByName, fillByLabel, render as renderScreen } from '@1024pix/ember-testing-library';
import { triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import ENV from '../../../../config/environment';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
const ApiErrorMessages = ENV.APP.API_ERROR_MESSAGES;

module('Integration | Component | Authentication::LoginForm', function (hooks) {
  setupIntlRenderingTest(hooks);

  let sessionService;
  let storeService;
  let emailInputLabel;
  let passwordInputLabel;
  let loginLabel;
  let featureToggles;

  hooks.beforeEach(function () {
    sessionService = this.owner.lookup('service:session');
    featureToggles = this.owner.lookup('service:featureToggles');
    storeService = this.owner.lookup('service:store');

    emailInputLabel = t('pages.login-form.email.label');
    loginLabel = t('pages.login-form.login');
    passwordInputLabel = t('pages.login-form.password');
  });

  module('When feature toggle usePixOrgaNewAuthDesign is not enabled', function (hooks) {
    hooks.beforeEach(function () {
      sinon.stub(featureToggles, 'featureToggles').value({ usePixOrgaNewAuthDesign: false });
    });
    module('When the login form is displayed', function () {
      test('it asks for email and password', async function (assert) {
        // given & when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('#login-email').exists();
        assert.dom('#login-password').exists();
      });

      test('[a11y] it displays a message that all inputs are required', async function (assert) {
        // given & when
        const screen = await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom(screen.getByText('Tous les champs sont obligatoires.')).exists();
      });

      test('it displays no error message', async function (assert) {
        // given & when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('#login-form-error-message').doesNotExist();
      });
    });

    module('When there are spaces in email', function () {
      test('it gets rid of spaces', async function (assert) {
        // given
        sinon.stub(sessionService, 'authenticate');
        sessionService.authenticate.resolves();
        await renderScreen(
          hbs`<Authentication::LoginForm @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );
        await fillByLabel(emailInputLabel, ' pix@example.net ');
        await fillByLabel(passwordInputLabel, 'JeMeLoggue1024');

        // when
        await clickByName(loginLabel);

        // then
        assert.ok(sessionService.authenticate.calledWith('authenticator:oauth2', 'pix@example.net', 'JeMeLoggue1024'));
      });
    });

    module('Error cases', function () {
      module('when inputs have invalid formats', function () {
        test('it displays an invalid email error message when focus-out', async function (assert) {
          // given
          const invalidEmail = 'invalidEmail';
          const screen = await renderScreen(hbs`<Authentication::LoginForm />`);

          // when
          await fillByLabel(emailInputLabel, invalidEmail);
          await triggerEvent('#login-email', 'focusout');

          // then
          assert.dom(screen.getByText(t('pages.login-form.errors.invalid-email'))).exists();
        });

        test('it displays an empty password error message when focus-out', async function (assert) {
          // given
          const screen = await renderScreen(hbs`<Authentication::LoginForm />`);

          // when
          await fillByLabel(passwordInputLabel, '');
          await triggerEvent('#login-password', 'focusout');

          // then
          assert.dom(screen.getByText(t('pages.login-form.errors.empty-password'))).exists();
        });
      });

      module('When credentials do not match any user', function () {
        test('it displays an invalid credentials message', async function (assert) {
          // given
          const errorResponse = {
            status: 401,
            responseJSON: {
              errors: [{ status: '401' }],
            },
          };

          sinon.stub(sessionService, 'authenticate');
          sessionService.authenticate.rejects(errorResponse);

          const screen = await renderScreen(hbs`<Authentication::LoginForm />`);
          await fillByLabel(emailInputLabel, 'pix@example.net');
          await fillByLabel(passwordInputLabel, 'Mauvais mot de passe');

          //  when
          await clickByName(loginLabel);

          // then
          assert.dom(screen.getByText(t(ApiErrorMessages.LOGIN_UNAUTHORIZED.I18N_KEY))).exists();
        });
      });

      module('When the user is not an organization member', function () {
        test('it displays an not linked organisation message', async function (assert) {
          // given
          const errorResponse = {
            status: Number(ApiErrorMessages.NOT_LINKED_ORGANIZATION.CODE),
            responseJSON: {
              errors: [{ status: '403' }],
            },
          };

          sinon.stub(sessionService, 'authenticate');
          sessionService.authenticate.rejects(errorResponse);

          const screen = await renderScreen(hbs`<Authentication::LoginForm />`);
          await fillByLabel(emailInputLabel, 'pix@example.net');
          await fillByLabel(passwordInputLabel, 'pix123');

          //  when
          await clickByName(loginLabel);

          // then
          assert.dom(screen.getByText(t(ApiErrorMessages.NOT_LINKED_ORGANIZATION.I18N_KEY))).exists();
        });
      });
    });

    module('When there is no invitation', function (hooks) {
      hooks.beforeEach(function () {
        sinon.stub(sessionService, 'authenticate');
        sessionService.authenticate.resolves();
      });
      test('it displays context message', async function (assert) {
        await renderScreen(hbs`<Authentication::LoginForm />`);
        assert.dom('.login-form-legacy-design__information').exists();
      });

      test('it calls authentication service with appropriate parameters', async function (assert) {
        // given
        await renderScreen(hbs`<Authentication::LoginForm />`);
        await fillByLabel(emailInputLabel, 'pix@example.net');
        await fillByLabel(passwordInputLabel, 'JeMeLoggue1024');

        // when
        await clickByName(loginLabel);

        // then
        assert.ok(sessionService.authenticate.calledWith('authenticator:oauth2', 'pix@example.net', 'JeMeLoggue1024'));
      });

      test('does not call authenticate session when form is invalid', async function (assert) {
        // given
        await renderScreen(hbs`<Authentication::LoginForm />`);
        await fillByLabel(emailInputLabel, '');
        await fillByLabel(passwordInputLabel, 'pix123');

        // when
        await clickByName(loginLabel);

        // then
        assert.ok(sessionService.authenticate.notCalled);
      });
    });

    module('When there is an invitation', function (hooks) {
      let saveStub;
      hooks.beforeEach(function () {
        sinon.stub(storeService, 'peekRecord');
        storeService.peekRecord.returns(null);
        const createRecordStub = sinon.stub(storeService, 'createRecord');
        saveStub = sinon.stub().resolves();
        createRecordStub.returns({
          save: saveStub,
        });
        sinon.stub(sessionService, 'authenticate');
        sessionService.authenticate.resolves();
      });

      test('it displays no context message', async function (assert) {
        // given & when
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );

        // then
        assert.dom('.login-form-legacy-design__information').doesNotExist();
      });

      test('it calls authentication service with appropriate parameters', async function (assert) {
        // given
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );
        await fillByLabel(emailInputLabel, 'pix@example.net');
        await fillByLabel(passwordInputLabel, 'JeMeLoggue1024');

        //  when
        await clickByName(loginLabel);

        // then
        assert.ok(sessionService.authenticate.calledWith('authenticator:oauth2', 'pix@example.net', 'JeMeLoggue1024'));
      });

      test('accepts organization invitation when form is valid', async function (assert) {
        // given
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );
        await fillByLabel(emailInputLabel, 'pix@example.net');
        await fillByLabel(passwordInputLabel, 'JeMeLoggue1024');

        //  when
        await clickByName(loginLabel);

        // then
        assert.ok(saveStub.calledWithMatch({ adapterOptions: { organizationInvitationId: '1' } }));
      });

      test('does not accept organization invitation when form is invalid', async function (assert) {
        // given
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );
        await fillByLabel(emailInputLabel, '');
        await fillByLabel(passwordInputLabel, 'pix123');

        //  when
        await clickByName(loginLabel);

        // then
        assert.ok(saveStub.notCalled);
      });
    });

    module('when domain is pix.org', function () {
      test('does not display recovery link', async function (assert) {
        // given
        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('org');

        // when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('.login-form-legacy-design__recover-access-link').doesNotExist();
        assert.dom('.login-form-legacy-design__recover-access-message').doesNotExist();
      });
    });

    module('when domain is pix.fr', function () {
      test('displays recovery link', async function (assert) {
        // given
        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('fr');

        // when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('.login-form-legacy-design__recover-access-link').exists();
        assert.dom('.login-form-legacy-design__recover-access-message').exists();
      });
    });
  });

  module('When feature toggle usePixOrgaNewAuthDesign is enabled', function (hooks) {
    hooks.beforeEach(function () {
      sinon.stub(featureToggles, 'featureToggles').value({ usePixOrgaNewAuthDesign: true });
    });

    module('When the login form is displayed', function () {
      test('it asks for email and password', async function (assert) {
        // given & when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('#login-email').exists();
        assert.dom('#login-password').exists();
      });

      test('[a11y] it displays a message that all inputs are required', async function (assert) {
        // given & when
        const screen = await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom(screen.getByText('Tous les champs sont obligatoires.')).exists();
      });

      test('it displays no error message', async function (assert) {
        // given & when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('#login-form-error-message').doesNotExist();
      });
    });

    module('When there is no invitation', function (hooks) {
      hooks.beforeEach(function () {
        sinon.stub(sessionService, 'authenticate');
        sessionService.authenticate.resolves();
      });
      test('it displays no context message', async function (assert) {
        await renderScreen(hbs`<Authentication::LoginForm />`);
        assert.dom('.login-form-legacy-design__information').doesNotExist();
      });

      test('it calls authentication service with appropriate parameters', async function (assert) {
        // given
        await renderScreen(hbs`<Authentication::LoginForm />`);
        await fillByLabel(emailInputLabel, 'pix@example.net');
        await fillByLabel(passwordInputLabel, 'JeMeLoggue1024');

        // when
        await clickByName(loginLabel);

        // then
        assert.ok(sessionService.authenticate.calledWith('authenticator:oauth2', 'pix@example.net', 'JeMeLoggue1024'));
      });

      test('does not call authenticate session when form is invalid', async function (assert) {
        // given
        await renderScreen(hbs`<Authentication::LoginForm />`);
        await fillByLabel(emailInputLabel, '');
        await fillByLabel(passwordInputLabel, 'pix123');

        // when
        await clickByName(loginLabel);

        // then
        assert.ok(sessionService.authenticate.notCalled);
      });
    });

    module('When there is an invitation', function (hooks) {
      let saveStub;
      hooks.beforeEach(function () {
        sinon.stub(storeService, 'peekRecord');
        storeService.peekRecord.returns(null);
        const createRecordStub = sinon.stub(storeService, 'createRecord');
        saveStub = sinon.stub().resolves();
        createRecordStub.returns({
          save: saveStub,
        });
        sinon.stub(sessionService, 'authenticate');
        sessionService.authenticate.resolves();
      });

      test('it displays no context message', async function (assert) {
        // given & when
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );

        // then
        assert.dom('.login-form-legacy-design__information').doesNotExist();
      });

      test('it calls authentication service with appropriate parameters', async function (assert) {
        // given
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );
        await fillByLabel(emailInputLabel, 'pix@example.net');
        await fillByLabel(passwordInputLabel, 'JeMeLoggue1024');

        //  when
        await clickByName(loginLabel);

        // then
        assert.ok(sessionService.authenticate.calledWith('authenticator:oauth2', 'pix@example.net', 'JeMeLoggue1024'));
      });

      test('accepts organization invitation when form is valid', async function (assert) {
        // given
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );
        await fillByLabel(emailInputLabel, 'pix@example.net');
        await fillByLabel(passwordInputLabel, 'JeMeLoggue1024');

        //  when
        await clickByName(loginLabel);

        // then
        assert.ok(saveStub.calledWithMatch({ adapterOptions: { organizationInvitationId: '1' } }));
      });

      test('does not accept organization invitation when form is invalid', async function (assert) {
        // given
        await renderScreen(
          hbs`<Authentication::LoginForm @isWithInvitation='true' @organizationInvitationId='1' @organizationInvitationCode='C0D3' />`,
        );
        await fillByLabel(emailInputLabel, '');
        await fillByLabel(passwordInputLabel, 'pix123');

        //  when
        await clickByName(loginLabel);

        // then
        assert.ok(saveStub.notCalled);
      });
    });

    module('when domain is pix.org', function () {
      test('does not display recovery link', async function (assert) {
        // given
        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('org');

        // when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('.authentication-login-form__recover-access__question').doesNotExist();
        assert.dom('.authentication-login-form__recover-access .link--underlined').doesNotExist();
        assert.dom('.authentication-login-form__recover-access__message').doesNotExist();
      });
    });

    module('when domain is pix.fr', function () {
      test('displays recovery link', async function (assert) {
        // given
        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('fr');

        // when
        await renderScreen(hbs`<Authentication::LoginForm />`);

        // then
        assert.dom('.authentication-login-form__recover-access__question').exists();
        assert.dom('.authentication-login-form__recover-access .link--underlined').exists();
        assert.dom('.authentication-login-form__recover-access__message').exists();
      });
    });
  });
});
