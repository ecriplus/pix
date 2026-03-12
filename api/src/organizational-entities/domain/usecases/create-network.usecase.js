import { NetworkAlreadyExistError, OrganizationNotFound } from '../errors.js';

/**
 * @param{object} params
 * @param{number} params.organizationId
 * @param{string} params.networkName
 * @param{NetworkRepository} params.networkRepository
 * @returns {Promise<Network>}
 */
const createNetwork = async function ({
  organizationId,
  networkName,
  networkRepository,
  organizationForAdminRepository,
}) {
  const isOrganizationExisting = await organizationForAdminRepository.exist({
    organizationId,
  });

  if (!isOrganizationExisting) {
    throw new OrganizationNotFound({
      meta: {
        organizationId: Number(organizationId),
      },
    });
  }

  const existingNetwork = await networkRepository.findByOrganizationId(organizationId);

  if (existingNetwork) {
    throw new NetworkAlreadyExistError();
  }

  return networkRepository.save({ networkName, organizationId });
};

export { createNetwork };
