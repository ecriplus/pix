/**
 * @typedef {import ('./index.js').scoBlockedAccessDatesRepository} scoBlockedAccessDatesRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const updateScoBlockedAccessDate = withTransaction(
  /**
   * @param {Object} params
   * @param {String} params.scoOrganizationType
   * @param {Date} params.reopeningDate
   * @param {scoBlockedAccessDatesRepository} params.scoBlockedAccessDatesRepository
   */
  async ({ scoOrganizationType, reopeningDate, scoBlockedAccessDatesRepository }) => {
    return scoBlockedAccessDatesRepository.updateScoBlockedAccessDate({ scoOrganizationType, reopeningDate });
  },
);
