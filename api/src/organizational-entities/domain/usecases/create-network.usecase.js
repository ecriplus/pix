import { NetworkAlreadyExistError } from '../errors.js';

/**
 * @param{object} params
 * @param{number} params.organizationId
 * @param{string} params.networkName
 * @param{NetworkRepository} params.networkRepository
 * @returns {Promise<Network>}
 */
const createNetwork = async function ({ organizationId, networkName, networkRepository }) {
  const existingNetwork = await networkRepository.findByOrganizationId(organizationId);

  if (existingNetwork) {
    throw new NetworkAlreadyExistError();
  }

  return networkRepository.save({ networkName, organizationId });
};

export { createNetwork };
