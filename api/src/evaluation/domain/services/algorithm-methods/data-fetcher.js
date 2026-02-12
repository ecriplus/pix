import _ from 'lodash';

import { Assessment } from '../../../../shared/domain/models/Assessment.js';

async function fetchForCampaigns({
  assessment,
  answerRepository,
  campaignRepository,
  challengeRepository,
  knowledgeElementForParticipationService,
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

  const allAnswers = await answerRepository.findByAssessment(assessment.id);
  const knowledgeElements = await _fetchKnowledgeElements({
    assessment,
    isRetrying,
    isFromCampaign: true,
    isImproving: true,
    campaignParticipationRepository,
    knowledgeElementForParticipationService,
    knowledgeElementRepository,
    improvementService,
  });
  const [skills, challenges] = await _fetchSkillsAndChallenges({
    campaignSkills,
    challengeRepository,
    locale,
  });

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
  isFromCampaign = false,
  isImproving = false,
  knowledgeElementForParticipationService,
  knowledgeElementRepository,
  improvementService,
}) {
  let knowledgeElements;
  if (assessment.type === Assessment.types.CAMPAIGN) {
    knowledgeElements = await knowledgeElementForParticipationService.findUniqByUserOrCampaignParticipationId({
      userId: assessment.userId,
      campaignParticipationId: assessment.campaignParticipationId,
    });
  } else {
    knowledgeElements = await knowledgeElementRepository.findUniqByUserId({
      userId: assessment.userId,
    });
  }

  return improvementService.filterKnowledgeElements({
    knowledgeElements,
    isFromCampaign,
    isRetrying,
    isImproving: isImproving || assessment.isImproving,
    createdAt: assessment.createdAt,
  });
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
  const allAnswers = await answerRepository.findByAssessment(assessment.id);
  const targetSkills = await skillRepository.findActiveByCompetenceId(assessment.competenceId);
  const challenges = await challengeRepository.findValidatedByCompetenceId(assessment.competenceId, locale);
  const knowledgeElements = await _fetchKnowledgeElements({
    assessment,
    knowledgeElementRepository,
    improvementService,
  });

  return {
    allAnswers,
    lastAnswer: _.isEmpty(allAnswers) ? null : _.last(allAnswers),
    targetSkills,
    challenges,
    knowledgeElements,
  };
}

export { fetchForCampaigns, fetchForCompetenceEvaluations };
