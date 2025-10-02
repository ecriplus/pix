import Joi from 'joi';

import { PayloadTooLargeError, sendJsonApiError } from '../../../shared/application/http-errors.js';
import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { MAX_FILE_SIZE_UPLOAD } from '../../../shared/domain/constants.js';
import { identifiersType, optionalIdentifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { certificationCenterAdminController } from './certification-center.admin.controller.js';

const ERRORS = {
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
};

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/admin/certification-centers',
      config: {
        handler: certificationCenterAdminController.findPaginatedFilteredCertificationCenters,
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
          query: Joi.object({
            page: Joi.object({
              number: Joi.number().integer(),
              size: Joi.number().integer(),
            }).default({}),
            filter: Joi.object({
              id: optionalIdentifiersType.certificationCenterId,
              name: Joi.string().trim().empty('').allow(null).optional(),
              type: Joi.string().trim().empty('').allow(null).optional(),
              externalId: Joi.string().trim().empty('').allow(null).optional(),
            }).default({}),
          }),
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Liste des centres de certification\n',
        ],
        tags: ['api', 'organizational-entities', 'certification-center'],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/certification-centers',
      config: {
        handler: certificationCenterAdminController.create,
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
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Création d‘un nouveau centre de certification\n',
        ],
        tags: ['api', 'organizational-entities', 'certification-center'],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/certification-centers/{id}',
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
            id: identifiersType.certificationCenterId,
          }),
        },
        handler: certificationCenterAdminController.getCertificationCenterDetails,
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            "- Récupération d'un centre de certification\n",
        ],
        tags: ['api', 'organizational-entities', 'certification-center'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/certification-centers/{id}',
      config: {
        handler: (request, h) => certificationCenterAdminController.update(request, h),
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
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Elle met à jour les informations d‘un centre de certification\n',
        ],
        tags: ['api', 'admin', 'certification-center'],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/certification-centers/{certificationCenterId}/archive',
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
        handler: (request, h) => certificationCenterAdminController.archiveCertificationCenter(request, h),
        tags: ['api', 'admin', 'organizational-entities', 'certification-centers'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            "- Elle permet d'archiver un centre de certification",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/certification-centers/batch-archive',
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
        handler: (request, h) => certificationCenterAdminController.archiveInBatch(request, h),
        tags: ['api', 'admin', 'organizational-entities', 'certification-centers'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            "- Elle permet d'archiver plusieurs centres de certification dont les ID sont transmis par un CSV",
        ],
      },
    },
  ]);
};

const name = 'certification-centers-admin';
export { name, register };
