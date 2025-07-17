/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 */

import { FlashAssessmentAlgorithmConfiguration } from '../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { AssessmentSimulator } from '../models/AssessmentSimulator.js';
import { AssessmentSimulatorSingleMeasureStrategy } from '../models/AssessmentSimulatorSingleMeasureStrategy.js';
import { FlashAssessmentAlgorithm } from '../models/FlashAssessmentAlgorithm.js';

/**
 * @param {Object} params
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @param {number} params.stopAtChallenge - force scenario to stop at challenge before maximumAssessmentLength
 */
export async function simulateFlashAssessmentScenario({
  locale,
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  challengeRepository,
  flashAlgorithmService,
  sharedFlashAlgorithmConfigurationRepository,
  complementaryCertificationRepository,
  accessibilityAdjustmentNeeded,
  complementaryCertificationKey,
  stopAtChallenge,
}) {
  if (complementaryCertificationKey) {
    return _simulateComplementaryCertificationScenario({
      complementaryCertificationKey,
      challengeRepository,
      complementaryCertificationRepository,
      flashAlgorithmService,
      sharedFlashAlgorithmConfigurationRepository,
      pickChallenge,
      pickAnswerStatus,
      initialCapacity,
      variationPercent,
      locale,
      stopAtChallenge,
    });
  } else {
    return _simulateCoreCertificationScenario({
      locale,
      accessibilityAdjustmentNeeded,
      challengeRepository,
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

async function _simulateComplementaryCertificationScenario({
  locale,
  complementaryCertificationKey,
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  challengeRepository,
  flashAlgorithmService,
  sharedFlashAlgorithmConfigurationRepository,
  stopAtChallenge,
}) {
  const challenges = await _getChallenges({
    locale,
    challengeRepository,
    complementaryCertificationKey,
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

function _getChallenges({ challengeRepository, locale, accessibilityAdjustmentNeeded, complementaryCertificationKey }) {
  return challengeRepository.findActiveFlashCompatible({
    locale,
    accessibilityAdjustmentNeeded,
    complementaryCertificationKey,
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
