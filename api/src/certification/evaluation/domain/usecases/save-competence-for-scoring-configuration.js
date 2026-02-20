/**
 * @typedef {import('../../../scoring/domain/usecases/index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const saveCompetenceForScoringConfiguration = withTransaction(
  /**
   * @param {object} params
   * @param {object} params.configuration
   * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
   */
  async ({ configuration, scoringConfigurationRepository }) => {
    return scoringConfigurationRepository.saveCompetenceForScoringConfiguration({ configuration });
  },
);
