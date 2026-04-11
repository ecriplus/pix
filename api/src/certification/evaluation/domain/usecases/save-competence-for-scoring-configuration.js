/**
 * @typedef {import('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 */

/**
 * @param {object} params
 * @param {object} params.configuration
 * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
 */
export async function saveCompetenceForScoringConfiguration({ configuration, scoringConfigurationRepository }) {
  return scoringConfigurationRepository.saveCompetenceForScoringConfiguration({ configuration });
}
