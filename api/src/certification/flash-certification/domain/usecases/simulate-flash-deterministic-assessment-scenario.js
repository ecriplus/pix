import { FlashAssessmentAlgorithm } from '../model/FlashAssessmentAlgorithm.js';
import { AssessmentSimulator } from '../model/AssessmentSimulator.js';
import { AssessmentSimulatorSingleMeasureStrategy } from '../model/AssessmentSimulatorSingleMeasureStrategy.js';
import { AssessmentSimulatorDoubleMeasureStrategy } from '../model/AssessmentSimulatorDoubleMeasureStrategy.js';
import { FlashAssessmentAlgorithmConfiguration } from '../model/FlashAssessmentAlgorithmConfiguration.js';

export async function simulateFlashDeterministicAssessmentScenario({
  challengeRepository,
  locale,
  pickChallenge,
  pickAnswerStatus,
  stopAtChallenge,
  initialCapacity,
  useObsoleteChallenges,
  flashAlgorithmService,
  warmUpLength = 0,
  forcedCompetences = [],
  challengesBetweenSameCompetence = 0,
  limitToOneQuestionPerTube = true,
  minimumEstimatedSuccessRateRanges = [],
  enablePassageByAllCompetences = false,
  variationPercent,
  doubleMeasuresUntil = 0,
}) {
  const challenges = await challengeRepository.findFlashCompatible({ locale, useObsoleteChallenges });

  const flashAssessmentAlgorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: flashAlgorithmService,
    configuration: new FlashAssessmentAlgorithmConfiguration({
      warmUpLength,
      forcedCompetences,
      limitToOneQuestionPerTube,
      minimumEstimatedSuccessRateRanges,
      enablePassageByAllCompetences,
      variationPercent,
      doubleMeasuresUntil,
      challengesBetweenSameCompetence,
      maximumAssessmentLength: stopAtChallenge,
    }),
  });

  const singleMeasureStrategy = new AssessmentSimulatorSingleMeasureStrategy({
    algorithm: flashAssessmentAlgorithm,
    challenges,
    pickChallenge,
    pickAnswerStatus,
    initialCapacity,
  });

  const doubleMeasureStrategy = new AssessmentSimulatorDoubleMeasureStrategy({
    algorithm: flashAssessmentAlgorithm,
    challenges,
    pickChallenge,
    pickAnswerStatus,
    initialCapacity,
  });

  const getStrategy = (questionIndex) =>
    questionIndex >= doubleMeasuresUntil ? singleMeasureStrategy : doubleMeasureStrategy;

  const simulator = new AssessmentSimulator({
    getStrategy,
  });

  return simulator.run();
}