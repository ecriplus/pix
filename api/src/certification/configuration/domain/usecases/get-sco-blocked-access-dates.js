/**
 * @typedef {import ('./index.js').ScoBlockedAccessDatesRepository} ScoBlockedAccessDatesRepository
 */

/**
 * @param {Object} params
 * @param {ScoBlockedAccessDatesRepository} paramsScoBlockedAccessDatesRepository
 * @returns {Promise<Array<ScoBlockedAccessDate>>}
 */

export const getScoBlockedAccessDates = async ({ ScoBlockedAccessDatesRepository }) => {
  return ScoBlockedAccessDatesRepository.getScoBlockedAccessDates();
};
