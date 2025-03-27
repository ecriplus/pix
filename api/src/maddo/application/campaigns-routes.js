import Joi from 'joi';

import { identifiersType } from '../../shared/domain/types/identifiers-type.js';
import { getCampaignParticipations } from './campaigns-controller.js';
import { isCampaignInJurisdictionPreHandler, organizationPreHandler } from './pre-handlers.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/campaigns/{campaignId}/participations',
      config: {
        auth: { access: { scope: 'campaigns' } },
        validate: {
          params: Joi.object({
            campaignId: identifiersType.campaignId,
          }),
        },
        pre: [organizationPreHandler, isCampaignInJurisdictionPreHandler],
        handler: getCampaignParticipations,
        notes: ['- Retourne les résultats de la campagne donnée.'],
        tags: ['api', 'campaigns', 'maddo'],
      },
    },
  ]);
};

const name = 'maddo-campaigns-api';
export { name, register };
