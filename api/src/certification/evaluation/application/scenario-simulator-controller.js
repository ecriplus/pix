import { Readable } from 'node:stream';

import { random } from '../../../shared/infrastructure/utils/random.js';
import { DEFAULT_PROBABILITY_TO_PICK_CHALLENGE } from '../../shared/domain/constants.js';
import { pickAnswerStatusService } from '../../shared/domain/services/pick-answer-status-service.js';
import pickChallengeService from '../domain/services/pick-challenge-service.js';
import { usecases } from '../domain/usecases/index.js';
import { scenarioSimulatorBatchSerializer } from '../infrastructure/serializers/scenario-simulator-batch-serializer.js';

async function simulateFlashAssessmentScenario(
  request,
  h,
  dependencies = {
    scenarioSimulatorBatchSerializer,
    random,
    pickAnswerStatusService,
    pickChallengeService,
  },
) {
  const {
    initialCapacity,
    numberOfIterations = 1,
    challengePickProbability = DEFAULT_PROBABILITY_TO_PICK_CHALLENGE,
    variationPercent,
    capacity,
    accessibilityAdjustmentNeeded,
    locale,
    stopAtChallenge,
    versionId,
  } = request.payload;

  const pickAnswerStatus = dependencies.pickAnswerStatusService.pickAnswerStatusForCapacity(capacity);

  async function* generate() {
    for (let index = 0; index < numberOfIterations; index++) {
      const pickChallenge = dependencies.pickChallengeService.getChallengePicker(challengePickProbability);

      const usecaseParams = {
        pickAnswerStatus,
        pickChallenge,
        locale,
        initialCapacity,
        variationPercent,
        accessibilityAdjustmentNeeded,
        stopAtChallenge,
        versionId,
      };
      Object.keys(usecaseParams).forEach((key) => usecaseParams[key] === undefined && delete usecaseParams[key]);

      const simulationReport = await usecases.simulateFlashAssessmentScenario(usecaseParams);

      yield (
        JSON.stringify({
          index,
          simulationReport: simulationReport.map((answer) => ({
            challengeId: answer.challenge.id,
            minimumCapability: answer.challenge.minimumCapability,
            difficulty: answer.challenge.difficulty,
            discriminant: answer.challenge.discriminant,
            reward: answer.reward,
            errorRate: answer.errorRate,
            answerStatus: answer.answerStatus,
            capacity: answer.capacity,
            numberOfAvailableChallenges: answer.numberOfAvailableChallenges,
          })),
        }) + '\n'
      );
    }
  }

  const generatedResponse = Readable.from(generate(), { objectMode: false });
  return h.response(generatedResponse).type('text/event-stream; charset=utf-8');
}

export const scenarioSimulatorController = { simulateFlashAssessmentScenario };
