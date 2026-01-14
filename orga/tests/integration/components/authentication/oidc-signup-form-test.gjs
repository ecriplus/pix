import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import OidcSignupForm from 'pix-orga/components/authentication/oidc-signup-form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Authentication | OidcSignupForm', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders the component', async function (assert) {
    // given
    const onSubmitStub = sinon.stub();
    const identityProviderName = 'StarConnect';
    const userClaims = {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Proviseur',
    };

    // when
    const screen = await render(
      <template>
        <OidcSignupForm
          @onSubmit={{onSubmitStub}}
          @identityProviderName={{identityProviderName}}
          @userClaims={{userClaims}}
        />
      </template>,
    );

    // then
    const providerName = await screen.findByText(identityProviderName);
    assert.dom(providerName).exists();

    const firstName = await screen.findByText(
      t('pages.oidc.signup.claims.first-name-label-and-value', { firstName: 'John' }),
    );
    assert.dom(firstName).exists();

    const lastName = await screen.findByText(
      t('pages.oidc.signup.claims.last-name-label-and-value', { lastName: 'Doe' }),
    );
    assert.dom(lastName).exists();

    const title = await screen.findByText(t('pages.oidc.signup.claims.title'));
    assert.dom(title).exists();
  });

  module('when the user does not accept terms of service before signing up', function () {
    test('does not sign up and displays cgu error', async function (assert) {
      // given
      const onSubmitStub = sinon.stub();
      const identityProviderName = 'StarConnect';
      const userClaims = {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Proviseur',
      };

      // when
      const screen = await render(
        <template>
          <OidcSignupForm
            @onSubmit={{onSubmitStub}}
            @identityProviderName={{identityProviderName}}
            @userClaims={{userClaims}}
          />
        </template>,
      );
      const signup = await screen.findByRole('button', { name: t('pages.oidc.signup.signup-button') });
      await click(signup);

      // then
      const cguErrorMessage = await screen.findByText(t('pages.oidc.signup.error.cgu'));
      assert.dom(cguErrorMessage).exists();
    });
  });
});
