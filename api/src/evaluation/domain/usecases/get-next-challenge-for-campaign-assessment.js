import Debug from 'debug';

import { AssessmentEndedError } from '../../../shared/domain/errors.js';

const debugChallengeLocales = Debug('pix:challenge:locales');

const getNextChallengeForCampaignAssessment = async function ({
  assessment,
  locale,
  challengeRepository,
  answerRepository,
  pickChallengeService,
  algorithmDataFetcherService,
  smartRandomService,
  campaignRepository,
  knowledgeElementRepository,
  campaignParticipationRepository,
  improvementService,
}) {
  const { allAnswers, lastAnswer, targetSkills, challenges, knowledgeElements } =
    await algorithmDataFetcherService.fetchForCampaigns({
      assessment,
      locale,
      answerRepository,
      campaignRepository,
      challengeRepository,
      knowledgeElementRepository,
      campaignParticipationRepository,
      improvementService,
    });

  debugChallengeLocales(
    'wanted locale "%s", proposed challenges with locales: %O',
    locale,
    (challenges || []).map((challenge) => {
      return {
        challengeId: challenge.id,
        challengeLocales: challenge.locales,
      };
    }),
  );

  const algoResult = smartRandomService.getPossibleSkillsForNextChallenge({
    knowledgeElements,
    challenges,
    targetSkills,
    lastAnswer,
    allAnswers,
    locale,
  });

  if (algoResult.hasAssessmentEnded) {
    throw new AssessmentEndedError();
  }

  return pickChallengeService.pickChallenge({
    skills: algoResult.possibleSkillsForNextChallenge,
    randomSeed: assessment.id,
    locale,
  });
};

export { getNextChallengeForCampaignAssessment };
