import { usecases as devcompUsecases } from '../../../devcomp/domain/usecases/index.js';
import { usecases as questUsecases } from '../../../quest/domain/usecases/index.js';
import { config } from '../../../shared/config.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { extractLocaleFromRequest } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { evaluationUsecases } from '../../domain/usecases/index.js';

const completeAssessment = async function (request) {
  const assessmentId = request.params.id;
  const locale = extractLocaleFromRequest(request);

  await DomainTransaction.execute(async () => {
    const assessment = await evaluationUsecases.completeAssessment({ assessmentId, locale });
    await evaluationUsecases.handleBadgeAcquisition({ assessment });
    await evaluationUsecases.handleStageAcquisition({ assessment });
    if (assessment.userId && config.featureToggles.isQuestEnabled) {
      await questUsecases.rewardUser({ userId: assessment.userId });
    }

    await devcompUsecases.handleTrainingRecommendation({ assessment, locale });
  });

  return null;
};

const startEmbedLlmChat = async function (request, h, { usecases } = { usecases: evaluationUsecases }) {
  const { configId } = request.payload;
  const userId = request.auth.credentials.userId;
  const assessmentId = request.params.assessmentId;
  const startedChatDTO = await usecases.startEmbedLlmChat({ configId, userId, assessmentId });
  return h
    .response({
      inputMaxChars: startedChatDTO.inputMaxChars,
      inputMaxPrompts: startedChatDTO.inputMaxPrompts,
      chatId: startedChatDTO.id,
    })
    .code(201);
};

const assessmentController = {
  completeAssessment,
  startEmbedLlmChat,
};

export { assessmentController };
