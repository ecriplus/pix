import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { LearningContentResourceNotFound } from '../../../../shared/domain/errors.js';
import { ModuleDoesNotExistError } from '../../../domain/errors.js';

const referential = await importModules();

const moduleDatasource = {
  getAllByIds: async (ids) => {
    const modules = referential.modules.filter((module) => ids.includes(module.id));

    const foundModulesIds = modules.map((module) => module.id);
    const notFoundModulesIds = ids.filter((id) => !foundModulesIds.includes(id));

    if (notFoundModulesIds.length > 0) {
      throw new ModuleDoesNotExistError(`Ids with no module: ${notFoundModulesIds}`);
    }

    return modules;
  },
  getAllByShortIds: async (shortIds) => {
    const modules = referential.modules.filter((module) => shortIds.includes(module.shortId));

    const foundModulesIds = modules.map((module) => module.shortId);
    const notFoundModulesShortIds = shortIds.filter((shortId) => !foundModulesIds.includes(shortId));

    if (notFoundModulesShortIds.length > 0) {
      throw new ModuleDoesNotExistError(`Short ids with no module: ${notFoundModulesShortIds}`);
    }

    return modules;
  },
  getById: async (id) => {
    const foundModule = referential.modules.find((module) => module.id === id);

    if (foundModule === undefined) {
      throw new LearningContentResourceNotFound();
    }

    return foundModule;
  },
  getByShortId: async (shortId) => {
    const foundModule = referential.modules.find((module) => module.shortId === shortId);

    if (foundModule === undefined) {
      throw new ModuleDoesNotExistError();
    }

    return foundModule;
  },
  getBySlug: async (slug) => {
    const foundModule = referential.modules.find((module) => module.slug === slug);

    if (foundModule === undefined) {
      throw new LearningContentResourceNotFound();
    }

    return foundModule;
  },
  list: async () => {
    return referential.modules;
  },
};

async function importModules() {
  const imports = { modules: [] };

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = join(__dirname, './modules');
  const files = await readdir(path, { withFileTypes: true });

  for (const file of files) {
    const fileURL = pathToFileURL(join(path, file.name));
    const module = await import(fileURL, { with: { type: 'json' } });
    imports.modules.push(module.default);
  }

  return imports;
}

export default moduleDatasource;
