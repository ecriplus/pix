export async function findOrganizations({ organizationIds, organizationRepository }) {
  return organizationRepository.findByIds(organizationIds);
}
