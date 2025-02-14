import Joi from 'joi';

import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../src/shared/domain/types/identifiers-type.js';
import { membershipController } from '../../../src/team/application/membership/membership.controller.js';
import { membershipController as libMembershipController } from './membership-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/memberships/me/disable',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInOrganization,
            assign: 'isAdminInOrganization',
          },
          {
            method: securityPreHandlers.checkUserCanDisableHisOrganizationMembership,
            assign: 'canDisableHisOrganizationMembership',
          },
        ],
        validate: {
          payload: Joi.object({
            organizationId: identifiersType.organizationId,
          }),
        },
        handler: libMembershipController.disableOwnOrganizationMembership,
        tags: ['api'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés en tant qu'administrateur de l'organisation\n" +
            "- Elle permet de se retirer d'une organisation",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/memberships/{id}/disable',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInOrganization,
            assign: 'isAdminInOrganization',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.membershipId,
          }),
        },
        handler: membershipController.disable,
        tags: ['api'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés en tant qu'administrateur de l'organisation\n" +
            "- Elle permet la désactivation d'un membre",
        ],
      },
    },
  ]);
};

const name = 'memberships-api';
export { name, register };
