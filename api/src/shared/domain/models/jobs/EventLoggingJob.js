import Joi from 'joi';

import {
  CampaignParticipationLoggerContext,
  OrganizationLearnerLoggerContext,
} from '../../../../prescription/shared/domain/constants.js';
import { EntityValidationError } from '../../errors.js';

const CLIENTS = ['PIX_ADMIN', 'PIX_APP', 'PIX_ORGA', 'SCRIPT'];
const ACTIONS = [
  'ANONYMIZATION',
  'ANONYMIZATION_GAR',
  'EMAIL_CHANGED',
  ...Object.values(CampaignParticipationLoggerContext),
  ...Object.values(OrganizationLearnerLoggerContext),
];
const ROLES = ['SUPER_ADMIN', 'SUPPORT', 'USER', 'ORGA_ADMIN'];

const EventLogSchema = Joi.object({
  client: Joi.string()
    .valid(...CLIENTS)
    .required(),
  action: Joi.string()
    .valid(...ACTIONS)
    .required(),
  role: Joi.string()
    .valid(...ROLES)
    .required(),
  userId: Joi.number().required(),
  targetUserIds: Joi.array().items(Joi.number()).min(1).required(),
  data: Joi.object().optional(),
  occurredAt: Joi.date().optional(),
});

export class EventLoggingJob {
  constructor({ client, action, role, userId, targetUserIds, data, occurredAt }) {
    this.client = client;
    this.action = action;
    this.role = role;
    this.userId = userId;
    this.targetUserIds = targetUserIds;
    this.data = data;
    this.occurredAt = occurredAt || new Date();

    this.#validate();
  }

  static forUser({ client, action, role, userId, updatedByUserId, data, occurredAt }) {
    return new EventLoggingJob({
      client,
      action,
      role,
      targetUserIds: userId ? [userId] : [],
      userId: updatedByUserId,
      data,
      occurredAt,
    });
  }

  static forUsers({ client, action, role, userIds, updatedByUserId, data, occurredAt }) {
    return new EventLoggingJob({
      client,
      action,
      role,
      targetUserIds: userIds ? userIds : [],
      userId: updatedByUserId,
      data,
      occurredAt,
    });
  }

  #validate() {
    const { error } = EventLogSchema.validate(this, { abortEarly: false });
    if (error) throw EntityValidationError.fromJoiErrors(error.details);
  }
}
