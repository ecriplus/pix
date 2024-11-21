import { FlashAssessmentAlgorithmConfiguration } from '../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { AssessmentSimulator } from '../models/AssessmentSimulator.js';
import { AssessmentSimulatorSingleMeasureStrategy } from '../models/AssessmentSimulatorSingleMeasureStrategy.js';
import { FlashAssessmentAlgorithm } from '../models/FlashAssessmentAlgorithm.js';

export async function simulateFlashAssessmentScenario({
  locale,
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  challengeRepository,
  flashAlgorithmService,
  sharedFlashAlgorithmConfigurationRepository,
}) {
  const challenges = await challengeRepository.findActiveFlashCompatible({ locale });

  const configurationUsedInProduction = await sharedFlashAlgorithmConfigurationRepository.getMostRecent();

  const flashAssessmentAlgorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: flashAlgorithmService,
    configuration: new FlashAssessmentAlgorithmConfiguration({
      limitToOneQuestionPerTube: configurationUsedInProduction.limitToOneQuestionPerTube,
      minimumEstimatedSuccessRateRanges: configurationUsedInProduction.minimumEstimatedSuccessRateRanges,
      enablePassageByAllCompetences: configurationUsedInProduction.enablePassageByAllCompetences,
      variationPercent: variationPercent ?? configurationUsedInProduction.variationPercent,
      variationPercentUntil: configurationUsedInProduction.variationPercentUntil,
      doubleMeasuresUntil: configurationUsedInProduction.doubleMeasuresUntil,
      challengesBetweenSameCompetence: configurationUsedInProduction.challengesBetweenSameCompetence,
      maximumAssessmentLength: configurationUsedInProduction.maximumAssessmentLength,
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
