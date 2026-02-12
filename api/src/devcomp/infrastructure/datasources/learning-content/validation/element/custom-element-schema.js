import { schema as componentsSchema } from '@1024pix/epreuves-components/schema';
import Joi from 'joi';

import { htmlSchema, uuidSchema } from '../utils.js';

const commonProps = {
  id: uuidSchema,
  type: Joi.string().valid('custom').required(),
  instruction: htmlSchema.allow('').required(),
};

export const customElementSchema = Joi.alternatives().conditional('.tagName', {
  switch: Object.entries(componentsSchema).map(([tagName, schema]) => ({
    is: tagName,
    then: Joi.object({
      ...commonProps,
      tagName: Joi.string().valid(tagName).required(),
      props: schema,
    })
      .meta({ title: tagName })
      .required(),
  })),
});
