/**
 @typedef {import('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 */

/**
 * @param {object} params
 * @param {object} params.configuration
 * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
 */
export async function saveCertificationScoringConfiguration({ configuration, scoringConfigurationRepository }) {
  return scoringConfigurationRepository.saveCertificationScoringConfiguration({ configuration });
}
