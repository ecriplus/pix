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
