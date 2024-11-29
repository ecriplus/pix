import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import * as candidatesApiRepository from '../../infrastructure/repositories/candidates-api.repository.js';
import * as learnersApiRepository from '../../infrastructure/repositories/learners-api.repository.js';
import * as userTeamsApiRepository from '../../infrastructure/repositories/user-teams-api.repository.js';

const path = dirname(fileURLToPath(import.meta.url));

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({ path: join(path, './'), ignoredFileNames: ['index.js'] })),
};

const dependencies = {
  candidatesApiRepository,
  learnersApiRepository,
  userTeamsApiRepository,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
