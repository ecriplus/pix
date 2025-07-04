import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { CertificationFrameworksChallenge } from '../../domain/models/CertificationFrameworksChallenge.js';
import { ConsolidatedFramework } from '../../domain/models/ConsolidatedFramework.js';

export async function create({ complementaryCertificationKey, challenges, version }) {
  const knexConn = DomainTransaction.getConnection();

  const challengesDTO = challenges.map((challenge) => ({
    complementaryCertificationKey,
    challengeId: challenge.id,
    version,
  }));

  await knexConn('certification-frameworks-challenges').insert(challengesDTO);
}

export async function getCurrentFrameworkByComplementaryCertificationKey({ complementaryCertificationKey }) {
  const knexConn = DomainTransaction.getConnection();

  const currentFrameworkChallengesDTO = await knexConn('certification-frameworks-challenges')
    .select(
      'alpha as discriminant',
      'delta as difficulty',
      'challengeId',
      'createdAt',
      'calibrationId',
      'complementaryCertificationKey',
    )
    .where({
      createdAt: knexConn('certification-frameworks-challenges')
        .select('createdAt')
        .orderBy('createdAt', 'desc')
        .first(),
      complementaryCertificationKey,
    })
    .select('*');

  return _toDomain({ certificationFrameworksChallengesDTO: currentFrameworkChallengesDTO });
}

/**
 * @param {Object} params
 * @param {Date} params.createdAt
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @returns {Promise<ConsolidatedFramework>}
 */
export async function findByCreationDateAndComplementaryKey({ createdAt, complementaryCertificationKey }) {
  const knexConn = DomainTransaction.getConnection();

  const certificationFrameworksChallengesDTO = await knexConn('certification-frameworks-challenges')
    .select('alpha as discriminant', 'delta as difficulty', 'challengeId', 'createdAt', 'complementaryCertificationKey')
    .where({
      complementaryCertificationKey,
      createdAt,
    })
    .orderBy('challengeId');

  if (certificationFrameworksChallengesDTO.length == 0) {
    return [];
  }

  return _toDomain({ certificationFrameworksChallengesDTO });
}

/**
 * @param {ConsolidatedFramework} consolidatedFramework
 * @returns {Promise<void>}
 */
export async function save(consolidatedFramework) {
  const knexConn = DomainTransaction.getConnection();

  for (const calibratedChallenge of consolidatedFramework.challenges) {
    await knexConn('certification-frameworks-challenges')
      .update({
        alpha: calibratedChallenge.discriminant,
        delta: calibratedChallenge.difficulty,
        calibrationId: consolidatedFramework.calibrationId,
      })
      .where({
        complementaryCertificationKey: consolidatedFramework.complementaryCertificationKey,
        createdAt: consolidatedFramework.createdAt,
        challengeId: calibratedChallenge.challengeId,
      });
  }
}

function _toDomain({ certificationFrameworksChallengesDTO }) {
  const { complementaryCertificationKey, createdAt, calibrationId } = certificationFrameworksChallengesDTO[0];

  return new ConsolidatedFramework({
    complementaryCertificationKey,
    createdAt,
    calibrationId,
    challenges: certificationFrameworksChallengesDTO.map(
      (challenge) => new CertificationFrameworksChallenge(challenge),
    ),
  });
}
