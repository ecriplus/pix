// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { schema: base } = require('./base-validation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'schema'.
const schema = base.keys({
  skillIds: Joi.array().items(Joi.any().invalid(null)).min(1).empty(null).required().messages({
    'any.required': 'SKILLS_REQUIRED',
    'any.invalid': 'SKILLS_REQUIRED',
    'array.min': 'SKILLS_REQUIRED',
  }),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validate'.
function validate(targetProfile: $TSFixMe) {
  const { error } = schema.validate(targetProfile, { abortEarly: false, allowUnknown: true });
  if (error) {
    throw EntityValidationError.fromJoiErrors(error.details);
  }
  return true;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validate,
};
