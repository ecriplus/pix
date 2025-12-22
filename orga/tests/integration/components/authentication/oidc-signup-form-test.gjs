import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import OidcSignupForm from 'pix-orga/components/authentication/oidc-signup-form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Authentication | OidcSignupForm', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders the component', async function (assert) {
    // given
    const oidcIdentityProviders = this.owner.lookup('service:oidcIdentityProviders');
    sinon
      .stub(oidcIdentityProviders, 'list')
      .value([{ id: 'sc', slug: 'sc', code: 'SC', organizationName: 'StarConnect', isVisible: true }]);

    const userClaims = {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Proviseur',
    };

    // when
    const screen = await render(
      <template><OidcSignupForm @identityProviderSlug="sc" @userClaims={{userClaims}} /></template>,
    );

    // then
    const providerName = await screen.findByText('StarConnect');
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
});
