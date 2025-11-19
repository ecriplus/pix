/**
 * @typedef {import ('./index.js').ScoBlockedAccessDatesRepository} ScoBlockedAccessDatesRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const updateScoBlockedAccessDate = withTransaction(
  /**
   * @param {Object} params
   * @param {String} params.scoOrganizationTagName
   * @param {Date} params.reopeningDate
   * @param {ScoBlockedAccessDatesRepository} params.ScoBlockedAccessDatesRepository
   */
  async ({ scoOrganizationTagName, reopeningDate, ScoBlockedAccessDatesRepository }) => {
    const scoBlockedAccessDate =
      await ScoBlockedAccessDatesRepository.findScoBlockedAccessDateByKey(scoOrganizationTagName);
    scoBlockedAccessDate.updateReopeningDate(reopeningDate);
    return ScoBlockedAccessDatesRepository.updateScoBlockedAccessDate(scoBlockedAccessDate);
  },
);
