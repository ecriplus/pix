import { HtmlValidate } from 'html-validate';
import Joi from 'joi';

const uuidSchema = Joi.string().guid({ version: 'uuidv4' }).required();

const proposalIdSchema = Joi.string().regex(/^\d+$/);

const htmlValidate = new HtmlValidate();
const htmlSchema = Joi.string()
  .external(async (value, helpers) => {
    const report = await htmlValidate.validateString(value);

    if (!report.valid) {
      return helpers.message('htmlvalidationerror', { value: report });
    }
  })
  .required();

export { htmlSchema, proposalIdSchema, uuidSchema };
