import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import OidcAssociationConfirmation from 'pix-orga/components/authentication/oidc-association-confirmation';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Oidc-association-confirmation', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display association confirmation page elements', async function (assert) {
    // given
    class OidcIdentityProvidersStub extends Service {
      list = [
        { organizationName: 'France Connect' },
        { organizationName: 'Impots.gouv' },
        { organizationName: 'Nouveau partenaire' },
      ];
      getIdentityProviderNamesByAuthenticationMethods = sinon.stub().returns(['France Connect', 'Impots.gouv']);
    }
    this.owner.register('service:oidcIdentityProviders', OidcIdentityProvidersStub);
    const identityProviderOrganizationName = 'Nouveau Partenaire';
    const fullNameFromPix = 'Lloyd Pix';
    const fullNameFromExternalIdentityProvider = 'Lloyd Cé';
    const email = 'lloyidce@example.net';
    const identityProviderSlug = 'new-oidc-partner';
    const authenticationMethods = [{ identityProvider: 'France Connect' }, { identityProvider: 'Impots.gouv' }];

    //  when

    const screen = await render(
      <template>
        <OidcAssociationConfirmation
          @identityProviderOrganizationName={{identityProviderOrganizationName}}
          @identityProviderSlug={{identityProviderSlug}}
          @authenticationMethods={{authenticationMethods}}
          @fullNameFromPix={{fullNameFromPix}}
          @fullNameFromExternalIdentityProvider={{fullNameFromExternalIdentityProvider}}
          @email={{email}}
        />
      </template>,
    );

    // then
    assert.ok(
      screen.getByRole('heading', {
        name: `${t('components.authentication.oidc-association-confirmation.title')} ${t('components.authentication.oidc-association-confirmation.sub-title')}`,
      }),
    );
    assert.ok(screen.getByText(t('components.authentication.oidc-association-confirmation.information')));
    assert.ok(screen.getByText('Lloyd Cé'));
    assert.ok(screen.getByText('Lloyd Pix'));
    assert.ok(
      screen.getByText(t('components.authentication.oidc-association-confirmation.current-authentication-methods')),
    );
    assert.ok(screen.getByText(t('components.authentication.oidc-association-confirmation.email')));
    assert.ok(screen.getByText('lloyidce@example.net'));
    assert.ok(screen.getByText('France Connect'));
    assert.ok(screen.getByText('Impots.gouv'));

    assert.ok(
      screen.getByText(t('components.authentication.oidc-association-confirmation.authentication-method-to-add')),
    );
    assert.ok(
      screen.getByText(
        `${t('components.authentication.oidc-association-confirmation.external-connection-via')} Nouveau Partenaire`,
      ),
    );

    assert.ok(
      screen.getByRole('button', { name: t('components.authentication.oidc-association-confirmation.switch-account') }),
    );
    assert.ok(
      screen.getByRole('button', { name: t('components.authentication.oidc-association-confirmation.return') }),
    );
    assert.ok(
      screen.getByRole('button', { name: t('components.authentication.oidc-association-confirmation.confirm') }),
    );
  });
});
