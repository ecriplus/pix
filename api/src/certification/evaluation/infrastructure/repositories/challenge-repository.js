/**
 * @typedef {import('../../../shared/domain/models/Version.js').Version} Version
 */
import { knex } from '../../../../../db/knex-database-connection.js';
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { Challenge } from '../../../../shared/domain/models/Challenge.js';
import * as solutionAdapter from '../../../../shared/infrastructure/adapters/solution-adapter.js';
import { LearningContentRepository } from '../../../../shared/infrastructure/repositories/learning-content-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import { child, SCOPES } from '../../../../shared/infrastructure/utils/logger.js';

const TABLE_NAME = 'learningcontent.challenges';

const logger = child('learningcontent:repository', { event: SCOPES.LEARNING_CONTENT });

const OBSOLETE_STATUS = 'périmé';
const VALIDATED_STATUS = 'validé';
const ARCHIVED_STATUS = 'archivé';
const OPERATIVE_STATUSES = [VALIDATED_STATUS, ARCHIVED_STATUS];

/**
 * @param {Version} version
 */
export const findAllCalibratedChallenges = async (version) => {
  const knexConn = DomainTransaction.getConnection();

  const calibrationForThisVersion = await knexConn
    .select('discriminant', 'difficulty', 'challengeId')
    .from('certification-frameworks-challenges')
    .where({ versionId: version.id })
    .whereNotNull('discriminant')
    .whereNotNull('difficulty')
    .orderBy('challengeId');

  const challengesIds = calibrationForThisVersion.map(({ challengeId }) => challengeId);

  const challengeDtos = await getInstance().getMany(challengesIds);

  const calibratedChallenges = calibrationForThisVersion.map((challengeCalibrationAtDate) => {
    const correspondingChallenge = challengeDtos.find(
      (challengeDto) => challengeCalibrationAtDate.challengeId === challengeDto.id,
    );

    // We replace "current" LCMS calibration with our version "at date" calibration
    correspondingChallenge.alpha = challengeCalibrationAtDate.discriminant;
    correspondingChallenge.delta = challengeCalibrationAtDate.difficulty;

    return correspondingChallenge;
  });

  const challengesDtosWithSkills = await loadChallengeDtosSkills(calibratedChallenges);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => toDomain({ challengeDto, skill }));
};

export async function findFlashCompatibleWithoutLocale({ fromArchivedCalibration = false } = {}) {
  if (fromArchivedCalibration) {
    return _findFlashCompatibleWithoutLocaleFromArchive();
  }
  return _findFlashCompatibleWithoutLocaleFromLCMS();
}

async function _findFlashCompatibleWithoutLocaleFromLCMS() {
  const acceptedStatuses = [OBSOLETE_STATUS, ...OPERATIVE_STATUSES];
  const cacheKey = `findFlashCompatibleByStatuses({ useObsoleteChallenges: true })`;
  const findFlashCompatibleByStatusesCallback = (knex) =>
    knex.whereIn('status', acceptedStatuses).whereNotNull('alpha').whereNotNull('delta').orderBy('id');
  const challengeDtos = await getInstance().find(cacheKey, findFlashCompatibleByStatusesCallback);
  const challengesDtosWithSkills = await loadChallengeDtosSkills(challengeDtos);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => toDomain({ challengeDto, skill }));
}

async function _findFlashCompatibleWithoutLocaleFromArchive() {
  const archivedChallenges = await knex('certification-data-active-calibrated-challenges');

  const challengesIds = archivedChallenges.map(({ challengeId }) => challengeId);
  const challengeDtos = await getInstance().getMany(challengesIds);

  const calibratedChallenges = archivedChallenges.map((archivedChallenge) => {
    const correspondingChallenge = challengeDtos.find(
      (challengeDto) => archivedChallenge.challengeId === challengeDto.id,
    );

    correspondingChallenge.alpha = archivedChallenge.alpha;
    correspondingChallenge.delta = archivedChallenge.delta;

    return correspondingChallenge;
  });

  const challengesDtosWithSkills = await loadChallengeDtosSkills(calibratedChallenges);
  return challengesDtosWithSkills.map(([challengeDto, skill]) => toDomain({ challengeDto, skill }));
}

function toDomain({ challengeDto, webComponentTagName, webComponentProps, skill, successProbabilityThreshold }) {
  const solution = solutionAdapter.fromDatasourceObject(challengeDto);
  const validator = Challenge.createValidatorForChallengeType({
    challengeType: challengeDto.type,
    solution,
  });

  if (OPERATIVE_STATUSES.includes(challengeDto.status) && !skill) {
    logger.warn({ challenge: challengeDto }, 'operative challenge has no skill');
  }

  return new Challenge({
    id: challengeDto.id,
    type: challengeDto.type,
    status: challengeDto.status,
    instruction: challengeDto.instruction,
    alternativeInstruction: challengeDto.alternativeInstruction,
    proposals: challengeDto.proposals,
    timer: challengeDto.timer,
    illustrationUrl: challengeDto.illustrationUrl,
    attachments: challengeDto.attachments ? [...challengeDto.attachments] : null,
    embedUrl: challengeDto.embedUrl,
    embedTitle: challengeDto.embedTitle,
    embedHeight: challengeDto.embedHeight,
    webComponentTagName,
    webComponentProps,
    skill,
    validator,
    competenceId: challengeDto.competenceId,
    illustrationAlt: challengeDto.illustrationAlt,
    format: challengeDto.format,
    locales: challengeDto.locales ? [...challengeDto.locales] : null,
    autoReply: challengeDto.autoReply,
    focused: challengeDto.focusable,
    discriminant: challengeDto.alpha,
    difficulty: challengeDto.delta,
    responsive: challengeDto.responsive,
    shuffled: challengeDto.shuffled,
    alternativeVersion: challengeDto.alternativeVersion,
    blindnessCompatibility: challengeDto.accessibility1,
    colorBlindnessCompatibility: challengeDto.accessibility2,
    successProbabilityThreshold,
    hasEmbedInternalValidation: challengeDto.hasEmbedInternalValidation,
    noValidationNeeded: challengeDto.noValidationNeeded,
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

async function loadChallengeDtosSkills(challengeDtos) {
  return Promise.all(
    challengeDtos.map(async (challengeDto) => [
      challengeDto,
      challengeDto.skillId ? await skillRepository.get(challengeDto.skillId) : null,
    ]),
  );
}
