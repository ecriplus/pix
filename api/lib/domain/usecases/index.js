import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { OidcAuthenticationServiceRegistry } from '../../../src/identity-access-management/domain/services/oidc-authentication-service-registry.js';
import * as oidcProviderRepository from '../../../src/identity-access-management/infrastructure/repositories/oidc-provider-repository.js';
import * as userRepository from '../../../src/identity-access-management/infrastructure/repositories/user.repository.js';
import * as studentRepository from '../../../src/prescription/learner-management/infrastructure/repositories/student-repository.js';
import * as organizationLearnerRepository from '../../../src/prescription/organization-learner/infrastructure/repositories/organization-learner-repository.js';
import { injectDependencies } from '../../../src/shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../src/shared/infrastructure/utils/import-named-exports-from-directory.js';

const oidcAuthenticationServiceRegistry = new OidcAuthenticationServiceRegistry({ oidcProviderRepository });

const dependencies = {
  organizationLearnerRepository,
  studentRepository,
  userRepository,
};

const path = dirname(fileURLToPath(import.meta.url));

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({ path: join(path, './'), ignoredFileNames: ['index.js'] })),
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { oidcAuthenticationServiceRegistry, usecases };
