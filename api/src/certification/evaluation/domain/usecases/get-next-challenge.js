/**
 * @typedef {import('../../../evaluation/domain/usecases/index.js').AnswerRepository} AnswerRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').CertificationCandidateRepository} CertificationCandidateRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').CertificationChallengeLiveAlertRepository} CertificationChallengeLiveAlertRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').SharedChallengeRepository} SharedChallengeRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').FlashAlgorithmConfigurationRepository} FlashAlgorithmConfigurationRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').SessionManagementCertificationChallengeRepository} SessionManagementCertificationChallengeRepository
 * @typedef {import('../../../configuration/domain/usecases/index.js').VersionsRepository} VersionsRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').FlashAlgorithmService} FlashAlgorithmService
 * @typedef {import('../../../evaluation/domain/usecases/index.js').PickChallengeService} PickChallengeService
 */

import Debug from 'debug';

import { AssessmentEndedError } from '../../../../shared/domain/errors.js';
import { CertificationChallenge } from '../../../shared/domain/models/CertificationChallenge.js';
import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';
import { Frameworks } from '../../../shared/domain/models/Frameworks.js';
import { FlashAssessmentAlgorithm } from '../models/FlashAssessmentAlgorithm.js';

const debugGetNextChallenge = Debug('pix:certif:get-next-challenge');

/**
 * @param {Object} params
 * @param {AnswerRepository} params.answerRepository
 * @param {CertificationCandidateRepository} params.certificationCandidateRepository
 * @param {CertificationChallengeLiveAlertRepository} params.certificationChallengeLiveAlertRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {SharedChallengeRepository} params.sharedChallengeRepository
 * @param {VersionsRepository} params.versionsRepository
 * @param {SessionManagementCertificationChallengeRepository} params.sessionManagementCertificationChallengeRepository
 * @param {FlashAlgorithmService} params.flashAlgorithmService
 * @param {PickChallengeService} params.pickChallengeService
 */
const getNextChallenge = async function ({
  assessment,
  answerRepository,
  locale,
  certificationCandidateRepository,
  certificationChallengeLiveAlertRepository,
  certificationCourseRepository,
  sessionManagementCertificationChallengeRepository,
  sharedChallengeRepository,
  versionsRepository,
  flashAlgorithmService,
  pickChallengeService,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: assessment.certificationCourseId });

  const validatedLiveAlertChallengeIds = await _getValidatedLiveAlertChallengeIds({
    assessmentId: assessment.id,
    certificationChallengeLiveAlertRepository,
  });

  const allAnswers = await answerRepository.findByAssessmentExcludingChallengeIds({
    assessmentId: assessment.id,
    excludedChallengeIds: validatedLiveAlertChallengeIds,
  });

  const alreadyAnsweredChallengeIds = allAnswers.map(({ challengeId }) => challengeId);

  const excludedChallengeIds = [...alreadyAnsweredChallengeIds, ...validatedLiveAlertChallengeIds];

  const lastNonAnsweredCertificationChallenge =
    await sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId(
      assessment.certificationCourseId,
      excludedChallengeIds,
    );

  if (lastNonAnsweredCertificationChallenge) {
    return sharedChallengeRepository.get(lastNonAnsweredCertificationChallenge.challengeId);
  }

  const candidate = await certificationCandidateRepository.findByAssessmentId({ assessmentId: assessment.id });

  const complementaryCertificationKey =
    candidate.subscriptionScope !== Frameworks.CORE ? candidate.subscriptionScope : undefined;

  const activeFlashCompatibleChallenges = await sharedChallengeRepository.findActiveFlashCompatible({
    locale,
    date: candidate.reconciledAt,
    complementaryCertificationKey,
  });

  const alreadyAnsweredChallenges = await sharedChallengeRepository.getMany(alreadyAnsweredChallengeIds);

  const challenges = [...new Set([...alreadyAnsweredChallenges, ...activeFlashCompatibleChallenges])];

  const challengesWithoutSkillsWithAValidatedLiveAlert = _excludeChallengesWithASkillWithAValidatedLiveAlert({
    validatedLiveAlertChallengeIds,
    challenges,
  });

  const challengesForCandidate = candidate.accessibilityAdjustmentNeeded
    ? challengesWithoutSkillsWithAValidatedLiveAlert.filter((challenge) => challenge.isAccessible)
    : challengesWithoutSkillsWithAValidatedLiveAlert;
  debugGetNextChallenge(
    candidate.accessibilityAdjustmentNeeded
      ? `Candidate needs accessibility adjustment, possible challenges have been filtered (${challengesForCandidate.length} out of ${challengesWithoutSkillsWithAValidatedLiveAlert.length} selected`
      : `Candidate does need any adjustment, all ${challengesWithoutSkillsWithAValidatedLiveAlert.length} have been selected`,
  );

  const scope = _determineScope(complementaryCertificationKey);

  const certificationVersion = await versionsRepository.getByScopeAndReconciliationDate({
    scope,
    reconciliationDate: candidate.reconciledAt,
  });

  const assessmentAlgorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: flashAlgorithmService,
    configuration: certificationVersion.challengesConfiguration,
  });
  const possibleChallenges = assessmentAlgorithm.getPossibleNextChallenges({
    assessmentAnswers: allAnswers,
    challenges: challengesForCandidate,
  });

  if (_hasAnsweredToAllChallenges({ possibleChallenges })) {
    throw new AssessmentEndedError();
  }

  const challenge = pickChallengeService.getChallengePicker()({ possibleChallenges });

  const certificationChallenge = new CertificationChallenge({
    associatedSkillName: challenge.skill.name,
    associatedSkillId: challenge.skill.id,
    challengeId: challenge.id,
    competenceId: challenge.skill.competenceId,
    courseId: certificationCourse.getId(),
    isNeutralized: false,
    certifiableBadgeKey: null,
    discriminant: challenge.discriminant,
    difficulty: challenge.difficulty,
  });

  await sessionManagementCertificationChallengeRepository.save({ certificationChallenge });

  return challenge;
};

const _hasAnsweredToAllChallenges = ({ possibleChallenges }) => {
  return possibleChallenges.length === 0;
};

const _excludeChallengesWithASkillWithAValidatedLiveAlert = ({ validatedLiveAlertChallengeIds, challenges }) => {
  const validatedLiveAlertChallenges = challenges.filter((challenge) => {
    return validatedLiveAlertChallengeIds.includes(challenge.id);
  });

  const excludedSkillIds = validatedLiveAlertChallenges.map((challenge) => challenge.skill.id);

  const challengesWithoutSkillsWithAValidatedLiveAlert = challenges.filter(
    (challenge) => !excludedSkillIds.includes(challenge.skill.id),
  );

  return challengesWithoutSkillsWithAValidatedLiveAlert;
};

const _getValidatedLiveAlertChallengeIds = async ({ assessmentId, certificationChallengeLiveAlertRepository }) => {
  return certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId({ assessmentId });
};

const _determineScope = (complementaryCertificationKey) => {
  if (!complementaryCertificationKey || complementaryCertificationKey === ComplementaryCertificationKeys.CLEA) {
    return Frameworks.CORE;
  }

  return complementaryCertificationKey;
};

export { getNextChallenge };
