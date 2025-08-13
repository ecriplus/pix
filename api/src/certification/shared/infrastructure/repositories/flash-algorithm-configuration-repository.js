//@ts-check
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../domain/models/FlashAssessmentAlgorithmConfiguration.js';

const TABLE_NAME = 'flash-algorithm-configurations';

/**
 * @returns {Promise<FlashAssessmentAlgorithmConfiguration>}
 */
export const getMostRecent = async () => {
  const knexConn = DomainTransaction.getConnection();
  const flashAlgorithmConfiguration = await knexConn('certification-configurations')
    .select('challengesConfiguration')
    .whereNull('expirationDate')
    .first();

  if (!flashAlgorithmConfiguration?.challengesConfiguration) {
    return _toDomain({});
  }

  return _toDomain({ ...flashAlgorithmConfiguration.challengesConfiguration });
};

export const getMostRecentBeforeDate = async (date) => {
  const knexConn = DomainTransaction.getConnection();
  const flashAlgorithmConfiguration = await knexConn(TABLE_NAME)
    .where('createdAt', '<=', date)
    .orderBy('createdAt', 'desc')
    .first();

  if (flashAlgorithmConfiguration) {
    return FlashAssessmentAlgorithmConfiguration.fromDTO(flashAlgorithmConfiguration);
  }

  const firstFlashAlgoConfiguration = await knexConn(TABLE_NAME).orderBy('createdAt', 'asc').first();

  if (!firstFlashAlgoConfiguration) {
    throw new NotFoundError('Configuration not found');
  }

  return FlashAssessmentAlgorithmConfiguration.fromDTO(firstFlashAlgoConfiguration);
};

/**
 * @param {Object} props
 * @param {number} [props.maximumAssessmentLength]
 * @param {number} [props.challengesBetweenSameCompetence]
 * @param {boolean} [props.limitToOneQuestionPerTube]
 * @param {boolean} [props.enablePassageByAllCompetences]
 * @param {number} [props.variationPercent]
 */
const _toDomain = ({
  maximumAssessmentLength,
  challengesBetweenSameCompetence,
  limitToOneQuestionPerTube,
  enablePassageByAllCompetences,
  variationPercent,
}) => {
  return new FlashAssessmentAlgorithmConfiguration({
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
  });
};
