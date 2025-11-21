import { knex } from '../../../../../db/knex-database-connection.js';
import { LearningContentRepository } from '../../../../shared/infrastructure/repositories/learning-content-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import { CalibratedChallenge } from '../../domain/models/CalibratedChallenge.js';
import { CalibratedChallengeSkill } from '../../domain/models/CalibratedChallengeSkill.js';

const TABLE_NAME = 'learningcontent.challenges';
const VALIDATED_STATUS = 'validé';

export async function findActiveFlashCompatible({
  locale,
  version,
  dependencies = {
    getInstance,
  },
} = {}) {
  _assertLocaleIsDefined(locale);
  const cacheKey = `findActiveFlashCompatible({ versionId: ${version?.id}, locale: ${locale} })`;

  const challengeDtos = await _findChallengesForCertification({
    locale,
    cacheKey,
    versionId: version.id,
    dependencies,
  });

  const challengesDtosWithSkills = await loadChallengeDtosSkills(challengeDtos);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => _toDomain({ challengeDto, skill }));
}

async function _findChallengesForCertification({ versionId, locale, cacheKey, dependencies }) {
  const certificationChallenges = await knex
    .select('difficulty', 'discriminant', 'challengeId')
    .from('certification-frameworks-challenges')
    .where({ versionId })
    .whereNotNull('discriminant')
    .whereNotNull('difficulty');

  const certificationChallengeIds = certificationChallenges.map(({ challengeId }) => challengeId);

  const findCallback = async (knex) => {
    return knex
      .select('id', 'skillId', 'accessibility1', 'accessibility2')
      .whereIn('id', certificationChallengeIds)
      .where('status', VALIDATED_STATUS)
      .whereRaw('?=ANY(??)', [locale, 'locales'])
      .orderBy('id');
  };

  const validChallengeDtos = await dependencies.getInstance().find(cacheKey, findCallback);

  return decorateWithCertificationCalibration({
    validChallengeDtos,
    certificationChallenges,
  });
}

async function loadChallengeDtosSkills(challengeDtos) {
  return Promise.all(
    challengeDtos.map(async (challengeDto) => [
      challengeDto,
      challengeDto.skillId ? await skillRepository.get(challengeDto.skillId) : null,
    ]),
  );
}

function decorateWithCertificationCalibration({ validChallengeDtos, certificationChallenges }) {
  return validChallengeDtos.map((challenge) => {
    const { discriminant, difficulty } = certificationChallenges.find(
      ({ challengeId }) => challengeId === challenge.id,
    );

    return {
      ...challenge,
      discriminant,
      difficulty,
    };
  });
}

function _assertLocaleIsDefined(locale) {
  if (!locale) {
    throw new Error('Locale shall be defined');
  }
}

function _toDomain({ challengeDto, skill }) {
  return new CalibratedChallenge({
    id: challengeDto.id,
    discriminant: challengeDto.discriminant,
    difficulty: challengeDto.difficulty,
    blindnessCompatibility: challengeDto.accessibility1,
    colorBlindnessCompatibility: challengeDto.accessibility2,
    skill: new CalibratedChallengeSkill({
      id: skill.id,
      name: skill.name,
      competenceId: skill.competenceId,
      tubeId: skill.tubeId,
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
