export function attachCombinedCourseBlueprintToOrganizations(schema, request) {
  const params = JSON.parse(request.requestBody);
  const organizationsToAttach = params['organization-ids'];
  organizationsToAttach.forEach((organizationId) =>
    schema.organizations.create({ id: organizationId, name: `Organization ${organizationId}` }),
  );

  return { data: { attributes: { 'duplicated-ids': [], 'attached-ids': organizationsToAttach } } };
}
