import Joi from 'joi';

import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { certificationCenterMembershipController } from './certification-center-membership.controller.js';

export const certificationCenterMembershipRoute = [
  {
    method: 'GET',
    path: '/api/certification-centers/{certificationCenterId}/members',
    config: {
      pre: [
        {
          method: securityPreHandlers.checkUserIsMemberOfCertificationCenter,
          assign: 'isMemberOfCertificationCenter',
        },
      ],
      validate: {
        params: Joi.object({
          certificationCenterId: identifiersType.certificationCenterId,
        }),
      },
      handler: (request, h) => certificationCenterMembershipController.findCertificationCenterMemberships(request, h),
      notes: [
        '- **Cette route est restreinte aux utilisateurs appartenant à un centre de certification**\n' +
          "- Récupération de tous les membres d'un centre de certification.\n",
      ],
      tags: ['api', 'team', 'certification-center', 'members'],
    },
  },
  {
    method: 'PATCH',
    path: '/api/certification-centers/{certificationCenterId}/certification-center-memberships/{id}',
    config: {
      validate: {
        params: Joi.object({
          certificationCenterId: identifiersType.certificationCenterId,
          id: identifiersType.certificationCenterMembershipId,
        }),
      },
      handler: certificationCenterMembershipController.updateFromPixCertif,
      pre: [
        {
          method: securityPreHandlers.checkUserIsAdminOfCertificationCenter,
          assign: 'hasAuthorizationToAccessAdminScope',
        },
      ],
      notes: [
        "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
          "- Modification du rôle d'un membre d'un centre de certification\n",
      ],
      tags: ['api', 'certification-center-membership'],
    },
  },
];
