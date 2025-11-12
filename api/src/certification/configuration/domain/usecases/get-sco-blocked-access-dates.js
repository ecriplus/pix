/**
 * @typedef {import ('./index.js').scoBlockedAccessDatesRepository} scoBlockedAccessDatesRepository
 */

/**
 * @param {Object} params
 * @param {scoBlockedAccessDatesRepository} params.scoBlockedAccessDatesRepository
 * @returns {Promise<Array<>>}
 */

export const getScoBlockedAccessDates = async ({ scoBlockedAccessDatesRepository }) => {
  return scoBlockedAccessDatesRepository.getScoBlockedAccessDates();
};
