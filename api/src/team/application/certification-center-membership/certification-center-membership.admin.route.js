import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { certificationCenterMembershipAdminController } from './certification-center-membership.admin.controller.js';

export const certificationCenterMembershipAdminRoutes = [
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
];
