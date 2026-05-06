import JoiDate from '@joi/date';
import BaseJoi from 'joi';

import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { certificationVersionController } from './certification-version-controller.js';

const Joi = BaseJoi.extend(JoiDate);

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/admin/certification-versions/{certificationVersionId}',
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
        validate: {
          params: Joi.object({
            certificationVersionId: identifiersType.certificationVersionId,
          }),
        },
        handler: certificationVersionController.getVersionById,
        tags: ['api', 'admin'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          'Elle permet de récupérer une version par son id',
        ],
      },
    },
  ]);
};

const name = 'certification/configuration/certification-versions-api';
export { name, register };
