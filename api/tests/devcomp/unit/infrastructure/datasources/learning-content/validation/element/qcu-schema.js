import Joi from 'joi';

import { htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';
import { feedbackSchema } from './feedback-schema.js';
import { proposalContentSchema, shortProposalContentSchema } from './proposal-content-schema.js';

const qcuElementSchema = Joi.alternatives().conditional(Joi.object({ hasShortProposals: true }).unknown(), {
  then: Joi.object({
    id: uuidSchema,
    type: Joi.string().valid('qcu').required(),
    instruction: htmlSchema.required(),
    hasShortProposals: Joi.boolean().optional().default(false).required(),
    proposals: Joi.array()
      .items({
        id: proposalIdSchema.required(),
        content: shortProposalContentSchema.required(),
        feedback: feedbackSchema.required(),
      })
      .required(),
    solution: proposalIdSchema.required(),
  }),
  otherwise: Joi.object({
    id: uuidSchema,
    type: Joi.string().valid('qcu').required(),
    instruction: htmlSchema.required(),
    hasShortProposals: Joi.boolean().required().default(false).required(),
    proposals: Joi.array()
      .items({
        id: proposalIdSchema.required(),
        content: proposalContentSchema.required(),
        feedback: feedbackSchema.required(),
      })
      .required(),
    solution: proposalIdSchema.required(),
  }),
});

export { qcuElementSchema };
