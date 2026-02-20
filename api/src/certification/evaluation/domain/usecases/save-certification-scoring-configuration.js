/**
 @typedef {import('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const saveCertificationScoringConfiguration = withTransaction(
  /**
   * @param {object} params
   * @param {object} params.configuration
   * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
   */
  async ({ configuration, scoringConfigurationRepository }) => {
    return scoringConfigurationRepository.saveCertificationScoringConfiguration({ configuration });
  },
);
