import { schema as componentsSchema } from '@1024pix/epreuves-components/schema';
import Joi from 'joi';

import { htmlSchema, uuidSchema } from '../utils.js';

export const customElementSchema = Joi.object({
  id: uuidSchema,
  type: Joi.string().valid('custom').required(),
  instruction: htmlSchema.allow('').required(),
  tagName: Joi.string()
    .valid(...Object.keys(componentsSchema))
    .required(),
  props: Joi.alternatives()
    .conditional('tagName', {
      switch: Object.entries(componentsSchema).map(([tagName, schema]) => ({ is: tagName, then: schema })),
      otherwise: Joi.object().required(),
    })
    .required(),
}).required();
