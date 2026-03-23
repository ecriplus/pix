import Joi from 'joi';

import { securityPreHandlers } from '../../shared/application/security-pre-handlers.js';
import { attestationController } from './attestation-controller.js';

const MAX_FILE_SIZE_UPLOAD = 1048576 * 1; // 1Mb

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/admin/attestations',
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
        validate: {
          payload: Joi.object({
            templateKey: Joi.string().required(),
            templateName: Joi.string().required(),
            templateFile: Joi.any().required(),
          }).required(),
        },
        payload: {
          maxBytes: MAX_FILE_SIZE_UPLOAD,
          multipart: { output: 'annotated' },
          output: 'file',
          parse: true,
        },
        handler: attestationController.save,
        notes: ["- Creation d'une attestation"],
        tags: ['api', 'attestation'],
      },
    },
  ]);
};

const name = 'quest/attestations-api';
export { name, register };
