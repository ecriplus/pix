import Joi from 'joi';

import { uuidSchema } from '../utils.js';

const customElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('custom').required(),
  tagName: Joi.string().required(),
  props: Joi.object().required(),
}).required();

export { customElementSchema };
