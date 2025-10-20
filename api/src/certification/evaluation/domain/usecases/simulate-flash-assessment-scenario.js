/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import('./index.js').SharedChallengeRepository} SharedChallengeRepository
 * @typedef {import('./index.js').SharedFlashAlgorithmConfigurationRepository} SharedFlashAlgorithmConfigurationRepository
 * @typedef {import('./index.js').VersionRepository} VersionRepository
 */

import { FlashAssessmentAlgorithmConfiguration } from '../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { AssessmentSimulator } from '../models/AssessmentSimulator.js';
import { AssessmentSimulatorSingleMeasureStrategy } from '../models/AssessmentSimulatorSingleMeasureStrategy.js';
import { FlashAssessmentAlgorithm } from '../models/FlashAssessmentAlgorithm.js';

/**
 * @param {Object} params
 * @param {number} params.stopAtChallenge - force scenario to stop at challenge before maximumAssessmentLength
 * @param {SharedChallengeRepository} params.sharedChallengeRepository
 * @param {SharedFlashAlgorithmConfigurationRepository} params.sharedFlashAlgorithmConfigurationRepository
 * @param {VersionRepository} params.versionRepository
 */
export async function simulateFlashAssessmentScenario({
  locale,
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  flashAlgorithmService,
  sharedChallengeRepository,
  sharedFlashAlgorithmConfigurationRepository,
  accessibilityAdjustmentNeeded,
  stopAtChallenge,
  versionId,
  versionRepository,
}) {
  if (versionId) {
    return _simulateComplementaryCertificationScenario({
      versionId,
      challengeRepository: sharedChallengeRepository,
      flashAlgorithmService,
      pickChallenge,
      pickAnswerStatus,
      initialCapacity,
      variationPercent,
      locale,
      stopAtChallenge,
      versionRepository,
    });
  } else {
    return _simulateCoreCertificationScenario({
      locale,
      accessibilityAdjustmentNeeded,
      challengeRepository: sharedChallengeRepository,
      flashAlgorithmService,
      sharedFlashAlgorithmConfigurationRepository,
      pickChallenge,
      pickAnswerStatus,
      initialCapacity,
      variationPercent,
      stopAtChallenge,
    });
  }
}

/**
 * @param {Object} params
 * @param {SharedChallengeRepository} params.challengeRepository
 */
async function _simulateComplementaryCertificationScenario({
  locale,
  versionId,
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  challengeRepository,
  flashAlgorithmService,
  stopAtChallenge,
  versionRepository,
}) {
  const version = await versionRepository.getById(versionId);

  const challenges = await _getChallenges({
    locale,
    challengeRepository,
    version,
  });

  return _simulation({
    challenges,
    mostRecentAlgorithmConfiguration: version.challengesConfiguration,
    flashAlgorithmService,
    pickChallenge,
    pickAnswerStatus,
    initialCapacity,
    variationPercent,
    stopAtChallenge,
  });
}

/**
 * @param {Object} params
 * @param {SharedChallengeRepository} params.challengeRepository
 * @param {SharedFlashAlgorithmConfigurationRepository} params.sharedFlashAlgorithmConfigurationRepository
 */
async function _simulateCoreCertificationScenario({
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  challengeRepository,
  sharedFlashAlgorithmConfigurationRepository,
  flashAlgorithmService,
  locale,
  accessibilityAdjustmentNeeded,
  stopAtChallenge,
}) {
  const challenges = await _getChallenges({
    challengeRepository,
    locale,
    accessibilityAdjustmentNeeded,
  });

  const mostRecentAlgorithmConfiguration = await sharedFlashAlgorithmConfigurationRepository.getMostRecent();

  return _simulation({
    challenges,
    mostRecentAlgorithmConfiguration,
    flashAlgorithmService,
    pickChallenge,
    pickAnswerStatus,
    initialCapacity,
    variationPercent,
    stopAtChallenge,
  });
}

/**
 * @param {Object} params
 * @param {SharedChallengeRepository} params.challengeRepository
 */
function _getChallenges({ challengeRepository, locale, accessibilityAdjustmentNeeded, version }) {
  return challengeRepository.findActiveFlashCompatible({
    locale,
    accessibilityAdjustmentNeeded,
    version,
  });
}

function _simulation({
  challenges,
  mostRecentAlgorithmConfiguration,
  flashAlgorithmService,
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  stopAtChallenge,
}) {
  const flashAssessmentAlgorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: flashAlgorithmService,
    configuration: new FlashAssessmentAlgorithmConfiguration({
      ...mostRecentAlgorithmConfiguration,
      variationPercent: variationPercent ?? mostRecentAlgorithmConfiguration.variationPercent,
      maximumAssessmentLength: stopAtChallenge ?? mostRecentAlgorithmConfiguration.maximumAssessmentLength,
    }),
  });

  const singleMeasureStrategy = new AssessmentSimulatorSingleMeasureStrategy({
    algorithm: flashAssessmentAlgorithm,
    challenges,
    pickChallenge,
    pickAnswerStatus,
    initialCapacity,
  });

  const simulator = new AssessmentSimulator({
    strategy: singleMeasureStrategy,
  });

  return simulator.run();
}
