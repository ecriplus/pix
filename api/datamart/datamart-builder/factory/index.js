import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { importNamedExportsFromDirectory } from '../../../src/shared/infrastructure/utils/import-named-exports-from-directory.js';

const path = dirname(fileURLToPath(import.meta.url));
const unwantedFiles = ['index.js'];

const datamartBuilders = await importNamedExportsFromDirectory({
  path: join(path, './'),
  ignoredFileNames: unwantedFiles,
});

export const factory = {
  ...datamartBuilders,
};
