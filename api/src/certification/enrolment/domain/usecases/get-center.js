/**
 * @typedef {import('./index.js').CenterRepository} CenterRepository
 */

/**
 * @param {object} params
 * @param {CenterRepository} params.centerRepository
 */
const getCenter = function ({ id, centerRepository }) {
  return centerRepository.getById({ id });
};

export { getCenter };
