import Joi from 'joi';

import { securityPreHandlers } from '../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../shared/domain/types/identifiers-type.js';
import { contentSchema } from '../domain/models/CombinedCourseBlueprint.js';
import * as combinedCourseBlueprintController from './combined-course-blueprint-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/admin/combined-course-blueprints',
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
        handler: combinedCourseBlueprintController.findAll,
        notes: ['- Récupération de la liste des schémas de parcours combinés'],
        tags: ['api', 'combined-course'],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/combined-course-blueprints',
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
            data: {
              type: 'combined-course-blueprints',
              attributes: {
                name: Joi.string().required(),
                'internal-name': Joi.string().required(),
                illustration: Joi.string().allow(null),
                description: Joi.string().allow(null),
                content: contentSchema,
                createdAt: Joi.date(),
              },
            },
          }),
          options: {
            allowUnknown: true,
          },
        },
        handler: combinedCourseBlueprintController.save,
        notes: ["- Creation d'un schéma de parcours combiné"],
        tags: ['api', 'combined-course'],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/combined-course-blueprints/{blueprintId}',
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
        handler: combinedCourseBlueprintController.getById,
        validate: {
          params: Joi.object({
            blueprintId: identifiersType.combinedCourseBlueprintId,
          }),
        },
        notes: ['- Récupération d‘un schémas de parcours combinés pour un identifiant donné'],
        tags: ['api', 'combined-course'],
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/combined-course-blueprints/{blueprintId}/organizations/{organizationId}',
      config: {
        validate: {
          params: Joi.object({
            blueprintId: identifiersType.combinedCourseBlueprintId,
            organizationId: identifiersType.organizationId,
          }),
        },
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.hasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: combinedCourseBlueprintController.detachOrganization,
        notes: ["- Retire l'accès à un schéma de parcours combinés pour une organisation donnée"],
        tags: ['api', 'combined-course'],
      },
    },
  ]);
};

const name = 'combined-course-blueprints-api';
export { name, register };
