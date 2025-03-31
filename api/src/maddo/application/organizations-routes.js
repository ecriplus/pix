import Joi from 'joi';

import { identifiersType } from '../../shared/domain/types/identifiers-type.js';
import { responseObjectErrorDoc } from '../../shared/infrastructure/open-api-doc/response-object-error-doc.js';
import { getOrganizationCampaigns, getOrganizations } from './organizations-controller.js';
import { isOrganizationInJurisdictionPreHandler, organizationPreHandler } from './pre-handlers.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/organizations',
      config: {
        auth: { access: { scope: 'meta' } },
        pre: [organizationPreHandler],
        handler: getOrganizations,
        description: 'Lister les organisations Pix Orga.',
        notes: [
          'Retourne la liste des organisations auxquelles l’application cliente a droit.',
          '**Cette route nécessite le scope meta.**',
        ],
        tags: ['api', 'meta'],
        response: {
          failAction: 'log',
          status: {
            200: Joi.object({
              id: Joi.number().description("ID de l'organisation"),
              name: Joi.string().description("Nom de l'organisation"),
            }).label('Organization'),
            401: responseObjectErrorDoc,
            403: responseObjectErrorDoc,
          },
        },
      },
    },
    {
      method: 'GET',
      path: '/api/organizations/{organizationId}/campaigns',
      config: {
        auth: { access: { scope: 'campaigns' } },
        validate: {
          params: Joi.object({
            organizationId: identifiersType.organizationId,
          }),
        },
        pre: [organizationPreHandler, isOrganizationInJurisdictionPreHandler],
        handler: getOrganizationCampaigns,
        description: 'Lister les campagnes d’une organisation.',
        notes: [
          'Retourne la liste des campagnes de l’organisation avec l’identifiant `organizationId`.',
          '**Cette route nécessite le scope campaigns.**',
        ],
        tags: ['api', 'meta'],
        response: {
          failAction: 'log',
          status: {
            200: Joi.object({
              id: Joi.number().description('ID de la campagne'),
              name: Joi.string().description('Nom de la campagne'),
              organizationId: Joi.number().description("ID de l'organisation propriétaire de la campagne"),
              organizationName: Joi.string().description("Nom de l'organisation propriétaire de la campagne"),
              type: Joi.string().description('Type de la campagne : ASSESSMENT, EXAM, PROFILES_COLLECTION'),
              targetProfileId: Joi.number().description(
                'ID du profil cible lié à la campagne, null si le type est PROFILES_COLLECTION',
              ),
              targetProfileName: Joi.string().description(
                'Nom du profil cible lié à la campagne, null si le type est PROFILES_COLLECTION',
              ),
              code: Joi.string().description('Code campagne'),
              createdAt: Joi.date().description('Date de création de la campagne'),
            }).label('Organization'),
            401: responseObjectErrorDoc,
            403: responseObjectErrorDoc,
          },
        },
      },
    },
  ]);
};

const name = 'maddo-meta-api';
export { name, register };
