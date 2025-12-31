/**
 * @typedef {import ('./index.js').ScoBlockedAccessDatesRepository} ScoBlockedAccessDatesRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const updateScoBlockedAccessDate = withTransaction(
  /**
   * @param {object} params
   * @param {ScoOrganisationTagName} params.scoOrganizationTagName
   * @param {Date} params.reopeningDate
   * @param {ScoBlockedAccessDatesRepository} params.ScoBlockedAccessDatesRepository
   */
  async ({ scoOrganizationTagName, reopeningDate, ScoBlockedAccessDatesRepository }) => {
    const scoBlockedAccessDate =
      await ScoBlockedAccessDatesRepository.getScoBlockedAccessDateByKey(scoOrganizationTagName);
    scoBlockedAccessDate.updateReopeningDate(reopeningDate);
    return ScoBlockedAccessDatesRepository.updateScoBlockedAccessDate(scoBlockedAccessDate);
  },
);
