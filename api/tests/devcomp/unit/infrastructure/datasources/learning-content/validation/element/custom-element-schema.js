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
  speed: Joi.number().default(20).min(0).optional(),
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

const licenseSchema = Joi.object({
  name: Joi.string().allow('').required(),
  attribution: Joi.string().allow('').required(),
  url: Joi.string().allow('').required(),
});

const slideImageSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').required(),
  displayWidth: Joi.number().min(0).optional(),
  image: Joi.object({
    src: Joi.string().required(),
    alt: Joi.string().required(),
  }).required(),
  license: licenseSchema.optional(),
});

const slideTextSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').required(),
  text: Joi.string().required(),
});

const slideImageTextSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').required(),
  displayHeight: Joi.number().min(0).optional(),
  text: Joi.string().required(),
  image: Joi.object({
    src: Joi.string().required(),
    alt: Joi.string().required(),
  }).required(),
});

const commonFields = {
  aspectRatio: Joi.number().min(0).required(),
  randomSlides: Joi.boolean().required(),
  titleLevel: Joi.number().integer().min(0).max(6).optional(),
  disableAnimation: Joi.boolean().required(),
};

const pixCarouselPropsSchema = Joi.object({
  type: Joi.string().valid('image', 'image-text', 'text').required(),
  slides: Joi.alternatives()
    .conditional('type', {
      switch: [
        { is: 'image', then: Joi.array().items(slideImageSchema) },
        { is: 'image-text', then: Joi.array().items(slideImageTextSchema) },
        { is: 'text', then: Joi.array().items(slideTextSchema) },
      ],
    })
    .required(),
  ...commonFields,
})
  .meta({ title: 'pix-carousel' })
  .required();

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
      'pix-carousel',
      'qcu-image',
    )
    .required(),
  props: Joi.alternatives()
    .conditional('tagName', {
      switch: [
        { is: 'image-quiz', then: imageQuizPropsSchema },
        { is: 'image-quizzes', then: imageQuizzesPropsSchema },
        { is: 'llm-compare-messages', then: llmCompareMessagesPropsSchema },
        { is: 'llm-prompt-select', then: llmPromptSelectPropsSchema },
        { is: 'message-conversation', then: messageConversationPropsSchema },
        { is: 'pix-carousel', then: pixCarouselPropsSchema },
        { is: 'qcu-image', then: imageQuizPropsSchema },
      ],
      otherwise: Joi.object().required(),
    })
    .required(),
}).required();

export { customElementSchema };
