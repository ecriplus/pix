/**
 * @typedef {import('../../infrastructure/repositories/index.js').CertificationEvaluationRepository} CertificationEvaluationRepository
 */
import { evaluationUsecases } from '../../../evaluation/domain/usecases/index.js';
import * as competenceEvaluationSerializer from '../../../evaluation/infrastructure/serializers/jsonapi/competence-evaluation-serializer.js';
import { DomainTransaction } from '../../domain/DomainTransaction.js';
import { sharedUsecases } from '../../domain/usecases/index.js';
import * as assessmentSerializer from '../../infrastructure/serializers/jsonapi/assessment-serializer.js';
import { extractUserIdFromRequest, getChallengeLocale } from '../../infrastructure/utils/request-response-utils.js';

const getAssessmentWithNextChallenge = async function (
  request,
  h,
  dependencies = { assessmentSerializer, extractUserIdFromRequest },
) {
  const assessmentId = request.params.id;
  const locale = getChallengeLocale(request);
  const userId = dependencies.extractUserIdFromRequest(request);

  const { assessment, globalProgression } = await sharedUsecases.updateAssessmentWithNextChallenge({
    assessmentId,
    userId,
    locale,
  });

  return dependencies.assessmentSerializer.serialize(assessment.toDto(globalProgression));
};

const updateLastChallengeState = async function (request) {
  const assessmentId = request.params.id;
  const lastQuestionState = request.params.state;
  const challengeId = request.payload?.data?.attributes?.['challenge-id'];

  await DomainTransaction.execute(async () => {
    await sharedUsecases.updateLastQuestionState({ assessmentId, challengeId, lastQuestionState });
  });

  return null;
};

const findCompetenceEvaluations = async function (request) {
  const userId = request.auth.credentials.userId;
  const assessmentId = request.params.id;

  const competenceEvaluations = await evaluationUsecases.findCompetenceEvaluationsByAssessment({
    userId,
    assessmentId,
  });

  return competenceEvaluationSerializer.serialize(competenceEvaluations);
};

const assessmentController = {
  getAssessmentWithNextChallenge,
  updateLastChallengeState,
  findCompetenceEvaluations,
};

export { assessmentController };
