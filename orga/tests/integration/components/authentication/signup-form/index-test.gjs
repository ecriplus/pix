import { clickByName, fillByLabel, render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import SignupForm from 'pix-orga/components/authentication/signup-form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

const I18N_KEYS = {
  firstNameInput: 'pages.join.signup.fields.firstname.label',
  lastNameInput: 'pages.join.signup.fields.lastname.label',
  emailInput: 'pages.join.signup.fields.email.label',
  passwordInput: 'pages.join.signup.fields.password.label',
  cguCheckbox: 'common.cgu.label',
  submitButton: 'pages.join.signup.submit',
};

const firstName = 'John';
const lastName = 'Doe';
const email = 'john.doe@email.com';
const password = 'JeMeLoggue1024';

module('Integration | Component | Authentication | SignupForm | index', function (hooks) {
  setupIntlRenderingTest(hooks);

  let sessionService;
  let storeService;

  hooks.beforeEach(async function () {
    sessionService = this.owner.lookup('service:session');
    storeService = this.owner.lookup('service:store');
  });

  test('renders form and required fields', async function (assert) {
    // when
    const screen = await render(hbs`<Authentication::SignupForm />`);

    // then
    assert.dom(screen.getByText(t('common.form.mandatory-all-fields'))).exists();
    assert.dom(screen.getByLabelText(t(I18N_KEYS.firstNameInput))).hasAttribute('aria-required');
    assert.dom(screen.getByLabelText(t(I18N_KEYS.lastNameInput))).hasAttribute('aria-required');
    assert.dom(screen.getByLabelText(t(I18N_KEYS.emailInput))).hasAttribute('aria-required');
    assert.dom(screen.getByLabelText(t(I18N_KEYS.passwordInput))).hasAttribute('aria-required');
    assert.dom(screen.getByLabelText(t(I18N_KEYS.cguCheckbox))).hasAttribute('aria-required');
  });

  test('it signs up successfully', async function (assert) {
    // given
    const saveStub = sinon.stub().resolves();

    sinon
      .stub(storeService, 'createRecord')
      .returns({ firstName, lastName, email, password, cgu: true, lang: 'fr', save: saveStub });

    sinon.stub(sessionService, 'authenticate').resolves();

    await render(hbs`<Authentication::SignupForm @organizationInvitationId='1' @organizationInvitationCode='C0D3'/>`);

    await fillByLabel(t(I18N_KEYS.firstNameInput), firstName);
    await fillByLabel(t(I18N_KEYS.lastNameInput), lastName);
    await fillByLabel(t(I18N_KEYS.emailInput), email);
    await fillByLabel(t(I18N_KEYS.passwordInput), password);
    await clickByName(t(I18N_KEYS.cguCheckbox));

    // when
    await clickByName(t(I18N_KEYS.submitButton));

    // then
    assert.dom('.alert-input--error').doesNotExist();
    assert.ok(sessionService.authenticate.calledOnce);
  });

  module('when user submits without filling the form', function () {
    test('it displays an error messages on each input', async function (assert) {
      // given
      sinon.stub(sessionService, 'authenticate').resolves();

      // when
      const screen = await render(
        <template><SignupForm @organizationInvitationId="1" @organizationInvitationCode="C0D3" /></template>,
      );
      await clickByName(t(I18N_KEYS.submitButton));

      // then
      assert.dom(screen.getByText(t('pages.join.signup.fields.firstname.error'))).exists();
      assert.dom(screen.getByText(t('pages.join.signup.fields.lastname.error'))).exists();
      assert.dom(screen.getByText(t('pages.join.signup.fields.email.error'))).exists();
      assert.dom(screen.getByText(t('common.validation.password.error'))).exists();
      assert.dom(screen.getByText(t('common.cgu.error'))).exists();

      assert.ok(sessionService.authenticate.notCalled);
    });
  });

  module('when there are validation errors after filling fields', function () {
    test('it displays error messages on each input', async function (assert) {
      // given
      sinon.stub(sessionService, 'authenticate').resolves();

      const invalidEmail = 'john';
      const invalidPassword = '123';

      // when
      const screen = await render(
        <template><SignupForm @organizationInvitationId="1" @organizationInvitationCode="C0D3" /></template>,
      );
      await fillByLabel(t(I18N_KEYS.firstNameInput), '  ');
      await fillByLabel(t(I18N_KEYS.lastNameInput), '  ');
      await fillByLabel(t(I18N_KEYS.emailInput), invalidEmail);
      await fillByLabel(t(I18N_KEYS.passwordInput), invalidPassword);
      await clickByName(t(I18N_KEYS.cguCheckbox));
      await clickByName(t(I18N_KEYS.cguCheckbox)); // click twice to trigger validation

      // then
      assert.dom(screen.getByText(t('pages.join.signup.fields.firstname.error'))).exists();
      assert.dom(screen.getByText(t('pages.join.signup.fields.lastname.error'))).exists();
      assert.dom(screen.getByText(t('pages.join.signup.fields.email.error'))).exists();
      assert.dom(screen.getByText(t('common.validation.password.error'))).exists();
      assert.dom(screen.getByText(t('common.cgu.error'))).exists();

      assert.ok(sessionService.authenticate.notCalled);
    });
  });

  module('when there are server errors from user creation', function () {
    test('it displays error for email invalid or already used', async function (assert) {
      // given
      sinon.stub(sessionService, 'authenticate').resolves();

      const saveStub = sinon.stub();
      const errors = [{ attribute: 'email', message: 'INVALID_OR_ALREADY_USED_EMAIL' }];
      saveStub.rejects({ errors });

      sinon
        .stub(storeService, 'createRecord')
        .returns({ firstName, lastName, email, password, cgu: true, lang: 'fr', save: saveStub, errors });

      // when
      const screen = await render(
        <template><SignupForm @organizationInvitationId="1" @organizationInvitationCode="C0D3" /></template>,
      );
      await fillByLabel(t(I18N_KEYS.firstNameInput), 'John');
      await fillByLabel(t(I18N_KEYS.lastNameInput), 'Doe');
      await fillByLabel(t(I18N_KEYS.emailInput), 'john.doe@email.com');
      await fillByLabel(t(I18N_KEYS.passwordInput), 'JeMeLoggue1024');
      await clickByName(t(I18N_KEYS.cguCheckbox));
      await clickByName(t(I18N_KEYS.submitButton));

      // then
      assert.dom(screen.getByText(t('pages.join.signup.fields.email.error'))).exists();
      assert.ok(sessionService.authenticate.notCalled);
    });
  });

  module('when there is an unexpected server error', function () {
    test('it displays a generic error', async function (assert) {
      // given
      sinon.stub(sessionService, 'authenticate').resolves();

      const saveStub = sinon.stub();
      saveStub.rejects('BOOM');

      sinon
        .stub(storeService, 'createRecord')
        .returns({ firstName, lastName, email, password, cgu: true, lang: 'fr', save: saveStub });

      // when
      const screen = await render(
        <template><SignupForm @organizationInvitationId="1" @organizationInvitationCode="C0D3" /></template>,
      );
      await fillByLabel(t(I18N_KEYS.firstNameInput), 'John');
      await fillByLabel(t(I18N_KEYS.lastNameInput), 'Doe');
      await fillByLabel(t(I18N_KEYS.emailInput), 'john.doe@email.com');
      await fillByLabel(t(I18N_KEYS.passwordInput), 'JeMeLoggue1024');
      await clickByName(t(I18N_KEYS.cguCheckbox));
      await clickByName(t(I18N_KEYS.submitButton));

      // then
      assert.dom(screen.getByText(t('pages.login-or-register.register-form.errors.default'))).exists();
      assert.ok(sessionService.authenticate.notCalled);
    });
  });
});
