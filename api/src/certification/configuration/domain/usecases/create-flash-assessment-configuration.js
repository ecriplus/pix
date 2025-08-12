//@ts-check
/**
 * @typedef {import ('./index.js').FlashAlgorithmConfigurationRepository} FlashAlgorithmConfigurationRepository
 * @typedef {import ('./index.js').SharedFlashAlgorithmConfigurationRepository} SharedFlashAlgorithmConfigurationRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';

export const createFlashAssessmentConfiguration = withTransaction(
  /**
   * @param {Object} params
   * @param {FlashAssessmentAlgorithmConfiguration} params.configuration
   * @param {FlashAlgorithmConfigurationRepository} params.flashAlgorithmConfigurationRepository
   * @param {SharedFlashAlgorithmConfigurationRepository} params.sharedFlashAlgorithmConfigurationRepository
   */
  async ({ configuration, flashAlgorithmConfigurationRepository, sharedFlashAlgorithmConfigurationRepository }) => {
    const previousConfiguration = await sharedFlashAlgorithmConfigurationRepository.getMostRecent();
    const newConfiguration = new FlashAssessmentAlgorithmConfiguration({
      ...previousConfiguration,
      ...configuration,
    });
    await flashAlgorithmConfigurationRepository.save(newConfiguration);
  },
);
