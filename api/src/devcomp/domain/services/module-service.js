import { ModuleDoesNotExistError } from '../errors.js';

const linkWithSlugRegexp = /\/modules\/([a-z0-9-]*)/;
const linkWithShortIdRegexp = /\/modules\/([a-z0-9]{8})\/([a-z0-9-]*)/;

const getModuleByLink = async function ({ link, moduleMetadataRepository }) {
  if (linkWithShortIdRegexp.test(link)) {
    return await _getModuleByLinkWithShortId({ link, moduleMetadataRepository });
  }

  return await _getModuleByLinkWithSlug({ link, moduleMetadataRepository });
};

export default { getModuleByLink };

async function _getModuleByLinkWithSlug({ link, moduleMetadataRepository }) {
  const result = linkWithSlugRegexp.exec(link);

  if (!result) {
    throw new ModuleDoesNotExistError(`No module found for link: ${link}`);
  }
  const slug = result[1];

  try {
    return await moduleMetadataRepository.getBySlug({ slug });
  } catch {
    throw new ModuleDoesNotExistError(`No module found for link: ${link}`);
  }
}

async function _getModuleByLinkWithShortId({ link, moduleMetadataRepository }) {
  const result = linkWithShortIdRegexp.exec(link);
  const shortId = result[1];

  try {
    return await moduleMetadataRepository.getByShortId({ shortId: shortId });
  } catch {
    throw new ModuleDoesNotExistError(`No module found for link: ${link}`);
  }
}
