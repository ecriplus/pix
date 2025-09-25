import { usecases as questUsecases } from '../../../quest/domain/usecases/index.js';
import { featureToggles } from '../../../shared/infrastructure/feature-toggles/index.js';
import * as assessmentRepository from '../../../shared/infrastructure/repositories/assessment-repository.js';
import {
  extractUserIdFromRequest,
  getChallengeLocale,
} from '../../../shared/infrastructure/utils/request-response-utils.js';
import { evaluationUsecases } from '../../domain/usecases/index.js';
import * as answerSerializer from '../../infrastructure/serializers/jsonapi/answer-serializer.js';
import * as correctionSerializer from '../../infrastructure/serializers/jsonapi/correction-serializer.js';

const save = async function (request, h, dependencies = { answerSerializer, assessmentRepository }) {
  const answer = dependencies.answerSerializer.deserialize(request.payload);
  const userId = extractUserIdFromRequest(request);
  const locale = getChallengeLocale(request);
  const assessment = await dependencies.assessmentRepository.getWithAnswers(answer.assessmentId);
  let correctedAnswer;
  if (assessment.isCompetenceEvaluation()) {
    correctedAnswer = await evaluationUsecases.saveAndCorrectAnswerForCompetenceEvaluation({
      answer,
      assessment,
      userId,
      locale,
    });
  } else if (assessment.isForCampaign()) {
    correctedAnswer = await evaluationUsecases.saveAndCorrectAnswerForCampaign({ answer, assessment, userId, locale });
  } else if (assessment.isCertification()) {
    correctedAnswer = await evaluationUsecases.saveAndCorrectAnswerForCertification({
      answer,
      assessment,
      userId,
      locale,
    });
  } else {
    correctedAnswer = await evaluationUsecases.saveAndCorrectAnswerForDemoAndPreview({
      answer,
      assessment,
      userId,
      locale,
    });
  }
  if (
    userId &&
    !(await featureToggles.get('isAsyncQuestRewardingCalculationEnabled')) &&
    (await featureToggles.get('isQuestEnabled'))
  ) {
    await questUsecases.rewardUser({ userId });
  }

  return h.response(dependencies.answerSerializer.serialize(correctedAnswer)).created();
};

const get = async function (request) {
  const userId = extractUserIdFromRequest(request);
  const answerId = request.params.id;
  const answer = await evaluationUsecases.getAnswer({ answerId, userId });

  return answerSerializer.serialize(answer);
};

const update = async function (request) {
  const userId = extractUserIdFromRequest(request);
  const answerId = request.params.id;
  const answer = await evaluationUsecases.getAnswer({ answerId, userId });

  return answerSerializer.serialize(answer);
};

const find = async function (request) {
  const userId = extractUserIdFromRequest(request);
  const challengeId = request.query.challengeId;
  const assessmentId = request.query.assessmentId;
  let answers = [];
  if (challengeId && assessmentId) {
    answers = await evaluationUsecases.findAnswerByChallengeAndAssessment({ challengeId, assessmentId, userId });
  }
  if (assessmentId && !challengeId) {
    answers = await evaluationUsecases.findAnswerByAssessment({ assessmentId, userId });
  }

  return answerSerializer.serialize(answers);
};

const getCorrection = async function (request, _h, dependencies = { correctionSerializer }) {
  const userId = extractUserIdFromRequest(request);
  const locale = getChallengeLocale(request);
  const answerId = request.params.id;

  const correction = await evaluationUsecases.getCorrectionForAnswer({
    answerId,
    userId,
    locale,
  });

  return dependencies.correctionSerializer.serialize(correction);
};

const answerController = { save, get, update, find, getCorrection };

export { answerController };
