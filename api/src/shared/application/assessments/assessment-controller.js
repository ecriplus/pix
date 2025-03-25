/**
 * @typedef {import('../../infrastructure/repositories/index.js').CertificationEvaluationRepository} CertificationEvaluationRepository
 */
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

import { usecases } from '../../../../lib/domain/usecases/index.js';
import * as certificationVersionRepository from '../../../certification/results/infrastructure/repositories/certification-version-repository.js';
import { usecases as certificationUsecases } from '../../../certification/session-management/domain/usecases/index.js';
import { usecases as devcompUsecases } from '../../../devcomp/domain/usecases/index.js';
import { Answer } from '../../../evaluation/domain/models/Answer.js';
import { evaluationUsecases } from '../../../evaluation/domain/usecases/index.js';
import * as competenceEvaluationSerializer from '../../../evaluation/infrastructure/serializers/jsonapi/competence-evaluation-serializer.js';
import { usecases as questUsecases } from '../../../quest/domain/usecases/index.js';
import { config } from '../../config.js';
import { DomainTransaction } from '../../domain/DomainTransaction.js';
import { AssessmentEndedError } from '../../domain/errors.js';
import { sharedUsecases } from '../../domain/usecases/index.js';
import * as assessmentRepository from '../../infrastructure/repositories/assessment-repository.js';
import { repositories } from '../../infrastructure/repositories/index.js';
import * as assessmentSerializer from '../../infrastructure/serializers/jsonapi/assessment-serializer.js';
import * as challengeSerializer from '../../infrastructure/serializers/jsonapi/challenge-serializer.js';
import {
  extractLocaleFromRequest,
  extractUserIdFromRequest,
} from '../../infrastructure/utils/request-response-utils.js';

const save = async function (request, h, dependencies = { assessmentRepository }) {
  const assessment = assessmentSerializer.deserialize(request.payload);
  assessment.userId = extractUserIdFromRequest(request);
  assessment.state = 'started';
  const createdAssessment = await dependencies.assessmentRepository.save({ assessment });
  return h.response(assessmentSerializer.serialize(createdAssessment)).created();
};

const createAssessmentPreviewForPix1d = async function (request, h, dependencies = { assessmentSerializer }) {
  const createdAssessment = await usecases.createPreviewAssessment({});
  return h.response(dependencies.assessmentSerializer.serialize(createdAssessment)).created();
};

const get = async function (request, _, dependencies = { assessmentSerializer }) {
  const assessmentId = request.params.id;
  const locale = extractLocaleFromRequest(request);

  const assessment = await usecases.getAssessment({ assessmentId, locale });

  return dependencies.assessmentSerializer.serialize(assessment);
};

const getLastChallengeId = async function (request, h) {
  const assessmentId = request.params.id;

  const lastChallengeId = await usecases.getLastChallengeIdFromAssessmentId({ assessmentId });

  return h.response(lastChallengeId).code(200);
};

const getNextChallenge = async function (
  request,
  h,
  dependencies = {
    usecases,
    evaluationUsecases,
    assessmentRepository,
    certificationVersionRepository,
    repositories,
  },
) {
  const assessmentId = request.params.id;

  try {
    const challenge = await _getChallenge(assessmentId, request, dependencies);
    return challengeSerializer.serialize(challenge);
  } catch (error) {
    if (error instanceof AssessmentEndedError) {
      const object = new JSONAPISerializer('', {});
      return object.serialize(null);
    }
    throw error;
  }
};

const completeAssessment = async function (request) {
  const assessmentId = request.params.id;
  const locale = extractLocaleFromRequest(request);

  await DomainTransaction.execute(async () => {
    const assessment = await usecases.completeAssessment({ assessmentId, locale });
    await evaluationUsecases.handleBadgeAcquisition({ assessment });
    await evaluationUsecases.handleStageAcquisition({ assessment });
    if (assessment.userId && config.featureToggles.isQuestEnabled) {
      await questUsecases.rewardUser({ userId: assessment.userId });
    }

    await devcompUsecases.handleTrainingRecommendation({ assessment, locale });
  });

  return null;
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

  const competenceEvaluations = await usecases.findCompetenceEvaluationsByAssessment({ userId, assessmentId });

  return competenceEvaluationSerializer.serialize(competenceEvaluations);
};

