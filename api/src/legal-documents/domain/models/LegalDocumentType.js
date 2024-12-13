import Joi from 'joi';

const VALUES = {
  TOS: 'TOS',
};

const assert = (value) => {
  Joi.assert(value, Joi.string().valid(...Object.values(VALUES)));
};

export const LegalDocumentType = { VALUES, assert };
