import Joi from 'joi';

import { htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';
import { feedbackSchema } from './feedback-schema.js';
import { proposalContentSchema } from './proposal-content-schema.js';

const qcuElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('qcu').required(),
  instruction: htmlSchema.required(),
  proposals: Joi.array()
    .items({
      id: proposalIdSchema.required(),
      content: proposalContentSchema,
      feedback: feedbackSchema.required(),
    })
    .required(),
  solution: proposalIdSchema.required(),
  hasShortProposals: Joi.boolean().optional().default(false),
});

export { qcuElementSchema };