const autoValidateNextChallenge = async function (request, h) {
  const assessmentId = request.params.id;
  const locale = extractLocaleFromRequest(request);
  const assessment = await usecases.getAssessment({ assessmentId, locale });
  const userId = assessment.userId;
  const fakeAnswer = new Answer({
    assessmentId,
    challengeId: assessment.lastChallengeId,
    value: 'FAKE_ANSWER_WITH_AUTO_VALIDATE_NEXT_CHALLENGE',
  });
  if (assessment.isCompetenceEvaluation()) {
    await evaluationUsecases.saveAndCorrectAnswerForCompetenceEvaluation({
      answer: fakeAnswer,
      assessment,
      userId,
      locale,
      forceOKAnswer: true,
    });
  } else if (assessment.isForCampaign()) {
    await evaluationUsecases.saveAndCorrectAnswerForCampaign({
      answer: fakeAnswer,
      assessment,
      userId,
      locale,
      forceOKAnswer: true,
    });
  } else if (assessment.isCertification()) {
    await evaluationUsecases.saveAndCorrectAnswerForCertification({
      answer: fakeAnswer,
      assessment,
      userId,
      locale,
      forceOKAnswer: true,
    });
  } else {
    await evaluationUsecases.saveAndCorrectAnswerForDemoAndPreview({
      answer: fakeAnswer,
      assessment,
      userId,
      locale,
      forceOKAnswer: true,
    });
  }
  return h.response().code(204);
};

const createCertificationChallengeLiveAlert = async function (request, h) {
  const assessmentId = request.params.id;
  const challengeId = request.payload?.data?.attributes?.['challenge-id'];
  await certificationUsecases.createCertificationChallengeLiveAlert({ assessmentId, challengeId });
  return h.response().code(204);
};

const assessmentController = {
  save,
  get,
  getLastChallengeId,
  getNextChallenge,
  completeAssessment,
  updateLastChallengeState,
  findCompetenceEvaluations,
  autoValidateNextChallenge,
  createAssessmentPreviewForPix1d,
  createCertificationChallengeLiveAlert,
};

export { assessmentController };

/**
 * @param {Object} dependencies
 * @param {Object} dependencies.repositories
 * @param {CertificationEvaluationRepository} dependencies.repositories.certificationEvaluationRepository
 * @param {AssessmentRepository} dependencies.assessmentRepository
 */
async function _getChallenge(assessmentId, request, dependencies) {
  const assessment = await dependencies.assessmentRepository.get(assessmentId);

  if (assessment.isStarted() && !assessment.isCertification()) {
    await dependencies.assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });
  }
  const challenge = await _getChallengeByAssessmentType({ assessment, request, dependencies });

  if (!assessment.isCertification() && challenge) {
    if (challenge.id !== assessment.lastChallengeId) {
      await dependencies.assessmentRepository.updateWhenNewChallengeIsAsked({
        id: assessment.id,
        lastChallengeId: challenge.id,
      });
    }
  }

  return challenge;
}

async function _getChallengeByAssessmentType({ assessment, request, dependencies }) {
  const locale = extractLocaleFromRequest(request);

  if (assessment.isCertification()) {
    return dependencies.repositories.certificationEvaluationRepository.selectNextCertificationChallenge({
      assessmentId: assessment.id,
      locale,
    });
  }

  if (assessment.isPreview()) {
    return dependencies.evaluationUsecases.getNextChallengeForPreview({});
  }

  if (assessment.isDemo()) {
    return dependencies.evaluationUsecases.getNextChallengeForDemo({ assessment });
  }

  if (assessment.isForCampaign()) {
    return dependencies.evaluationUsecases.getNextChallengeForCampaignAssessment({ assessment, locale });
  }

  if (assessment.isCompetenceEvaluation()) {
    const userId = extractUserIdFromRequest(request);
    return dependencies.usecases.getNextChallengeForCompetenceEvaluation({ assessment, userId, locale });
  }

  return null;
}
