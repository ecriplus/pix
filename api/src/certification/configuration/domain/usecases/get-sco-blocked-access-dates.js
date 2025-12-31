/**
 * @typedef {import ('./index.js').ScoBlockedAccessDatesRepository} ScoBlockedAccessDatesRepository
 */

/**
 * @param {object} params
 * @param {ScoBlockedAccessDatesRepository} paramsScoBlockedAccessDatesRepository
 * @returns {Promise<Array<ScoBlockedAccessDate>>}
 */

export const getScoBlockedAccessDates = async ({ ScoBlockedAccessDatesRepository }) => {
  return ScoBlockedAccessDatesRepository.getScoBlockedAccessDates();
};
