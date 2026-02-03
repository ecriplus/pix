import Joi from 'joi';

import { htmlNotAllowedSchema, htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';
import { feedbackSchema } from './feedback-schema.js';

const qcuElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('qcu').required(),
  instruction: htmlSchema.required(),
  proposals: Joi.array()
    .items({
      id: proposalIdSchema.required(),
      content: Joi.when(Joi.ref('....hasShortProposals'), {
        is: true,
        then: htmlNotAllowedSchema.required().max(20),
        otherwise: htmlSchema.required(),
      }),
      feedback: feedbackSchema.required(),
    })
    .required(),
  solution: proposalIdSchema.required(),
  hasShortProposals: Joi.boolean().required().default(false),
});

export { qcuElementSchema };
