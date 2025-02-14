import Joi from 'joi';

import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { certificationCenterMembershipAdminController } from './certification-center-membership.admin.controller.js';

export const certificationCenterMembershipAdminRoutes = [
  {
    method: 'GET',
    path: '/api/admin/users/{id}/certification-center-memberships',
    config: {
      pre: [
        {
          method: (request, h) =>
            securityPreHandlers.hasAtLeastOneAccessOf([
              securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
              securityPreHandlers.checkAdminMemberHasRoleCertif,
              securityPreHandlers.checkAdminMemberHasRoleSupport,
              securityPreHandlers.checkAdminMemberHasRoleMetier,
            ])(request, h),
        },
      ],
      validate: {
        params: Joi.object({
          id: identifiersType.userId,
        }),
      },
      handler: certificationCenterMembershipAdminController.findCertificationCenterMembershipsByUser,
      notes: [
        "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
          '- Elle permet à un administrateur de lister les centres de certification auxquels appartient l´utilisateur',
      ],
      tags: ['api', 'admin', 'user', 'certification-centers'],
    },
  },
  {
    method: 'PATCH',
    path: '/api/admin/certification-center-memberships/{id}',
    config: {
      handler: (request, h) => certificationCenterMembershipAdminController.updateRole(request, h),
      pre: [
        {
          method: (request, h) =>
            securityPreHandlers.hasAtLeastOneAccessOf([
              securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
              securityPreHandlers.checkAdminMemberHasRoleCertif,
              securityPreHandlers.checkAdminMemberHasRoleSupport,
              securityPreHandlers.checkAdminMemberHasRoleMetier,
            ])(request, h),
          assign: 'hasAuthorizationToAccessAdminScope',
        },
      ],
      notes: [
        "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
          "- Modification du rôle d'un membre d'un centre de certification\n",
      ],
      tags: ['api', 'team', 'admin', 'certification-center-membership'],
    },
  },
  {
    method: 'DELETE',
    path: '/api/admin/certification-center-memberships/{id}',
    config: {
      handler: certificationCenterMembershipAdminController.disableFromPixAdmin,
      pre: [
        {
          method: (request, h) =>
            securityPreHandlers.hasAtLeastOneAccessOf([
              securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
              securityPreHandlers.checkAdminMemberHasRoleCertif,
              securityPreHandlers.checkAdminMemberHasRoleSupport,
              securityPreHandlers.checkAdminMemberHasRoleMetier,
            ])(request, h),
          assign: 'hasAuthorizationToAccessAdminScope',
        },
      ],
      notes: [
        "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
          '- Désactivation d‘un lien entre un utilisateur et un centre de certification\n',
      ],
      tags: ['api', 'certification-center-membership'],
    },
  },
  {
    method: 'POST',
    path: '/api/admin/certification-centers/{certificationCenterId}/certification-center-memberships',
    config: {
      pre: [
        {
          method: (request, h) =>
            securityPreHandlers.hasAtLeastOneAccessOf([
              securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
              securityPreHandlers.checkAdminMemberHasRoleCertif,
              securityPreHandlers.checkAdminMemberHasRoleSupport,
              securityPreHandlers.checkAdminMemberHasRoleMetier,
            ])(request, h),
          assign: 'hasAuthorizationToAccessAdminScope',
        },
      ],
      validate: {
        params: Joi.object({
          certificationCenterId: identifiersType.certificationCenterId,
        }),
        payload: Joi.object().required().keys({
          email: Joi.string().email().required(),
        }),
      },
      handler: certificationCenterMembershipAdminController.createCertificationCenterMembershipByEmail,
      notes: [
        "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
          "- Création d‘un nouveau membre d'un centre de certification,\n" +
          "à partir de l'adresse e-mail d'un utilisateur.",
      ],
      tags: ['api', 'certification-center-membership'],
    },
  },
];
