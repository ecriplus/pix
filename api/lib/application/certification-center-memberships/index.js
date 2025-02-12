import Joi from 'joi';

import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../src/shared/domain/types/identifiers-type.js';
import { certificationCenterMembershipController } from './certification-center-membership-controller.js';

const register = async function (server) {
  const globalRoutes = [
    {
      method: 'DELETE',
      path: '/api/certification-center-memberships/{certificationCenterMembershipId}',
      config: {
        validate: {
          params: Joi.object({
            certificationCenterMembershipId: identifiersType.certificationCenterMembershipId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminOfCertificationCenterWithCertificationCenterMembershipId,
          },
        ],
        handler: certificationCenterMembershipController.disableFromPixCertif,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            "- Suppression d'un membre d'un centre de certification\n",
        ],
        tags: ['api', 'certification-center-membership'],
      },
    },
  ];

  server.route([...globalRoutes]);
};

const name = 'certification-center-memberships-api';
export { name, register };
