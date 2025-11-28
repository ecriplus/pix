/**
 * @typedef {import('../../../evaluation/domain/usecases/index.js').AnswerRepository} AnswerRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').CertificationCandidateRepository} CertificationCandidateRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').CertificationChallengeLiveAlertRepository} CertificationChallengeLiveAlertRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').SharedChallengeRepository} SharedChallengeRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').CalibratedChallengeRepository} CalibratedChallengeRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').SessionManagementCertificationChallengeRepository} SessionManagementCertificationChallengeRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').VersionRepository} VersionRepository
 * @typedef {import('../../../evaluation/domain/usecases/index.js').FlashAlgorithmService} FlashAlgorithmService
 * @typedef {import('../../../evaluation/domain/usecases/index.js').PickChallengeService} PickChallengeService
 * @typedef {import('../../../evaluation/domain/usecases/index.js').AnsweredChallengeRepository} AnsweredChallengeRepository
 */

import Debug from 'debug';

import { AssessmentEndedError } from '../../../../shared/domain/errors.js';
import { CertificationChallenge } from '../../../shared/domain/models/CertificationChallenge.js';
import { FlashAssessmentAlgorithm } from '../models/FlashAssessmentAlgorithm.js';

const debugGetNextChallenge = Debug('pix:certif:get-next-challenge');

/**
 * @param {Object} params
 * @param {AnswerRepository} params.answerRepository
 * @param {CertificationCandidateRepository} params.certificationCandidateRepository
 * @param {CertificationChallengeLiveAlertRepository} params.certificationChallengeLiveAlertRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {SharedChallengeRepository} params.sharedChallengeRepository
 * @param {CalibratedChallengeRepository} params.calibratedChallengeRepository
 * @param {AnsweredChallengeRepository} params.answeredChallengeRepository
 * @param {VersionRepository} params.versionRepository
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
  calibratedChallengeRepository,
  answeredChallengeRepository,
  versionRepository,
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

  const answeredChallengeIds = allAnswers.map(({ challengeId }) => challengeId);

  const excludedChallengeIds = [...answeredChallengeIds, ...validatedLiveAlertChallengeIds];

  const lastNonAnsweredCertificationChallenge =
    await sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId(
      assessment.certificationCourseId,
      excludedChallengeIds,
    );

  if (lastNonAnsweredCertificationChallenge) {
    return sharedChallengeRepository.get(lastNonAnsweredCertificationChallenge.challengeId);
  }

  const candidate = await certificationCandidateRepository.findByAssessmentId({ assessmentId: assessment.id });

  const version = await versionRepository.getByScopeAndReconciliationDate({
    scope: candidate.subscriptionScope,
    reconciliationDate: candidate.reconciledAt,
  });

  const currentCalibratedChallenges = await calibratedChallengeRepository.findActiveFlashCompatible({
    locale,
    version,
  });

  const answeredCalibratedChallenges = await answeredChallengeRepository.getMany(answeredChallengeIds);

  const challenges = candidateCertificationReferential(answeredCalibratedChallenges, currentCalibratedChallenges);

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

  const assessmentAlgorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: flashAlgorithmService,
    configuration: version.challengesConfiguration,
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

  return sharedChallengeRepository.get(challenge.id);
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

/**
 * Construct a certification referential in the state presented to the current user
 * Allows the LCMS to be released during a certification without impacting the user
 *
 * Example: after LCMS release if a challenge becomes archived ('perime'), this challenge will be in
 *          `answeredCalibratedChallenges` param, but not in `currentCalibratedChallenges` param
 */
const candidateCertificationReferential = (answeredCalibratedChallenges, currentCalibratedChallenges) => {
  // It is critical that answeredCalibratedChallenges is in first parameter in order to take precedence
  const challenges = [...answeredCalibratedChallenges, ...currentCalibratedChallenges];
  return Object.values(
    challenges.reduce((acc, challenge) => {
      const existing = acc[challenge.id];

      if (!existing) {
        acc[challenge.id] = challenge;
      }

      return acc;
    }, {}),
  );
};

export { candidateCertificationReferential, getNextChallenge };
