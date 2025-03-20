import Joi from 'joi';

import { htmlSchema, proposalIdSchema, uuidSchema } from '../utils.js';

const qcuElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('qcu').required(),
  instruction: htmlSchema.required(),
  proposals: Joi.array()
    .items({
      id: proposalIdSchema.required(),
      content: htmlSchema.required(),
      feedback: htmlSchema.required(),
    })
    .required(),
  solution: proposalIdSchema.required(),
});

export { qcuElementSchema };
