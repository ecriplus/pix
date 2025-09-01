//@ts-check
/**
 * @typedef {import ('../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js').FlashAssessmentAlgorithmConfiguration} FlashAssessmentAlgorithmConfiguration
 * @typedef {import ('./index.js').SharedFlashAlgorithmConfigurationRepository} SharedFlashAlgorithmConfigurationRepository
 */

/**
 * @param {Object} params
 * @param {SharedFlashAlgorithmConfigurationRepository} params.sharedFlashAlgorithmConfigurationRepository
 * @returns {Promise<FlashAssessmentAlgorithmConfiguration>}
 */
export const getActiveFlashAssessmentConfiguration = async ({ sharedFlashAlgorithmConfigurationRepository }) => {
  return sharedFlashAlgorithmConfigurationRepository.getMostRecent();
};
