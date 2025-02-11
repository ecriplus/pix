import Debug from 'debug';

import { OIDC_PROVIDER_EXAMPLE_NET_IDENTITY_PROVIDER } from './constants.js';

const debugOidcProvidersSeeds = Debug('pix:oidc-providers:seeds');

const defaultVisibleOidcProviderProperties = {
  accessTokenLifespan: '48h',
  scope: 'openid profile',
  enabled: true,
};

const defaultNotVisibleOidcProviderProperties = Object.assign(
  {
    isVisible: false,
  },
  defaultVisibleOidcProviderProperties,
);

const defaultOidcProviderForPixAdminProperties = Object.assign(
  {
    enabledForPixAdmin: true,
  },
  defaultVisibleOidcProviderProperties,
);

export function buildOidcProviders(databaseBuilder) {
  _buildVisibleOidcProviders(databaseBuilder);
  _buildNotVisibleOidcProviders(databaseBuilder);
  _buildOidcProvidersForPixAdmin(databaseBuilder);
  _buildOidcProvidersFromEnv(databaseBuilder);
}

function _buildVisibleOidcProviders(databaseBuilder) {
  databaseBuilder.factory.buildOidcProvider(
    Object.assign(
      {
        identityProvider: OIDC_PROVIDER_EXAMPLE_NET_IDENTITY_PROVIDER,
        organizationName: 'OIDC Example 1 from seeds',
        slug: 'seeds-1-oidc-example-net',
        source: 'seeds-1-oidc-example-net',
        clientId: '1-XXX',
        clientSecret: '1-YYY',
        openidConfigurationUrl: 'https://seeds-1.oidc.example.net/.well-known/openid-configuration',
        redirectUri: 'https://app.dev.pix.org/connexion/seeds-1-oidc-example-net',
      },
      defaultVisibleOidcProviderProperties,
    ),
  );

  databaseBuilder.factory.buildOidcProvider(
    Object.assign(
      {
        identityProvider: 'OIDC_EXAMPLE_NET_FROM_SEEDS-2',
        organizationName: 'OIDC Example 2 from seeds',
        slug: 'seeds-2-oidc-example-net',
        source: 'seeds-2-oidc-example-net',
        clientId: '2-XXX',
        clientSecret: '2-YYY',
        openidConfigurationUrl: 'https://seeds-2.oidc.example.net/.well-known/openid-configuration',
        redirectUri: 'https://app.dev.pix.org/connexion/seeds-2-oidc-example-net',
      },
      defaultVisibleOidcProviderProperties,
    ),
  );
}

function _buildNotVisibleOidcProviders(databaseBuilder) {
  databaseBuilder.factory.buildOidcProvider(
    Object.assign(
      {
        identityProvider: 'OIDC_EXAMPLE_NET_NOT_VISIBLE_FROM_SEEDS-1',
        organizationName: 'OIDC Example not visible 1 from seeds',
        slug: 'seeds-not-visible-1-oidc-example-net',
        source: 'seeds-not-visible-1-oidc-example-net',
        clientId: 'not-visible-1-XXX',
        clientSecret: 'not-visible-1-YYY',
        openidConfigurationUrl: 'https://seeds-not-visible-1.oidc.example.net/.well-known/openid-configuration',
        redirectUri: 'https://app.dev.pix.org/connexion/seeds-not-visible-1-oidc-example-net',
      },
      defaultNotVisibleOidcProviderProperties,
    ),
  );

  databaseBuilder.factory.buildOidcProvider(
    Object.assign(
      {
        identityProvider: 'OIDC_EXAMPLE_NET_NOT_VISIBLE_FROM_SEEDS-2',
        organizationName: 'OIDC Example not visible 2 from seeds',
        slug: 'seeds-not-visible-2-oidc-example-net',
        source: 'seeds-not-visible-2-oidc-example-net',
        clientId: 'not-visible-2-XXX',
        clientSecret: 'not-visible-2-YYY',
        openidConfigurationUrl: 'https://seeds-not-visible-2.oidc.example.net/.well-known/openid-configuration',
        redirectUri: 'https://app.dev.pix.org/connexion/seeds-not-visible-2-oidc-example-net',
      },
      defaultNotVisibleOidcProviderProperties,
    ),
  );
}

function _buildOidcProvidersForPixAdmin(databaseBuilder) {
  databaseBuilder.factory.buildOidcProvider(
    Object.assign(
      {
        identityProvider: 'OIDC_EXAMPLE_NET_FOR_PIX_ADMIN_FROM_SEEDS',
        organizationName: 'OIDC Example for Pix Admin from seeds',
        slug: 'seeds-for-pix-admin-oidc-example-net',
        source: 'seeds-for-pix-admin-oidc-example-net',
        clientId: 'for-pix-admin-XXX',
        clientSecret: 'for-pix-admin-YYY',
        openidConfigurationUrl: 'https://seeds-for-pix-admin.oidc.example.net/.well-known/openid-configuration',
        redirectUri: 'https://app.dev.pix.org/connexion/seeds-for-pix-admin-oidc-example-net',
      },
      defaultOidcProviderForPixAdminProperties,
    ),
  );
}

function _buildOidcProvidersFromEnv(databaseBuilder) {
  const oidcProvidersJson = process.env.OIDC_PROVIDERS;
  if (!oidcProvidersJson) {
    debugOidcProvidersSeeds('No environment variable OIDC_PROVIDERS defined, no loading from environment.');
    return;
  }

  const oidcProviders = JSON.parse(oidcProvidersJson);
  oidcProviders.forEach((oidcProviderProperties) => {
    debugOidcProvidersSeeds(`Loading configuration for OIDC provider "${oidcProviderProperties}"…`);

    databaseBuilder.factory.buildOidcProvider(oidcProviderProperties);
  });
}
