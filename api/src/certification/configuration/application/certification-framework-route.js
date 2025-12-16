import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { certificationFrameworkController } from './certification-framework-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/admin/certification-frameworks',
      config: {
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.hasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleCertif,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: certificationFrameworkController.findCertificationFrameworks,
        tags: ['api', 'admin'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés avec le rôle Super Admin, Support, Certif et Métier',
          'Elle renvoie la liste des référentiels de certification existants.',
        ],
      },
    },
  ]);
};

const name = 'certification-frameworks-api';
export { name, register };
