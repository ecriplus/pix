import { knex } from '../../../../../db/knex-database-connection.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { LearningContentRepository } from '../../../../shared/infrastructure/repositories/learning-content-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import { child, SCOPES } from '../../../../shared/infrastructure/utils/logger.js';
import { CalibratedChallenge } from '../../domain/models/CalibratedChallenge.js';
import { CalibratedChallengeSkill } from '../../domain/models/CalibratedChallengeSkill.js';

const logger = child('learningcontent:repository', { event: SCOPES.LEARNING_CONTENT });

const TABLE_NAME = 'learningcontent.challenges';
const VALIDATED_STATUS = 'validé';

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
  localeChallengeDtos.sort(byId);
  const challengesDtosWithSkills = await loadChallengeDtosSkills(localeChallengeDtos);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => toCalibratedChallengeDomain({ challengeDto, skill }));
}

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
  return challengesDtosWithSkills.map(([challengeDto, skill]) => toCalibratedChallengeDomain({ challengeDto, skill }));
}

async function _findChallengesForCertification({ versionId, locale, cacheKey, dependencies }) {
  const certificationChallenges = await knex
    .from('certification-frameworks-challenges')
    .where({ versionId })
    .whereNotNull('discriminant')
    .whereNotNull('difficulty');

  const certificationChallengeIds = certificationChallenges.map(({ challengeId }) => challengeId);

  const findCallback = async (knex) => {
    return knex
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
      alpha: discriminant,
      delta: difficulty,
    };
  });
}

function _assertLocaleIsDefined(locale) {
  if (!locale) {
    throw new Error('Locale shall be defined');
  }
}

function byId(challenge1, challenge2) {
  return challenge1.id < challenge2.id ? -1 : 1;
}

function toCalibratedChallengeDomain({ challengeDto, skill }) {
  return new CalibratedChallenge({
    id: challengeDto.id,
    discriminant: challengeDto.alpha,
    difficulty: challengeDto.delta,
    blindnessCompatibility: challengeDto.accessibility1,
    colorBlindnessCompatibility: challengeDto.accessibility2,
    competenceId: challengeDto.competenceId,
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
