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
  const complementaryCertification = complementaryCertificationKey
    ? await complementaryCertificationRepository.getByKey(complementaryCertificationKey)
    : null;

  const challenges = await challengeRepository.findActiveFlashCompatible({
    locale,
    accessibilityAdjustmentNeeded,
    complementaryCertificationId: complementaryCertification?.id,
  });

  const configurationUsedInProduction = await sharedFlashAlgorithmConfigurationRepository.getMostRecent();

  const flashAssessmentAlgorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: flashAlgorithmService,
    configuration: new FlashAssessmentAlgorithmConfiguration({
      ...configurationUsedInProduction,
      variationPercent: variationPercent ?? configurationUsedInProduction.variationPercent,
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
