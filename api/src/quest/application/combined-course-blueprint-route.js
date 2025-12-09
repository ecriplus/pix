import { securityPreHandlers } from '../../shared/application/security-pre-handlers.js';
import * as combinedCourseBlueprintController from './combined-course-blueprint-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/combined-course-blueprints',
      config: {
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.hasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleCertif,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: combinedCourseBlueprintController.findAll,
        notes: ['- Récupération de la liste des schémas de parcours combinés'],
        tags: ['api', 'combined-course'],
      },
    },
  ]);
};

const name = 'combined-course-blueprints-api';
export { name, register };
