import { OIDC_PROVIDER_EXAMPLE_NET_IDENTITY_PROVIDER } from './constants.js';

function _buildUsers(databaseBuilder) {
  // User bare
  databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Salvor',
    lastName: 'Hardin',
    username: 'salvor.hardin',
    email: 'salvor.hardin@example.net',
  });

  // User with a specific lastLoggedAt
  const userWithLastLoggedAt = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Gaal',
    lastName: 'Dornick',
    username: 'gaal.dornick',
    email: 'gaal.dornick@example.net',
  });
  databaseBuilder.factory.buildUserLogin({ userId: userWithLastLoggedAt.id, lastLoggedAt: new Date('1970-01-01') });

  // User with a specific createdAt
  databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Chrono',
    lastName: 'Post',
    username: 'chrono.post',
    email: 'chrono.post@example.net',
    createdAt: new Date('2000-12-31'),
  });

  // User with an old lastLoggedAt (>1 year) and no email confirmation date
  const userWithOldLastLoggedAt = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Old',
    lastName: 'Connexion',
    email: 'old-connexion@example.net',
    emailConfirmedAt: null,
  });
  databaseBuilder.factory.buildUserLogin({ userId: userWithOldLastLoggedAt.id, lastLoggedAt: new Date('1970-01-01') });

  // User without lastLoggedAt
  const userWithoutLastLoggedAt = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'without',
    lastName: 'LastLoggedAt',
    email: 'without-lastlogged@example.net',
    emailConfirmedAt: null,
  });
  databaseBuilder.factory.buildUserLogin({ userId: userWithoutLastLoggedAt.id, lastLoggedAt: null });
}

function _buildOidcUser(databaseBuilder) {
  const user = databaseBuilder.factory.buildUser({
    firstName: 'Oidc',
    lastName: 'OIDC',
    email: 'oidc-user@example.net',
  });
  databaseBuilder.factory.buildAuthenticationMethod.withOidcProviderAsIdentityProvider({
    userId: user.id,
    identityProvider: OIDC_PROVIDER_EXAMPLE_NET_IDENTITY_PROVIDER,
  });
}

function _buildUserWithPoleEmploiAuthenticationMethod(databaseBuilder) {
  const user = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Paul',
    lastName: 'Emploi',
    email: 'paul-emploi@example.net',
  });

  databaseBuilder.factory.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
    userId: user.id,
  });
}

function _buildGarUser(databaseBuilder) {
  const user = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Gar',
    lastName: 'User',
    email: 'gar.user@example.net',
  });

  databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
    userId: user.id,
  });
}

export function buildUsers(databaseBuilder) {
  _buildUsers(databaseBuilder);
  _buildOidcUser(databaseBuilder);
  _buildUserWithPoleEmploiAuthenticationMethod(databaseBuilder);
  _buildGarUser(databaseBuilder);
}
