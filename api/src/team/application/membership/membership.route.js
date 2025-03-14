import Joi from 'joi';

import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { membershipController } from './membership.controller.js';

export const membershipRoutes = [
  {
    method: 'PATCH',
    path: '/api/memberships/{id}',
    config: {
      pre: [
        {
          method: (request, h) => securityPreHandlers.checkUserIsAdminInOrganization(request, h),
          assign: 'isAdminInOrganization',
        },
      ],
      validate: {
        params: Joi.object({
          id: identifiersType.membershipId,
        }),
      },
      handler: (request, h) => membershipController.update(request, h),
      description: 'Update organization role by admin for a organization members',
      notes: [
        "- **Cette route est restreinte aux utilisateurs authentifiés en tant qu'administrateur de l'organisation**\n" +
          "- Elle permet de modifier le rôle d'un membre de l'organisation",
      ],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          order: 2,
        },
      },
      tags: ['api', 'team', 'memberships'],
    },
  },
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
      handler: (request, h) => membershipController.disableOwnOrganizationMembership(request, h),
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
          method: (request, h) => securityPreHandlers.checkUserIsAdminInOrganization(request, h),
          assign: 'isAdminInOrganization',
        },
      ],
      validate: {
        params: Joi.object({
          id: identifiersType.membershipId,
        }),
      },
      handler: (request, h) => membershipController.disable(request, h),
      tags: ['api'],
      notes: [
        "- **Cette route est restreinte aux utilisateurs authentifiés en tant qu'administrateur de l'organisation\n" +
          "- Elle permet la désactivation d'un membre",
      ],
    },
  },
  {
    method: 'GET',
    path: '/api/organizations/{id}/memberships',
    config: {
      pre: [
        {
          method: (request, h) => securityPreHandlers.checkUserBelongsToOrganization(request, h),
          assign: 'belongsToOrganization',
        },
      ],
      validate: {
        params: Joi.object({
          id: identifiersType.organizationId,
        }),
        query: Joi.object({
          filter: Joi.object({
            firstName: Joi.string().empty('').allow(null).optional(),
            lastName: Joi.string().empty('').allow(null).optional(),
            email: Joi.string().empty('').allow(null).optional(),
            organizationRole: Joi.string().empty('').allow(null).optional(),
          }).default({}),
          page: Joi.object({
            number: Joi.number().integer().empty('').allow(null).optional(),
            size: Joi.number().integer().empty('').allow(null).optional(),
          }).default({}),
        }),
      },
      handler: (request, h) => membershipController.findPaginatedFilteredMemberships(request, h),
      tags: ['api', 'team', 'organizations'],
      notes: [
        "Cette route est restreinte aux membres authentifiés d'une organisation",
        'Elle retourne les rôles des membres rattachés à l’organisation de manière paginée.',
      ],
    },
  },
  {
    method: 'POST',
    path: '/api/memberships/{membershipId}/access',
    config: {
      validate: {
        params: Joi.object({
          membershipId: identifiersType.membershipId,
        }),
      },
      handler: (request, h) => membershipController.updateLastAccessedAt(request, h),
      tags: ['api', 'team', 'organizations'],
      notes: [
        "Cette route est restreinte aux membres authentifiés d'une organisation",
        'Elle permet de mettre à jour la dernière date d’accès à une organisation d’un utilisateur.',
      ],
    },
  },
];
