import Joi from 'joi';

import { uuidSchema } from '../utils.js';

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
  tagName: Joi.string().valid('message-conversation', 'cartes-a-retourner', 'qcu-image').required(),
  props: Joi.alternatives()
    .conditional('tagName', {
      switch: [{ is: 'message-conversation', then: messageConversationPropsSchema }],
      otherwise: Joi.object().required(),
    })
    .required(),
}).required();

export { customElementSchema };
