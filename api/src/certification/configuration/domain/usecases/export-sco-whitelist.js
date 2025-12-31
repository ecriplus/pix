/**
 * @typedef {import ('./index.js').CenterRepository} CenterRepository
 * @typedef {import ('../models/Center.js').Center} Center
 */

/**
 * @param {object} params
 * @param {CenterRepository} params.centerRepository
 * @returns {Promise<Array<Center>>}
 */
export const exportScoWhitelist = async ({ centerRepository }) => {
  return centerRepository.getWhitelist();
};
