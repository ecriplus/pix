/**
 * @param {object} params
 * @param {number} params.networkId
 * @param {string} params.networkName
 * @param {NetworkRepository} params.networkRepository
 * @returns {Promise<Network>}
 */
const updateNetwork = async function ({ networkId, networkName, networkRepository }) {
  const network = await networkRepository.getById(networkId);
  network.updateName(networkName);
  return networkRepository.update(network);
};

export { updateNetwork };
