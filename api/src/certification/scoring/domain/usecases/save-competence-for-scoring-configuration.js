/**
 * @typedef {import('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const saveCompetenceForScoringConfiguration = withTransaction(
  /**
   * @param {Object} params
   * @param {Object} params.configuration
   * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
   */
  async ({ configuration, scoringConfigurationRepository }) => {
    return scoringConfigurationRepository.saveCompetenceForScoringConfiguration({ configuration });
  },
);
