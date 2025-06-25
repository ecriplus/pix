import Joi from 'joi';

import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { ORGANIZATION_FEATURE } from '../../../shared/domain/constants.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { organizationLearnersController } from './organization-learners-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/organizations/{organizationId}/organization-learners-level-by-tubes',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInOrganization,
            assign: 'checkUserIsAdminInOrganization',
          },
          {
            method: securityPreHandlers.makeCheckOrganizationHasFeature(ORGANIZATION_FEATURE.COVER_RATE.key),
            assign: 'makeCheckOrganizationHasFeature',
          },
        ],
        validate: {
          params: Joi.object({
            organizationId: identifiersType.organizationId,
          }),
        },
        handler: organizationLearnersController.getAnalysisByTubes,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Cette route retourne le taux de couverture par tubes pour l\'organisation"- ' +
            "- L'organisation doit avoir la feature COVER_RATE d'activée" +
            "- L'utilisateur doit être admin de l'organisation'",
        ],
        tags: ['api', 'organization', 'analysis'],
      },
    },
    {
      method: 'GET',
      path: '/api/organizations/{organizationId}/attestations/{attestationKey}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInOrganization,
            assign: 'checkUserIsAdminInOrganization',
          },
          {
            method: securityPreHandlers.makeCheckOrganizationHasFeature(
              ORGANIZATION_FEATURE.ATTESTATIONS_MANAGEMENT.key,
            ),
            assign: 'makeCheckOrganizationHasFeature',
          },
        ],
        validate: {
          params: Joi.object({
            organizationId: identifiersType.organizationId,
            attestationKey: Joi.string(),
          }),
          query: Joi.object({
            divisions: Joi.array().items(Joi.string()).default([]),
          }),
        },
        handler: organizationLearnersController.getAttestationZipForDivisions,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Génération d'un zip d'attestations pour une liste de classes d'une organisation" +
            "- L'utisateur doit être au moins membre de l'organisation'",
        ],
        tags: ['api', 'organization', 'attestations'],
      },
    },
  ]);
};

const name = 'organization-learners-route';
export { name, register };
