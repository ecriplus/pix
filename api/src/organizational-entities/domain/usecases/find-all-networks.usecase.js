/**
 * @param {object} params
 * @param {object} [params.filter]
 * @param {string} [params.filter.name]
 * @param {NetworkRepository} params.networkRepository
 * @returns {Promise<Array<Network>>}
 */
const findAllNetworks = async function ({ filter, networkRepository }) {
  return networkRepository.findAll({ filter });
};

export { findAllNetworks };
