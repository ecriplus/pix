import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { certificationCenterController } from './certification-center-controller.js';

const register = async function (server) {
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

  server.route([...certifRoutes]);
};

const name = 'certification-centers-api';
export { name, register };
