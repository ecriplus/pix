export function createNetwork(schema, request) {
  const params = JSON.parse(request.requestBody);

  return schema.create('network', {
    name: params.data.attributes.name,
    organizationId: params.data.attributes['organization-id'],
  });
}
