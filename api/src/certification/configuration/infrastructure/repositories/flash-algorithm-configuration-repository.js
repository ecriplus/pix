/**
 * @typedef {import ('../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js').FlashAssessmentAlgorithmConfiguration} FlashAssessmentAlgorithmConfiguration
 */

import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

/**
 * @param {FlashAlgorithmConfiguration} flashAlgorithmConfiguration
 * @returns {Promise<void>}
 */
export const save = async (flashAlgorithmConfiguration) => {
  const knexConn = DomainTransaction.getConnection();

  const existingActiveConfigurationBeforeInsert = await knexConn('certification-configurations')
    .select('id')
    .whereNull('expirationDate')
    .first();

  const [{ startingDate: dateOfConfigurationSwitching }] = await knexConn('certification-configurations')
    .insert({
      startingDate: knexConn.fn.now(),
      expirationDate: null,
      challengesConfiguration: {
        maximumAssessmentLength: flashAlgorithmConfiguration.maximumAssessmentLength,
        challengesBetweenSameCompetence: flashAlgorithmConfiguration.challengesBetweenSameCompetence,
        limitToOneQuestionPerTube: flashAlgorithmConfiguration.limitToOneQuestionPerTube,
        enablePassageByAllCompetences: flashAlgorithmConfiguration.enablePassageByAllCompetences,
        variationPercent: flashAlgorithmConfiguration.variationPercent,
      },
    })
    .returning('startingDate');

  const mustExpirePreviousConfiguration = !!existingActiveConfigurationBeforeInsert?.id;

  if (mustExpirePreviousConfiguration) {
    await knexConn('certification-configurations').where({ id: existingActiveConfigurationBeforeInsert.id }).update({
      expirationDate: dateOfConfigurationSwitching,
    });
  }
};
