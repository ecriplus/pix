import { NetworkAlreadyExistError } from '../errors.js';

/**
 * @param{object} params
 * @param{number} params.organizationId
 * @param{string} params.networkName
 * @param{NetworkRepository} params.networkRepository
 * @returns {Promise<void>}
 */
const createNetwork = async function ({ organizationId, networkName, networkRepository }) {
  const existingNEtwork = await networkRepository.findByOrganizationId(organizationId);

  if (existingNEtwork) {
    throw new NetworkAlreadyExistError();
  }

  await networkRepository.save({ networkName, organizationId });
};

export { createNetwork };
