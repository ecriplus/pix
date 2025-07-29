import Joi from 'joi';

import { htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';
import { feedbackNeutralSchema } from './feedback-neutral-schema.js';

const qcuDeclarativeElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('qcu-declarative').required(),
  instruction: htmlSchema.required(),
  proposals: Joi.array()
    .items({
      id: proposalIdSchema.required(),
      content: htmlSchema.required(),
      feedback: feedbackNeutralSchema.required(),
    })
    .required(),
});

export { qcuDeclarativeElementSchema };
