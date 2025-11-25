import { ModuleDoesNotExistError } from '../errors.js';

const linkWithSlugRegexp = /\/modules\/([a-z0-9-]*)/;

const getModuleByLink = async function ({ link, moduleRepository }) {
  return await _getModuleByLinkWithSlug({ link, moduleRepository });
};

export default { getModuleByLink };

async function _getModuleByLinkWithSlug({ link, moduleRepository }) {
  const result = linkWithSlugRegexp.exec(link);

  if (!result) {
    throw new ModuleDoesNotExistError(`No module found for link: ${link}`);
  }
  const slug = result[1];

  try {
    return await moduleRepository.getBySlug({ slug });
  } catch {
    throw new ModuleDoesNotExistError(`No module found for link: ${link}`);
  }
}
