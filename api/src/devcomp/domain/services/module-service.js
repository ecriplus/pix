import { ModuleDoesNotExistError } from '../errors.js';

const getModuleByLink = async function ({ link, moduleRepository }) {
  const regexp = /\/modules\/([a-z0-9-]*)/;

  const result = regexp.exec(link);
  if (!result) {
    throw new ModuleDoesNotExistError(`No module found for link: ${link}`);
  }
  const slug = result[1];

  try {
    return await moduleRepository.getBySlug({ slug });
  } catch {
    throw new ModuleDoesNotExistError(`No module found for link: ${link}`);
  }
};

export default { getModuleByLink };
