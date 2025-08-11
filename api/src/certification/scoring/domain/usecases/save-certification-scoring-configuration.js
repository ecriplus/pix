/**
 * @typedef {import('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const saveCertificationScoringConfiguration = withTransaction(
  /**
   * @param {Object} params
   * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
   */
  async ({ data, scoringConfigurationRepository }) => {
    return scoringConfigurationRepository.saveCertificationScoringConfiguration({ configuration: data });
  },
);
