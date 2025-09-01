//@ts-check
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../domain/models/FlashAssessmentAlgorithmConfiguration.js';

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
  const flashAlgorithmConfiguration = await knexConn('certification-configurations')
    .where('startingDate', '<=', date)
    .andWhere((queryBuilder) => {
      queryBuilder.whereNull('expirationDate').orWhere('expirationDate', '>', date);
    })
    .first();

  if (!flashAlgorithmConfiguration) {
    throw new NotFoundError('Configuration not found');
  }

  return _toDomain({ ...flashAlgorithmConfiguration.challengesConfiguration });
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
