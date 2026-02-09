import Joi from 'joi';

import { htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';
import { feedbackSchema } from './feedback-schema.js';
import { proposalContentSchema } from './proposal-content-schema.js';

const qcmElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('qcm').required(),
  instruction: htmlSchema.required(),
  proposals: Joi.array()
    .items({
      id: proposalIdSchema,
      content: proposalContentSchema,
    })
    .min(3)
    .required(),
  feedbacks: Joi.object({
    valid: feedbackSchema,
    invalid: feedbackSchema,
  }).required(),
  solutions: Joi.array().items(proposalIdSchema).min(2).required(),
  hasShortProposals: Joi.boolean().optional().default(false),
}).required();

export { qcmElementSchema };
