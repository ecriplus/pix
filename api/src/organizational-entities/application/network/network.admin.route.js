import Joi from 'joi';

import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { networkAdminController } from './network.admin.controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
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
        handler: networkAdminController.findAllNetworks,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès Superadmin**\n" +
            '- Renvoie tous les réseaux.',
        ],
        tags: ['api', 'organizational-entities', 'network'],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/networks/{networkId}',
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
          params: Joi.object({
            networkId: identifiersType.networkId,
          }),
        },
        handler: (request, h) => networkAdminController.getNetworkDetails(request, h),
        tags: ['api', 'organizational-entities', 'network'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès super admin**\n" +
            "- Elle permet de récupérer les informations d'un réseau",
        ],
      },
    },
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
                name: Joi.string().required(),
                'organization-id': identifiersType.organizationId.required(),
              }),
              type: Joi.string(),
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
