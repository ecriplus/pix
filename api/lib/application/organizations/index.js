import JoiDate from '@joi/date';
import BaseJoi from 'joi';
const Joi = BaseJoi.extend(JoiDate);

import {
  BadRequestError,
  PayloadTooLargeError,
  sendJsonApiError,
} from '../../../src/shared/application/http-errors.js';
import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { MAX_FILE_SIZE_UPLOAD } from '../../../src/shared/domain/constants.js';
import { identifiersType } from '../../../src/shared/domain/types/identifiers-type.js';
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
    {
      method: 'GET',
      path: '/api/admin/organizations',
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
          options: {
            allowUnknown: true,
          },
          query: Joi.object({
            filter: Joi.object({
              id: identifiersType.organizationId.empty('').allow(null).optional(),
              name: Joi.string().empty('').allow(null).optional(),
              hideArchived: Joi.boolean().optional(),
            }).default({}),
            page: Joi.object({
              number: Joi.number().integer().empty('').allow(null).optional(),
              size: Joi.number().integer().empty('').allow(null).optional(),
            }).default({}),
          }),
          failAction: (request, h) => {
            return sendJsonApiError(new BadRequestError('Un des champs de recherche saisis est invalide.'), h);
          },
        },
        handler: organizationController.findPaginatedFilteredOrganizations,
        tags: ['api', 'organizations'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant un rôle permettant un accès à l'admin de Pix**\n" +
            '- Elle permet de récupérer & chercher une liste d’organisations\n' +
            '- Cette liste est paginée et filtrée selon un **name** et/ou un **type** et/ou un **identifiant externe** donnés',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/organizations/{organizationId}/children',
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
            organizationId: identifiersType.organizationId,
          }),
        },
        handler: organizationController.findChildrenOrganizationsForAdmin,
        tags: ['api', 'organizations'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant un rôle permettant un accès à l'admin de Pix**\n" +
            '- Elle permet de récupérer la liste des organisations filles',
        ],
      },
    },
  ];
  server.route([...adminRoutes]);
};

const name = 'organization-api';
export { name, register };
