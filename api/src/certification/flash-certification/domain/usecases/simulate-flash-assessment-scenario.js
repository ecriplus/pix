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
  complementaryCertificationRepository,
  sharedFlashAlgorithmConfigurationRepository,
}) {
  const complementaryCertification = await complementaryCertificationRepository.getByKey(complementaryCertificationKey);

  const challenges = await _getChallenges({
    locale,
    challengeRepository,
    complementaryCertification,
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
  });
}

function _getChallenges({ challengeRepository, locale, accessibilityAdjustmentNeeded, complementaryCertification }) {
  return challengeRepository.findActiveFlashCompatible({
    locale,
    accessibilityAdjustmentNeeded,
    complementaryCertificationId: complementaryCertification?.id,
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
}) {
  const flashAssessmentAlgorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: flashAlgorithmService,
    configuration: new FlashAssessmentAlgorithmConfiguration({
      ...mostRecentAlgorithmConfiguration,
      variationPercent: variationPercent ?? mostRecentAlgorithmConfiguration.variationPercent,
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
