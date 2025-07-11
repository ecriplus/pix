import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import * as repositories from '../../infrastructure/repositories/index.js';
import * as toEventStream from '../../infrastructure/streaming/to-event-stream.js';

const path = dirname(fileURLToPath(import.meta.url));

const dependencies = {
  ...repositories,
  toEventStream,
  randomUUID,
};

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({ path: join(path, './'), ignoredFileNames: ['index.js'] })),
};

export const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);
