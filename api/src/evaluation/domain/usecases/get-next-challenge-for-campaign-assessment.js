import { FlashAssessmentAlgorithm } from '../../../certification/flash-certification/domain/models/FlashAssessmentAlgorithm.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../../certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { AssessmentEndedError } from '../../../shared/domain/errors.js';

const getNextChallengeForCampaignAssessment = async function ({
  assessment,
  locale,
  challengeRepository,
  answerRepository,
  flashAlgorithmConfigurationRepository,
  flashAssessmentResultRepository,
  pickChallengeService,
  algorithmDataFetcherService,
  smartRandomService,
  flashAlgorithmService,
}) {
  let algoResult;

  if (assessment.isFlash()) {
    const { allAnswers, challenges } = await algorithmDataFetcherService.fetchForFlashCampaigns({
      assessmentId: assessment.id,
      answerRepository,
      challengeRepository,
      flashAssessmentResultRepository,
      locale,
    });

    const configuration =
      (await flashAlgorithmConfigurationRepository.getMostRecent()) ?? _createDefaultAlgorithmConfiguration();

    const assessmentAlgorithm = new FlashAssessmentAlgorithm({
      flashAlgorithmImplementation: flashAlgorithmService,
      configuration,
    });

    const possibleChallenges = assessmentAlgorithm.getPossibleNextChallenges({
      assessmentAnswers: allAnswers,
      challenges,
    });

    if (_hasAnsweredToAllChallenges({ possibleChallenges })) {
      throw new AssessmentEndedError();
    }

    return pickChallengeService.chooseNextChallenge(assessment.id)({ possibleChallenges });
  } else {
    const inputValues = await algorithmDataFetcherService.fetchForCampaigns(...arguments);
    algoResult = smartRandomService.getPossibleSkillsForNextChallenge({ ...inputValues, locale });

    if (algoResult.hasAssessmentEnded) {
      throw new AssessmentEndedError();
    }

    return pickChallengeService.pickChallenge({
      skills: algoResult.possibleSkillsForNextChallenge,
      randomSeed: assessment.id,
      locale,
    });
  }
};

const _hasAnsweredToAllChallenges = ({ possibleChallenges }) => {
  return possibleChallenges.length === 0;
};

const _createDefaultAlgorithmConfiguration = () => {
  return new FlashAssessmentAlgorithmConfiguration({
    limitToOneQuestionPerTube: false,
    enablePassageByAllCompetences: false,
  });
};

export { getNextChallengeForCampaignAssessment };
