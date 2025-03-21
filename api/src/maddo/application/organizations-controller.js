import { usecases } from '../domain/usecases/index.js';

export async function getOrganizations(request, h, dependencies = { findOrganizations: usecases.findOrganizations }) {
  const organizations = await dependencies.findOrganizations({ organizationIds: request.pre.organizationIds });
  return h.response(organizations).code(200);
}
