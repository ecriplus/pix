import Joi from 'joi';

import { identifiersType } from '../../shared/domain/types/identifiers-type.js';
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
        notes: ["- Retourne la liste des organisations auxquelles l'application client a droit"],
        tags: ['api', 'meta'],
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
        notes: ["- Retourne la liste des campaignes de l'organisation donnée"],
        tags: ['api', 'meta'],
      },
    },
  ]);
};

const name = 'maddo-meta-api';
export { name, register };
