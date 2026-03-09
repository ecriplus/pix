import { usecases } from '../../domain/usecases/index.js';
import * as networkSerializer from '../../infrastructure/serializers/jsonapi/network/network.serializer.js';

const findAllNetworks = async function (request, h, dependencies = { networkSerializer }) {
  const networks = await usecases.findAllNetworks();
  return dependencies.networkSerializer.serialize(networks);
};

const create = async function (request, h) {
  const { organizationId, networkName } = networkSerializer.deserialize({
    data: request.payload.data,
  });

  await usecases.createNetwork({
    organizationId,
    networkName,
  });

  return h.response().code(201);
};

const networkAdminController = {
  create,
  findAllNetworks,
};

export { networkAdminController };
