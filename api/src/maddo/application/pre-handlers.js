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
    const jurisdictionOrganizationIds = request.pre?.organizationIds ?? [];
    if (!jurisdictionOrganizationIds.includes(request.params.organizationId)) {
      return boom.forbidden();
    }
    return h.continue;
  },
};
