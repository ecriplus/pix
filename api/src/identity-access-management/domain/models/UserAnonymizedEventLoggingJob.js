import Joi from 'joi';

import { PIX_ADMIN } from '../../../authorization/domain/constants.js';
import { validateEntity } from '../../../shared/domain/validators/entity-validator.js';

const USER_ROLE = 'USER';

// Todo rename on UserAnonymizedEventLoggingJob in order to erase Event logging context
export class UserAnonymizedEventLoggingJob {
  constructor({ userId, updatedByUserId, client, role }) {
    this.userId = userId;
    this.updatedByUserId = updatedByUserId;
    this.client = client;
    this.occurredAt = new Date();
    this.role = role;

    validateEntity(USER_ANONYMIZED_SCHEMA, this);
  }
}

const USER_ANONYMIZED_SCHEMA = Joi.object({
  userId: Joi.number().integer().required(),
  updatedByUserId: Joi.number().integer().required(),
  client: Joi.string().valid('PIX_APP', 'PIX_ADMIN').required(),
  occurredAt: Joi.date().required(),
  role: Joi.string()
    .valid(USER_ROLE, ...Object.values(PIX_ADMIN.ROLES))
    .required(),
});
