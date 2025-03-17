import _ from 'lodash';

import { Assessment } from '../../../../shared/domain/models/Assessment.js';

async function fetchForCampaigns({
  assessment,
  answerRepository,
  campaignRepository,
  challengeRepository,
  knowledgeElementRepository,
  campaignParticipationRepository,
  improvementService,
  locale,
}) {
  const campaignSkills = await campaignRepository.findSkillsByCampaignParticipationId({
    campaignParticipationId: assessment.campaignParticipationId,
  });
  const isRetrying = await campaignParticipationRepository.isRetrying({
    campaignParticipationId: assessment.campaignParticipationId,
  });

  const [allAnswers, knowledgeElements, [skills, challenges]] = await Promise.all([
    answerRepository.findByAssessment(assessment.id),
    _fetchKnowledgeElements({
      assessment,
      isRetrying,
      campaignParticipationRepository,
      knowledgeElementRepository,
      improvementService,
    }),
    _fetchSkillsAndChallenges({ campaignSkills, challengeRepository, locale }),
  ]);

  return {
    allAnswers,
    lastAnswer: _.isEmpty(allAnswers) ? null : _.last(allAnswers),
    targetSkills: skills,
    challenges,
    knowledgeElements,
  };
}

async function _fetchKnowledgeElements({
  assessment,
  isRetrying = false,
  knowledgeElementRepository,
  improvementService,
}) {
  let knowledgeElements;
  if (assessment.type === Assessment.types.CAMPAIGN) {
    knowledgeElements = await knowledgeElementRepository.findUniqByUserIdForCampaignParticipation({
      userId: assessment.userId,
      campaignParticipationId: assessment.campaignParticipationId,
    });
  } else {
    knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId: assessment.userId });
  }
  return improvementService.filterKnowledgeElementsIfImproving({ knowledgeElements, assessment, isRetrying });
}

async function _fetchSkillsAndChallenges({ campaignSkills, challengeRepository, locale }) {
  const challenges = await challengeRepository.findOperativeBySkills(campaignSkills, locale);
  return [campaignSkills, challenges];
}

async function fetchForCompetenceEvaluations({
  assessment,
  answerRepository,
  challengeRepository,
  knowledgeElementRepository,
  skillRepository,
  improvementService,
  locale,
}) {
  const [allAnswers, targetSkills, challenges, knowledgeElements] = await Promise.all([
    answerRepository.findByAssessment(assessment.id),
    skillRepository.findActiveByCompetenceId(assessment.competenceId),
    challengeRepository.findValidatedByCompetenceId(assessment.competenceId, locale),
    _fetchKnowledgeElements({ assessment, knowledgeElementRepository, improvementService }),
  ]);

  return {
    allAnswers,
    lastAnswer: _.isEmpty(allAnswers) ? null : _.last(allAnswers),
    targetSkills,
    challenges,
    knowledgeElements,
  };
}

export { fetchForCampaigns, fetchForCompetenceEvaluations };
