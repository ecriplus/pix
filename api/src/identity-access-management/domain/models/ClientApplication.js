import Joi from 'joi';

import { DeleteUnknownClientApplicationJurisdictionTagError, MissingClientApplicationScopesError } from '../errors.js';

export class ClientApplication {
  constructor({ id, name, clientId, clientSecret, scopes, jurisdiction }) {
    this.id = id;
    this.name = name;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
    this.jurisdiction = Joi.attempt(jurisdiction, jurisdictionSchema);
  }

  addJurisdictionTag(tag) {
    if (!this.jurisdiction) {
      this.jurisdiction = { rules: [{ name: 'tags', value: [tag] }] };
      return;
    }
    const tagRule = this.jurisdiction.rules.find((rule) => rule.name === 'tags');
    if (!tagRule) {
      this.jurisdiction.rules.push({ name: 'tags', value: [tag] });
    } else {
      tagRule.value = [...new Set([...tagRule.value, tag])];
    }
  }

  removeJurisdictionTag(tag) {
    const tagRule = this.jurisdiction?.rules.find((rule) => rule.name === 'tags');
    if (!tagRule || !tagRule.value.includes(tag)) {
      throw new DeleteUnknownClientApplicationJurisdictionTagError();
    }

    tagRule.value = tagRule.value.filter((t) => t !== tag);

    if (tagRule.value.length === 0) {
      this.jurisdiction.rules = this.jurisdiction.rules.filter((rule) => rule.name !== 'tags');
    }
    if (this.jurisdiction.rules.length === 0) {
      delete this.jurisdiction.rules;
    }
    if (Object.keys(this.jurisdiction).length === 0) {
      this.jurisdiction = null;
    }
  }
}

const jurisdictionSchema = Joi.object({
  rules: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().valid('tags').required(),
        value: Joi.array().items(Joi.string()).required().min(1),
      }).required(),
    )
    .required()
    .min(1),
})
  .unknown()
  .allow(null);
