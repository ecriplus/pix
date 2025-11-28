/**
 * @typedef {import('../../shared/domain/models/Version.js').Version} Version
 */

import { knex } from '../../../../../db/knex-database-connection.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { LearningContentRepository } from '../../../../shared/infrastructure/repositories/learning-content-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import { logger } from '../../../../shared/infrastructure/utils/logger.js';
import { CalibratedChallenge } from '../../domain/models/CalibratedChallenge.js';
import { CalibratedChallengeSkill } from '../../domain/models/CalibratedChallengeSkill.js';

const TABLE_NAME = 'learningcontent.challenges';
const VALIDATED_STATUS = 'validé';

/**
 * @param {Object} params
 * @param {string} params.locale
 * @param {Version} params.version
 * @returns {Promise<CalibratedChallenge[]>} challenges with validated LCMS status
 */
export async function findActiveFlashCompatible({
  locale,
  version,
  dependencies = {
    getInstance,
  },
} = {}) {
  _assertLocaleIsDefined(locale);
  const cacheKey = `findActiveFlashCompatible({ versionId: ${version?.id}, locale: ${locale} })`;

  const certificationChallenges = await knex
    .select('difficulty', 'discriminant', 'challengeId')
    .from('certification-frameworks-challenges')
    .where({ versionId: version.id })
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

  const challengeDtos = decorateWithCertificationCalibration({
    validChallengeDtos,
    certificationChallenges,
  });

  const challengesDtosWithSkills = await loadChallengeDtosSkills(challengeDtos);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => _toDomain({ challengeDto, skill }));
}

/**
 * @param {Object} params
 * @param {Array<string>} params.ids - array of challenge ids
 * @param {Version} params.version
 * @returns {Promise<CalibratedChallenge[]>}
 */
export async function getMany({
  ids,
  version,
  dependencies = {
    getInstance,
  },
} = {}) {
  const calibrations = await knex
    .select('difficulty', 'discriminant', 'challengeId')
    .from('certification-frameworks-challenges')
    .whereIn('challengeId', ids)
    .andWhere({ versionId: version.id })
    .whereNotNull('discriminant')
    .whereNotNull('difficulty');

  if (calibrations.length !== ids.length) {
    logger.error({ challengeIds: ids }, 'Some challenges do not exist in certification version');
    throw new NotFoundError('Some challenges do not exist in certification version');
  }

  const lcmsChallenges = await dependencies.getInstance().loadMany(ids);
  lcmsChallenges.forEach((challengeDto, index) => {
    if (challengeDto) return;
    logger.error({ challengeId: ids[index] }, 'Some challenges do not exist in LCMS');
    throw new NotFoundError('Some challenges do not exist in LCMS');
  });

  lcmsChallenges.sort(_byId);

  const challengesWithCalibration = decorateWithCertificationCalibration({
    validChallengeDtos: lcmsChallenges,
    certificationChallenges: calibrations,
  });

  const challengesDtosWithSkills = await loadChallengeDtosSkills(challengesWithCalibration);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => _toDomain({ challengeDto, skill }));
}

const _byId = (challenge1, challenge2) => {
  return challenge1.id < challenge2.id ? -1 : 1;
};

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
