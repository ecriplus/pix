import Joi from 'joi';

import { htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';
import { feedbackSchema } from './feedback-schema.js';

const qcuDeclarativeElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('qcu-declarative').required(),
  instruction: htmlSchema.required(),
  proposals: Joi.array()
    .items({
      id: proposalIdSchema.required(),
      content: htmlSchema.required(),
      feedback: feedbackSchema.required(),
    })
    .required(),
});

export { qcuDeclarativeElementSchema };
