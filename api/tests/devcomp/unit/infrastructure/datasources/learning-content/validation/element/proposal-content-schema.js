import Joi from 'joi';

import { htmlNotAllowedSchema, htmlSchema } from '../utils.js';

export const proposalContentSchema = Joi.when(Joi.ref('....hasShortProposals'), {
  is: true,
  then: htmlNotAllowedSchema.required().max(20),
  otherwise: htmlSchema.required(),
});
