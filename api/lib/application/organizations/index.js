import { PayloadTooLargeError, sendJsonApiError } from '../../../src/shared/application/http-errors.js';
import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { MAX_FILE_SIZE_UPLOAD } from '../../../src/shared/domain/constants.js';
import { organizationController } from './organization-controller.js';

const ERRORS = {
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
};

const register = async function (server) {
  const adminRoutes = [
    {
      method: 'POST',
      path: '/api/admin/organizations/import-csv',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        payload: {
          maxBytes: MAX_FILE_SIZE_UPLOAD,
          output: 'file',
          failAction: (request, h) => {
            return sendJsonApiError(
              new PayloadTooLargeError('An error occurred, payload is too large', ERRORS.PAYLOAD_TOO_LARGE, {
                maxSize: '20',
              }),
              h,
            );
          },
        },
        handler: organizationController.createInBatch,
        tags: ['api', 'admin', 'organizations'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Elle permet de créer de nouvelles organisations en masse.',
        ],
      },
    },
  ];
  server.route([...adminRoutes]);
};

const name = 'organization-api';
export { name, register };
