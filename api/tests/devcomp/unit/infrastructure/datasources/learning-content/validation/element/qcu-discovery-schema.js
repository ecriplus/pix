import Joi from 'joi';

import { htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';
import { feedbackNeutralSchema } from './feedback-neutral-schema.js';

const qcuDiscoveryElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('qcu-discovery').required(),
  instruction: htmlSchema.required(),
  proposals: Joi.array()
    .items({
      id: proposalIdSchema.required(),
      content: htmlSchema.required(),
      feedback: feedbackNeutralSchema.required(),
    })
    .required(),
  solution: proposalIdSchema.required(),
});

export { qcuDiscoveryElementSchema };
