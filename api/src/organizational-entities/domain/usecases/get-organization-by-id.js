export function getOrganizationById({ id, organizationRepository }) {
  return organizationRepository.get(id);
}
