import Joi from 'joi';

import { uuidSchema } from '../utils.js';

const imageQuizPropsSchema = Joi.object({
  name: Joi.string().required(),
  multiple: Joi.boolean().optional(),
  maxChoicesPerLine: Joi.number().optional(),
  hideChoicesName: Joi.boolean().optional(),
  orderChoices: Joi.boolean().optional(),
  imageChoicesSize: Joi.string().valid('icon', 'medium', 'large').optional(),
  choices: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        image: Joi.object({
          src: Joi.string().required(),
        })
          .optional()
          .unknown(true),
        response: Joi.string().optional(),
      }).required(),
    )
    .required(),
}).required();

const imageQuizzesPropsSchema = Joi.object({
  quizzes: Joi.array().items(imageQuizPropsSchema).required(),
}).required();

const llmCompareMessagesConversation = Joi.object({
  title: Joi.string().required(),
  llmName: Joi.string().required(),
}).required();

const llmCompareInboundMessage = Joi.object({
  direction: Joi.string().valid('inbound').required(),
  content: Joi.string().required(),
}).required();

const llmCompareOutboundMessage = Joi.object({
  direction: Joi.string().valid('outbound').required(),
  content: Joi.string().required(),
}).required();

const llmCompareMessagesPropsSchema = Joi.object({
  conversation1: llmCompareMessagesConversation,
  conversation2: llmCompareMessagesConversation,
  userName: Joi.string().required(),
  messages: Joi.array()
    .items(
      Joi.alternatives(llmCompareOutboundMessage, Joi.array().items(llmCompareInboundMessage).min(2).max(2).required()),
    )
    .required(),
}).required();

const llmPromptSelectPropsSchema = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        direction: Joi.string().valid('inbound', 'outbound').required(),
        content: Joi.string().required(),
      }).required(),
    )
    .required(),
  prompts: Joi.array()
    .items(
      Joi.object({
        prompt: Joi.string().required(),
        response: Joi.string().required(),
      }).required(),
    )
    .required(),
}).required();

const messageConversationPropsSchema = Joi.object({
  title: Joi.string().required(),
  messages: Joi.array()
    .items(
      Joi.object({
        userName: Joi.string().required(),
        direction: Joi.string().valid('incoming', 'outgoing').required(),
        content: Joi.string().required(),
      }),
    )
    .required(),
}).required();

const customElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('custom').required(),
  tagName: Joi.string()
    .valid(
      'image-quiz',
      'image-quizzes',
      'llm-compare-messages',
      'llm-prompt-select',
      'message-conversation',
      'qcu-image',
    )
    .required(),
  props: Joi.alternatives()
    .conditional('tagName', {
      switch: [
        { is: 'image-quizz', then: imageQuizPropsSchema },
        { is: 'image-quizzes', then: imageQuizzesPropsSchema },
        { is: 'llm-compare-messages', then: llmCompareMessagesPropsSchema },
        { is: 'llm-prompt-select', then: llmPromptSelectPropsSchema },
        { is: 'message-conversation', then: messageConversationPropsSchema },
        { is: 'qcu-image', then: imageQuizPropsSchema },
      ],
      otherwise: Joi.object().required(),
    })
    .required(),
}).required();

export { customElementSchema };
