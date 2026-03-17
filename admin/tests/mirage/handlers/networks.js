export function createNetwork(schema, request) {
  const params = JSON.parse(request.requestBody);

  return schema.create('network', {
    name: params.data.attributes.name,
    organizationId: params.data.attributes['organization-id'],
  });
}

export function findAllFilteredNetworks(schema, request) {
  const name = request.queryParams['filter[name]'];
  let networks = schema.networks.all().models;
  if (name) {
    networks = networks.filter((network) => network.name.toLowerCase().includes(name.toLowerCase()));
  }
  return { data: networks.map((n) => ({ id: n.id, type: 'networks', attributes: { name: n.name } })) };
}
