import { usecases } from '../../domain/usecases/index.js';
import * as networkSerializer from '../../infrastructure/serializers/jsonapi/network/network.serializer.js';

const findAllNetworks = async function (request, h, dependencies = { networkSerializer }) {
  const networks = await usecases.findAllNetworks();
  return dependencies.networkSerializer.serialize(networks);
};

const getNetworkDetails = async function (request, h, dependencies = { networkSerializer }) {
  const networkId = request.params.networkId;
  const network = await usecases.getNetworkDetails({ networkId });
  return dependencies.networkSerializer.serialize(network);
};

const create = async function (request, h, dependencies = { networkSerializer }) {
  const { organizationId, networkName } = networkSerializer.deserialize({
    data: request.payload.data,
  });

  const network = await usecases.createNetwork({
    organizationId,
    networkName,
  });

  const serializedNetwork = await dependencies.networkSerializer.serialize(network);

  return h.response(serializedNetwork).code(201);
};

const networkAdminController = {
  create,
  findAllNetworks,
  getNetworkDetails,
};

export { networkAdminController };
