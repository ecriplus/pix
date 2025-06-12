import Joi from 'joi';

import { checkLLMChatIsEnabled } from '../../../llm/application/pre-handlers/index.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { assessmentAuthorization } from '../pre-handlers/assessment-authorization.js';
import { assessmentController } from './assessment-controller.js';

const register = async function (server) {
  const routes = [
    {
      method: 'PATCH',
      path: '/api/assessments/{id}/complete-assessment',
      config: {
        auth: false,
        pre: [
          {
            method: assessmentAuthorization.verify,
            assign: 'authorizationCheck',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.completeAssessment,
        tags: ['api'],
      },
    },
    {
      method: 'POST',
      path: '/api/assessments/{assessmentId}/embed/llm/chats',
      config: {
        pre: [
          {
            method: checkLLMChatIsEnabled,
          },
        ],
        validate: {
          params: Joi.object({
            assessmentId: identifiersType.assessmentId.required(),
          }).required(),
          payload: Joi.object({
            configId: Joi.string().required(),
          }).required(),
          options: {
            allowUnknown: true,
          },
        },
        handler: assessmentController.startEmbedLlmChat,
        tags: ['api', 'assessments', 'embed', 'llm'],
        notes: [
          "Cette route permet de démarrer une conversation avec un LLM dans le cadre de la réalisation d'un embed LLM lors d'une évaluation",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/assessments/{assessmentId}/embed/llm/chats/{chatId}/messages',
      config: {
        pre: [
          {
            method: checkLLMChatIsEnabled,
          },
        ],
        validate: {
          params: Joi.object({
            assessmentId: identifiersType.assessmentId.required(),
            chatId: Joi.string().required(),
          }).required(),
          payload: Joi.object({
            prompt: Joi.string().required(),
          }).required(),
          options: {
            allowUnknown: true,
          },
        },
        handler: assessmentController.promptToLLMChat,
        tags: ['api', 'assessments', 'embed', 'llm', 'prompt'],
        notes: [
          "Cette route permet de prompt le LLM dans une conversation existante dans le cadre de la réalisation d'un embed LLM lors d'une évaluation",
        ],
      },
    },
  ];
  server.route(routes);
};

const name = 'evaluation-assessments-api';
export { name, register };
