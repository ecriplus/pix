import { NotFoundError } from '../../../../shared/domain/errors.js';
import { LearningContentRepository } from '../../../../shared/infrastructure/repositories/learning-content-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import { logger } from '../../../../shared/infrastructure/utils/logger.js';
import { AnsweredChallenge } from '../../domain/models/AnsweredChallenge.js';
import { AnsweredChallengeSkill } from '../../domain/models/AnsweredChallengeSkill.js';

const TABLE_NAME = 'learningcontent.challenges';

export async function getMany(ids, locale) {
  const challengeDtos = await getInstance().loadMany(ids);
  challengeDtos.forEach((challengeDto, index) => {
    if (challengeDto) return;
    logger.warn({ challengeId: ids[index] }, 'Épreuve introuvable');
    throw new NotFoundError('Épreuve introuvable');
  });
  const localeChallengeDtos = locale
    ? challengeDtos.filter((challengeDto) => challengeDto.locales.includes(locale))
    : challengeDtos;
  localeChallengeDtos.sort(_byId);
  const challengesDtosWithSkills = await _loadChallengeDtosSkills(localeChallengeDtos);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => _toDomain({ challengeDto, skill }));
}

function _byId(challenge1, challenge2) {
  return challenge1.id < challenge2.id ? -1 : 1;
}

async function _loadChallengeDtosSkills(challengeDtos) {
  return Promise.all(
    challengeDtos.map(async (challengeDto) => [
      challengeDto,
      challengeDto.skillId ? await skillRepository.get(challengeDto.skillId) : null,
    ]),
  );
}

function _toDomain({ challengeDto, skill }) {
  return new AnsweredChallenge({
    id: challengeDto.id,
    skill: new AnsweredChallengeSkill({
      id: skill.id,
    }),
  });
}

/** @type {LearningContentRepository} */
let instance;

function getInstance() {
  if (!instance) {
    instance = new LearningContentRepository({ tableName: TABLE_NAME });
  }
  return instance;
}
