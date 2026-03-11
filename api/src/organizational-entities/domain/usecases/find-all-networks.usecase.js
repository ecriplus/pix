/**
 * @param {object} params
 * @param {NetworkRepository} params.networkRepository
 * @returns {Promise<Array<Network>>}
 */
const findAllNetworks = async function ({ networkRepository }) {
  return networkRepository.findAll();
};

export { findAllNetworks };
