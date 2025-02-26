import { AnswerJob } from '../../../quest/domain/models/AnwserJob.js';
import { ForbiddenAccess } from '../../../shared/domain/errors.js';
import { ChallengeNotAskedError } from '../../../shared/domain/errors.js';
import { KnowledgeElement } from '../../../shared/domain/models/index.js';
import { EmptyAnswerError } from '../errors.js';

export async function saveAndCorrectAnswerForCampaign({
  answer,
  userId,
  assessment,
  locale,
  forceOKAnswer = false,
  answerRepository,
  answerJobRepository,
  areaRepository,
  challengeRepository,
  scorecardService,
  competenceRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  correctionService,
  flashAlgorithmService,
  algorithmDataFetcherService,
  flashAssessmentResultRepository,
  campaignRepository,
} = {}) {
  if (assessment.userId !== userId) {
    throw new ForbiddenAccess('User is not allowed to add an answer for this assessment.');
  }
  if (assessment.lastChallengeId && assessment.lastChallengeId !== answer.challengeId) {
    throw new ChallengeNotAskedError();
  }
  if (!answer.hasValue && !answer.hasTimedOut) {
    throw new EmptyAnswerError();
  }

  const challenge = await challengeRepository.get(answer.challengeId);
  const correctedAnswer = correctionService.evaluateAnswer({
    challenge,
    answer,
    assessment,
    accessibilityAdjustmentNeeded: false,
    forceOKAnswer,
  });
  const now = new Date();
  const lastQuestionDate = assessment.lastQuestionDate || now;
  correctedAnswer.setTimeSpentFrom({ now, lastQuestionDate });

  let knowledgeElements = [];
  let answerSaved;
  if (assessment.isSmartRandom()) {
    let scorecardBeforeAnswer = null;
    if (correctedAnswer.result.isOK()) {
      scorecardBeforeAnswer = await scorecardService.computeScorecard({
        userId,
        competenceId: challenge.competenceId,
        areaRepository,
        competenceRepository,
        competenceEvaluationRepository,
        knowledgeElementRepository,
        locale,
      });
    }

    const targetSkills = await campaignRepository.findSkillsByCampaignParticipationId({
      campaignParticipationId: assessment.campaignParticipationId,
    });
    knowledgeElements = await computeKnowledgeElements({
      assessment,
      answer: correctedAnswer,
      challenge,
      targetSkills,
      knowledgeElementRepository,
    });

    answerSaved = await answerRepository.saveWithKnowledgeElements(correctedAnswer, knowledgeElements);
    answerSaved.levelup = await computeLevelUpInformation({
      answerSaved,
      scorecardService,
      userId,
      competenceId: challenge.competenceId,
      areaRepository,
      competenceRepository,
      competenceEvaluationRepository,
      knowledgeElementRepository,
      scorecardBeforeAnswer,
      locale,
    });
  } else if (assessment.isFlash()) {
    answerSaved = await answerRepository.saveWithKnowledgeElements(correctedAnswer, knowledgeElements);
    answerSaved.levelup = {};
    const flashData = await algorithmDataFetcherService.fetchForFlashLevelEstimation({
      assessment,
      answerRepository,
      challengeRepository,
      locale,
    });

    const { capacity, errorRate } = flashAlgorithmService.getCapacityAndErrorRate(flashData);

    await flashAssessmentResultRepository.save({
      answerId: answerSaved.id,
      capacity,
      errorRate,
      assessmentId: assessment.id,
    });
  }

  if (userId) {
    await answerJobRepository.performAsync(new AnswerJob({ userId }));
  }

  return answerSaved;
}

async function computeKnowledgeElements({ assessment, answer, challenge, targetSkills, knowledgeElementRepository }) {
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserIdAndAssessmentId({
    userId: assessment.userId,
    assessmentId: assessment.id,
  });
  return KnowledgeElement.createKnowledgeElementsForAnswer({
    answer,
    challenge,
    previouslyFailedSkills: getSkillsFilteredByStatus(
      knowledgeElements,
      targetSkills,
      KnowledgeElement.StatusType.INVALIDATED,
    ),
    previouslyValidatedSkills: getSkillsFilteredByStatus(
      knowledgeElements,
      targetSkills,
      KnowledgeElement.StatusType.VALIDATED,
    ),
    targetSkills,
    userId: assessment.userId,
  });
}

function getSkillsFilteredByStatus(knowledgeElements, targetSkills, status) {
  return knowledgeElements
    .filter((knowledgeElement) => knowledgeElement.status === status)
    .map((knowledgeElement) => knowledgeElement.skillId)
    .map((skillId) => targetSkills.find((skill) => skill.id === skillId));
}

async function computeLevelUpInformation({
  answerSaved,
  scorecardService,
  userId,
  competenceId,
  competenceRepository,
  areaRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  scorecardBeforeAnswer,
  locale,
}) {
  if (!scorecardBeforeAnswer) {
    return {};
  }

  const scorecardAfterAnswer = await scorecardService.computeScorecard({
    userId,
    competenceId,
    competenceRepository,
    areaRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    locale,
  });

  if (scorecardBeforeAnswer.level < scorecardAfterAnswer.level) {
    return {
      id: answerSaved.id,
      competenceName: scorecardAfterAnswer.name,
      level: scorecardAfterAnswer.level,
    };
  }
  return {};
}
