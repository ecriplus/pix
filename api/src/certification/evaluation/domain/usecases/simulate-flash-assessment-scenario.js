/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import('./index.js').SharedChallengeRepository} SharedChallengeRepository
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
  accessibilityAdjustmentNeeded,
  stopAtChallenge,
  versionId,
  versionRepository,
}) {
  const version = await versionRepository.getById(versionId);

  return _simulateCertificationScenario({
    locale,
    accessibilityAdjustmentNeeded,
    challengeRepository: sharedChallengeRepository,
    flashAlgorithmService,
    pickChallenge,
    pickAnswerStatus,
    initialCapacity,
    variationPercent,
    stopAtChallenge,
    version,
  });
}

/**
 * @param {Object} params
 * @param {SharedChallengeRepository} params.challengeRepository
 */
async function _simulateCertificationScenario({
  pickChallenge,
  pickAnswerStatus,
  initialCapacity,
  variationPercent,
  challengeRepository,
  flashAlgorithmService,
  locale,
  accessibilityAdjustmentNeeded,
  stopAtChallenge,
  version,
}) {
  let challenges = await challengeRepository.findActiveFlashCompatible({
    locale,
    version,
  });

  if (accessibilityAdjustmentNeeded) {
    challenges = challenges.filter((challenge) => challenge.isAccessible);
  }

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
