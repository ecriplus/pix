/**
 * @typedef {import('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const saveCompetenceForScoringConfiguration = withTransaction(
  /**
   * @param {Object} params
   * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
   */
  async ({ data, scoringConfigurationRepository }) => {
    return scoringConfigurationRepository.saveCompetenceForScoringConfiguration({ configuration: data });
  },
);
