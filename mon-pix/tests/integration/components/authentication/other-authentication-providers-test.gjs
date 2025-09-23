import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import OtherAuthenticationProviders from 'mon-pix/components/authentication/other-authentication-providers';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

class NoOidcIdentityProvidersServiceStub extends Service {
  get hasIdentityProviders() {
    return false;
  }

  get featuredIdentityProvider() {
    return null;
  }

  get hasOtherIdentityProviders() {
    return false;
  }

  load() {
    return Promise.resolve();
  }
}

class OneFeaturedNoOthersOidcIdentityProvidersServiceStub extends NoOidcIdentityProvidersServiceStub {
  get hasIdentityProviders() {
    return true;
  }

  get featuredIdentityProvider() {
    return { organizationName: 'Some Identity Provider', slug: 'some-identity-provider' };
  }
}

class OneFeaturedOthersOidcIdentityProvidersServiceStub extends OneFeaturedNoOthersOidcIdentityProvidersServiceStub {
  get hasOtherIdentityProviders() {
    return true;
  }
}

module('Integration | Component | Authentication | other-authentication-providers', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when there are identity providers', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.register('service:oidcIdentityProviders', OneFeaturedNoOthersOidcIdentityProvidersServiceStub);
    });

    module('when it’s for login', function () {
      test('it displays a login heading', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders /></template>);

        // then
        assert
          .dom(
            screen.getByRole('heading', {
              name: t('components.authentication.other-authentication-providers.login.heading'),
            }),
          )
          .exists();
      });
    });

    module('when it’s for signup', function () {
      test('it displays a signup heading', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders @isForSignup="true" /></template>);

        // then
        assert
          .dom(
            screen.getByRole('heading', {
              name: t('components.authentication.other-authentication-providers.signup.heading'),
            }),
          )
          .exists();
      });
    });
  });

  module('when there are no identity providers', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.register('service:oidcIdentityProviders', NoOidcIdentityProvidersServiceStub);
    });

    module('when it’s for login', function () {
      test('it doesn’t display a login heading', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders /></template>);

        // then
        assert
          .dom(screen.queryByText(t('components.authentication.other-authentication-providers.login.heading')))
          .doesNotExist();
      });
    });

    module('when it’s for signup', function () {
      test('it doesn’t display a signup heading', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders @isForSignup="true" /></template>);

        // then
        assert
          .dom(screen.queryByText(t('components.authentication.other-authentication-providers.signup.heading')))
          .doesNotExist();
      });
    });
  });

  module('when there is a featured identity provider', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.register('service:oidcIdentityProviders', OneFeaturedNoOthersOidcIdentityProvidersServiceStub);
    });

    module('when it’s for login', function () {
      test('it displays a login featured identity provider link', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders /></template>);

        // then
        const link = await screen.findByRole('link', {
          name: t(
            'components.authentication.other-authentication-providers.login.login-with-featured-identity-provider-link',
            {
              featuredIdentityProvider: 'Some Identity Provider',
            },
          ),
        });
        assert.dom(link).exists();
        assert.strictEqual(link.getAttribute('href'), '/connexion/some-identity-provider');
      });
    });

    module('when it’s for signup', function () {
      test('it displays a signup featured identity provider link', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders @isForSignup="true" /></template>);

        // then
        const link = await screen.findByRole('link', {
          name: t(
            'components.authentication.other-authentication-providers.signup.signup-with-featured-identity-provider-link',
            {
              featuredIdentityProvider: 'Some Identity Provider',
            },
          ),
        });
        assert.dom(link).exists();
        assert.strictEqual(link.getAttribute('href'), '/connexion/some-identity-provider');
      });
    });
  });

  module('when there is no featured identity provider', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.register('service:oidcIdentityProviders', NoOidcIdentityProvidersServiceStub);
    });

    test('it doesn’t display a continue featured identity provider link', async function (assert) {
      // when
      const screen = await render(<template><OtherAuthenticationProviders /></template>);

      // then
      assert
        .dom(
          screen.queryByText(
            t(
              'components.authentication.other-authentication-providers.login.login-with-featured-identity-provider-link',
              {
                featuredIdentityProvider: 'Some Identity Provider',
              },
            ),
          ),
        )
        .doesNotExist();
      assert
        .dom(
          screen.queryByText(
            t(
              'components.authentication.other-authentication-providers.signup.signup-with-featured-identity-provider-link',
              {
                featuredIdentityProvider: 'Some Identity Provider',
              },
            ),
          ),
        )
        .doesNotExist();
    });
  });

  module('when there are other identity providers', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.register('service:oidcIdentityProviders', OneFeaturedOthersOidcIdentityProvidersServiceStub);
    });

    module('when it’s for login', function () {
      test('it displays a select another organization link', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders /></template>);

        // then
        const link = await screen.findByRole('link', {
          name: t('components.authentication.other-authentication-providers.select-another-organization-link'),
        });
        assert.dom(link).exists();
        assert.strictEqual(link.getAttribute('href'), '/connexion/sso-selection');
      });
    });

    module('when it’s for signup', function () {
      test('it displays a select another organization link', async function (assert) {
        // when
        const screen = await render(<template><OtherAuthenticationProviders @isForSignup={{true}} /></template>);

        // then
        const link = await screen.findByRole('link', {
          name: t('components.authentication.other-authentication-providers.select-another-organization-link'),
        });
        assert.dom(link).exists();
        assert.strictEqual(link.getAttribute('href'), '/inscription/sso-selection');
      });
    });
  });

  module('when there are no other identity providers', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.register('service:oidcIdentityProviders', OneFeaturedNoOthersOidcIdentityProvidersServiceStub);
    });

    test('it doesn’t display a select another organization link', async function (assert) {
      // when
      const screen = await render(<template><OtherAuthenticationProviders /></template>);

      // then
      assert
        .dom(
          screen.queryByText(
            t('components.authentication.other-authentication-providers.select-another-organization-link'),
          ),
        )
        .doesNotExist();
    });
  });
});
