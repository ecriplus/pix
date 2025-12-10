import { clickByName, fillByLabel, render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import LoginForm from 'pix-orga/components/authentication/login-form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | LoginForm', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it calls onSubmit with appropriate parameters', async function (assert) {
    // given
    const onSubmitStub = sinon.stub();
    await render(<template><LoginForm @onSubmit={{onSubmitStub}} /></template>);
    await fillByLabel(t('pages.login-form.email.label'), 'pix@example.net');
    await fillByLabel(t('pages.login-form.password'), 'JeMeLoggue1024');

    // when
    await clickByName(t('pages.login-form.login'));

    // then
    assert.ok(onSubmitStub.calledWith('pix@example.net', 'JeMeLoggue1024'));
  });

  module('when form is invalid', function () {
    test('does not call onSubmit', async function (assert) {
      // given
      const onSubmitStub = sinon.stub();
      await render(<template><LoginForm @onSubmit={{onSubmitStub}} /></template>);
      await fillByLabel(t('pages.login-form.email.label'), '');
      await fillByLabel(t('pages.login-form.password'), 'pix123');

      // when
      await clickByName(t('pages.login-form.login'));

      // then
      assert.ok(onSubmitStub.notCalled);
    });
  });

  module('when there is an invitation error', function () {
    module('when invitation has already been accepted', function () {
      test('it displays an error message', async function (assert) {
        // given & when
        const onSubmitStub = sinon.stub();
        const screen = await render(
          <template>
            <LoginForm @onSubmit={{onSubmitStub}} @isWithInvitation="true" @hasInvitationAlreadyBeenAccepted="true" />
          </template>,
        );

        // then
        assert.dom(screen.getByText(t('pages.login-form.invitation-already-accepted'))).exists();
      });
    });

    module('when invitation is cancelled', function () {});
    test('it displays an error message', async function (assert) {
      // given & when
      const onSubmitStub = sinon.stub();
      const screen = await render(
        <template>
          <LoginForm @onSubmit={{onSubmitStub}} @isWithInvitation="true" @isInvitationCancelled="true" />
        </template>,
      );

      // then
      assert.dom(screen.getByText(t('pages.login-form.invitation-was-cancelled'))).exists();
    });
  });

  module('recovery link', function () {
    module('when domain is pix.org', function () {
      test('does not display recovery link', async function (assert) {
        // given
        const onSubmitStub = sinon.stub();
        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('org');

        // when
        await render(<template><LoginForm @onSubmit={{onSubmitStub}} /></template>);

        // then
        assert.dom('.authentication-login-form__recover-access__question').doesNotExist();
        assert.dom('.authentication-login-form__recover-access .link--underlined').doesNotExist();
        assert.dom('.authentication-login-form__recover-access__message').doesNotExist();
      });
    });

    module('when domain is pix.fr', function () {
      test('displays recovery link', async function (assert) {
        // given
        const onSubmitStub = sinon.stub();
        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('fr');

        // when
        await render(<template><LoginForm @onSubmit={{onSubmitStub}} /></template>);

        // then
        assert.dom('.authentication-login-form__recover-access__question').exists();
        assert.dom('.authentication-login-form__recover-access .link--underlined').exists();
        assert.dom('.authentication-login-form__recover-access__message').exists();
      });
    });
  });
});
