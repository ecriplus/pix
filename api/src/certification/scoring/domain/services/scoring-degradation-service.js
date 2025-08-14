import { AnswerStatus } from '../../../../shared/domain/models/AnswerStatus.js';
import { AssessmentSimulator } from '../../../evaluation/domain/models/AssessmentSimulator.js';
import { AssessmentSimulatorSingleMeasureStrategy } from '../../../evaluation/domain/models/AssessmentSimulatorSingleMeasureStrategy.js';
import pickChallengeService from '../../../evaluation/domain/services/pick-challenge-service.js';
import { pickAnswerStatusService } from '../../../shared/domain/services/pick-answer-status-service.js';

const PROBABILITY_TO_PICK_THE_MOST_USEFUL_CHALLENGE_FOR_CANDIDATE_EVALUATION = 100;

export const downgradeCapacity = ({
  algorithm,
  capacity,
  allChallenges,
  allAnswers,
  flashAssessmentAlgorithmConfiguration,
}) => {
  const numberOfUnansweredChallenges =
    flashAssessmentAlgorithmConfiguration.maximumAssessmentLength - allAnswers.length;

  const answerStatusArray = Array.from({ length: numberOfUnansweredChallenges }, () => AnswerStatus.SKIPPED);

  const pickAnswerStatus = pickAnswerStatusService.pickAnswerStatusFromArray(answerStatusArray);
  const challengePicker = pickChallengeService.getChallengePicker(
    PROBABILITY_TO_PICK_THE_MOST_USEFUL_CHALLENGE_FOR_CANDIDATE_EVALUATION,
  );

  const singleMeasureStrategy = new AssessmentSimulatorSingleMeasureStrategy({
    algorithm,
    challenges: allChallenges,
    pickChallenge: challengePicker,
    pickAnswerStatus,
    initialCapacity: capacity,
  });

  const simulator = new AssessmentSimulator({
    strategy: singleMeasureStrategy,
  });

  const result = simulator.run({ challengesAnswers: allAnswers });

  return result.at(-1).capacity;
};
