import { OidcAuthenticationServiceRegistry } from '../../../src/identity-access-management/domain/services/oidc-authentication-service-registry.js';
import * as oidcProviderRepository from '../../../src/identity-access-management/infrastructure/repositories/oidc-provider-repository.js';
// userRepo should be import to avoid circular dependency
//eslint-disable-next-line no-unused-vars
import * as userRepository from '../../../src/identity-access-management/infrastructure/repositories/user.repository.js';

const oidcAuthenticationServiceRegistry = new OidcAuthenticationServiceRegistry({ oidcProviderRepository });

export { oidcAuthenticationServiceRegistry };
