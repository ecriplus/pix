import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import * as certificationRepository from '../../infrastructure/repositories/certification-repository.js';

const path = dirname(fileURLToPath(import.meta.url));

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 * @typedef {certificationRepository} CertificationRepository
 **/

const dependencies = {
  certificationRepository,
};

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({
    path: join(path, './'),
    ignoredFileNames: ['index.js'],
  })),
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
