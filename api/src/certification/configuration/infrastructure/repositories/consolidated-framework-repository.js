import { LOCALE } from '../../../../shared/domain/constants.js';
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import * as challengeRepository from '../../../../shared/infrastructure/repositories/challenge-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import { ConsolidatedFramework } from '../../domain/models/ConsolidatedFramework.js';

export async function create({ complementaryCertificationKey, challenges }) {
  const knexConn = DomainTransaction.getConnection();

  const challengesDTO = challenges.map((challenge) => ({
    complementaryCertificationKey,
    challengeId: challenge.id,
  }));

  await knexConn('certification-frameworks-challenges').insert(challengesDTO);
}

export async function getCurrentFrameworkByComplementaryCertificationKey({ complementaryCertificationKey }) {
  const knexConn = DomainTransaction.getConnection();

  const currentFrameworkChallenges = await knexConn('certification-frameworks-challenges')
    .where({
      createdAt: knexConn('certification-frameworks-challenges')
        .select('createdAt')
        .orderBy('createdAt', 'desc')
        .first(),
    })
    .select('*');

  const currentChallengeIds = currentFrameworkChallenges.map((challenge) => challenge.challengeId);
  const currentChallenges = await challengeRepository.getMany(currentChallengeIds, LOCALE.FRENCH_SPOKEN);

  const currentSkillIds = currentChallenges.map((challenge) => challenge.skill.id);
  const currentSkills = await skillRepository.findByRecordIds(currentSkillIds);

  const currentTubeIds = currentSkills.map((skill) => skill.tubeId);

  return _toDomain({
    complementaryCertificationKey,
    createdAt: currentFrameworkChallenges[0].createdAt,
    tubeIds: currentTubeIds,
  });
}

function _toDomain({ complementaryCertificationKey, createdAt, tubeIds }) {
  return new ConsolidatedFramework({ complementaryCertificationKey, createdAt, tubeIds });
}
