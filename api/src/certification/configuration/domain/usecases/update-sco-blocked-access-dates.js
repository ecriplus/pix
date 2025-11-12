/**
 * @typedef {import ('./index.js').scoBlockedAccessDatesRepository} scoBlockedAccessDatesRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const updateScoBlockedAccessDates = withTransaction(
  /**
   * @param {Object} params
   * @param {scoBlockedAccessDatesRepository} params.scoBlockedAccessDatesRepository
   */
  async ({ key, value, scoBlockedAccessDatesRepository }) => {
    await scoBlockedAccessDatesRepository.updateScoBlockedAccessDate({ key, value });
  },
);
