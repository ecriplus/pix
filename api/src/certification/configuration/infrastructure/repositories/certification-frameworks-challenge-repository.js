// TODO : rename file

import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { CertificationFrameworksChallenge } from '../../domain/models/CertificationFrameworksChallenge.js';
import { ConsolidatedFramework } from '../../domain/models/ConsolidatedFramework.js';

/**
 * @param {Object} params
 * @param {Date} params.createdAt
 * @param {ComplementaryCertificationKey} params.complementaryCertificationKey
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

  if (!certificationFrameworksChallengesDTO) {
    return null;
  }

  return _toDomain({ certificationFrameworksChallengesDTO });
}

/**
 * @param {Array<CertificationFrameworksChallenge>} certificationFrameworksChallenges
 * @returns {Promise<void>}
 */
export async function save(certificationFrameworksChallenges) {
  const knexConn = DomainTransaction.getConnection();

  for (const calibratedCertificationFrameworksChallenge of certificationFrameworksChallenges) {
    const { discriminant, difficulty, complementaryCertificationKey, createdAt, challengeId } =
      calibratedCertificationFrameworksChallenge;
    await knexConn('certification-frameworks-challenges')
      .update({
        alpha: discriminant,
        delta: difficulty,
      })
      .where({ complementaryCertificationKey, createdAt, challengeId });
  }
}

function _toDomain({ certificationFrameworksChallengesDTO }) {
  const { complementaryCertificationKey, createdAt } = certificationFrameworksChallengesDTO[0];

  return new ConsolidatedFramework({
    complementaryCertificationKey,
    createdAt,
    challenges: certificationFrameworksChallengesDTO.map(
      (challenge) => new CertificationFrameworksChallenge(challenge),
    ),
  });
}
