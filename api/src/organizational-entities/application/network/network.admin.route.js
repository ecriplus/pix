import Joi from 'joi';

import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { networkAdminController } from './network.admin.controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/admin/networks',
      config: {
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.hasAtLeastOneAccessOf([securityPreHandlers.checkAdminMemberHasRoleSuperAdmin])(
                request,
                h,
              ),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        validate: {
          payload: Joi.object({
            data: Joi.object({
              attributes: Joi.object({
                'network-name': Joi.string().required(),
                'organization-id': identifiersType.organizationId.required(),
              }),
            }),
          }),
        },
        handler: networkAdminController.create,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Création d‘un nouveau réseau\n',
        ],
        tags: ['api', 'organizational-entities', 'network'],
      },
    },
  ]);
};

const name = 'organizational-entities/network-admin';
export { name, register };
