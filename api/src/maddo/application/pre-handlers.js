import boom from '@hapi/boom';

import { usecases } from '../domain/usecases/index.js';

export const organizationPreHandler = {
  assign: 'organizationIds',
  method: async function (
    request,
    _,
    dependencies = { findOrganizationIdsByClientApplication: usecases.findOrganizationIdsByClientApplication },
  ) {
    return dependencies.findOrganizationIdsByClientApplication({ clientId: request.auth.credentials.client_id });
  },
};

export const isOrganizationInJurisdictionPreHandler = {
  method: function (request, h) {
    return isOrganizationInJurisdiction(request.pre?.organizationIds, request.params.organizationId, h);
  },
};

export const isCampaignInJurisdictionPreHandler = {
  method: async function (
    request,
    h,
    dependencies = { getCampaignOrganizationId: usecases.getCampaignOrganizationId },
  ) {
    const { campaignId } = request.params;
    const organizationId = await dependencies.getCampaignOrganizationId({ campaignId });
    return isOrganizationInJurisdiction(request.pre?.organizationIds, organizationId, h);
  },
};

function isOrganizationInJurisdiction(jurisdictionOrganizationIds = [], organizationId, h) {
  if (!jurisdictionOrganizationIds.includes(organizationId)) {
    return boom.forbidden();
  }
  return h.continue;
}
