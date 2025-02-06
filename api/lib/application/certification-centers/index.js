import Joi from 'joi';

import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../src/shared/domain/types/identifiers-type.js';
import { certificationCenterController } from './certification-center-controller.js';

const register = async function (server) {
  const adminRoutes = [
    {
      method: 'GET',
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
        },
        handler: certificationCenterController.findCertificationCenterMembershipsByCertificationCenter,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            "- Récupération de tous les membres d'un centre de certification.\n",
        ],
        tags: ['api', 'admin', 'certification-center-membership'],
      },
    },
  ];
  const certifRoutes = [
    {
      method: 'POST',
      path: '/api/certif/certification-centers/{certificationCenterId}/update-referer',
      config: {
        handler: certificationCenterController.updateReferer,
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminOfCertificationCenter,
            assign: 'isAdminOfCertificationCenter',
          },
        ],
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            "- Mise à jour du status de référent d'un membre d'un espace pix-certif\n",
        ],
        tags: ['api', 'certification-center-membership'],
      },
    },
  ];

  server.route([...adminRoutes, ...certifRoutes]);
};

const name = 'certification-centers-api';
export { name, register };
