import Joi from 'joi';

const VALUES = {
  PIX_APP: 'pix-app',
  PIX_ORGA: 'pix-orga',
  PIX_CERTIF: 'pix-certif',
};

const assert = (value) => {
  Joi.assert(value, Joi.string().valid(...Object.values(VALUES)));
};

export const LegalDocumentService = { VALUES, assert };
