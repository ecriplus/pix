/**
 * @typedef {import ('./index.js').scoBlockedAccessDates} scoBlockedAccessDates
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const updateScoBlockedAccessDates = withTransaction(
  /**
   * @param {Object} params
   * @param {scoBlockedAccessDates} params.scoBlockedAccessDates
   */
  async ({ key, value, scoBlockedAccessDates }) => {
    await scoBlockedAccessDates.updateScoBlockedAccessDate({ key, value });
  },
);
