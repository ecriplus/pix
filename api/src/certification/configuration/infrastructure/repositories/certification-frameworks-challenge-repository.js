// TODO : rename file

import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { CertificationFrameworksChallenge } from '../../domain/models/CertificationFrameworksChallenge.js';
import { ConsolidatedFramework } from '../../domain/models/ConsolidatedFramework.js';

/**
 * @typedef {import ('../../domain/models/CertificationFrameworksChallenge.js').CertificationFrameworksChallenge} CertificationFrameworksChallenge
 * @typedef {import ('../../domain/models/ConsolidatedFramework.js').ConsolidatedFramework} ComplementaryCertificationKeys
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 */

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

  if (!certificationFrameworksChallengesDTO) {
    return null;
  }

  return _toDomain({ certificationFrameworksChallengesDTO });
}

/**
 * @param {Array<ConsolidatedFramework>} consolidatedFramework
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
  const { complementaryCertificationKey, createdAt } = certificationFrameworksChallengesDTO[0];

  return new ConsolidatedFramework({
    complementaryCertificationKey,
    createdAt,
    challenges: certificationFrameworksChallengesDTO.map(
      (challenge) => new CertificationFrameworksChallenge(challenge),
    ),
  });
}
