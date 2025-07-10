import Joi from 'joi';

import { jwtApplicationAuthenticationStrategyName } from '../../shared/infrastructure/authentication-strategy-names.js';
import { llmPreviewController } from './llm-preview-controller.js';
import { checkLLMChatIsEnabled } from './pre-handlers/index.js';

export async function register(server) {
  server.route([
    {
      method: 'POST',
      path: '/api/llm/preview/chats',
      config: {
        auth: {
          strategy: jwtApplicationAuthenticationStrategyName,
          access: { scope: 'llm-preview' },
        },
        pre: [
          {
            method: checkLLMChatIsEnabled,
          },
        ],
        validate: {
          payload: Joi.object({
            configuration: Joi.object({
              llm: Joi.object({
                historySize: Joi.number().required(),
              })
                .required()
                .unknown(true),
              challenge: Joi.object({
                inputMaxChars: Joi.number().required(),
                inputMaxPrompts: Joi.number().required(),
              })
                .required()
                .unknown(true),
              attachment: Joi.object({
                name: Joi.string().optional(),
                context: Joi.string().optional(),
              })
                .optional()
                .unknown(true),
            })
              .required()
              .unknown(true),
          }).required(),
        },
        handler: llmPreviewController.startChat,
        tags: ['api', 'llm', 'preview'],
        notes: [
          'Cette route est restreinte aux applications avec le scope llm-preview',
          'Elle permet de créer une discussion LLM avec la configuration en payload',
        ],
      },
    },
  ]);
}

export const name = 'llm-preview-api';
