import { usecases as devcompUsecases } from '../../../devcomp/domain/usecases/index.js';
import { usecases as questUsecases } from '../../../quest/domain/usecases/index.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { featureToggles } from '../../../shared/infrastructure/feature-toggles/index.js';
import * as llmChatSerializer from '../../../shared/infrastructure/serializers/llm-chat-serializer.js';
import { extractLocaleFromRequest } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { evaluationUsecases } from '../../domain/usecases/index.js';

const completeAssessment = async function (request) {
  const assessmentId = request.params.id;
  const locale = extractLocaleFromRequest(request);

  await DomainTransaction.execute(async () => {
    const assessment = await evaluationUsecases.completeAssessment({ assessmentId, locale });
    await evaluationUsecases.handleBadgeAcquisition({ assessment });
    await evaluationUsecases.handleStageAcquisition({ assessment });
    if (assessment.userId && (await featureToggles.get('isQuestEnabled'))) {
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
  return h.response(llmChatSerializer.serialize(startedChatDTO)).code(201);
};

const promptToLLMChat = async function (request, h, { usecases } = { usecases: evaluationUsecases }) {
  const { assessmentId, chatId } = request.params;
  const { prompt, attachmentName } = request.payload;
  const userId = request.auth.credentials.userId;
  const llmResponse = await usecases.promptToLLMChat({ assessmentId, chatId, userId, prompt, attachmentName });
  return h.response(llmResponse).type('text/event-stream').code(201);
};

const assessmentController = {
  completeAssessment,
  promptToLLMChat,
  startEmbedLlmChat,
};

export { assessmentController };
