import { applyPagination, getPaginationFromQueryParams } from './pagination-utils';

export function createNetwork(schema, request) {
  const params = JSON.parse(request.requestBody);

  return schema.create('network', {
    id: 10,
    name: params.data.attributes.name,
    organizationId: params.data.attributes['organization-id'],
  });
}

export function updateNetwork(schema, request) {
  const networkId = request.params.id;
  const params = JSON.parse(request.requestBody);

  const network = schema.find('network', networkId);
  return network.update({ name: params.data.attributes.name });
}

export function findAllFilteredNetworks(schema, request) {
  const { page, pageSize } = getPaginationFromQueryParams(request.queryParams);
  const name = request.queryParams['filter[name]'];

  let networks = schema.networks.all().models;
  if (name) {
    networks = networks.filter((network) => network.name.toLowerCase().includes(name.toLowerCase()));
  }

  const rowCount = networks.length;
  const paginatedNetworks = applyPagination(networks, { page, pageSize });

  return {
    data: paginatedNetworks.map((network) => ({
      id: network.id,
      type: 'networks',
      attributes: { name: network.name },
    })),
    meta: {
      page,
      pageSize,
      rowCount,
      pageCount: Math.ceil(rowCount / pageSize) || 0,
    },
  };
}
