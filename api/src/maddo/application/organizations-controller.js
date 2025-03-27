import { usecases } from '../domain/usecases/index.js';

export async function getOrganizations(request, h, dependencies = { findOrganizations: usecases.findOrganizations }) {
  const organizations = await dependencies.findOrganizations({ organizationIds: request.pre.organizationIds });
  return h.response(organizations).code(200);
}

export async function getOrganizationCampaigns(request, h, dependencies = { findCampaigns: usecases.findCampaigns }) {
  const requestedOrganizationId = request.params.organizationId;
  const campaigns = await dependencies.findCampaigns({ organizationId: requestedOrganizationId });
  return h.response(campaigns).code(200);
}
