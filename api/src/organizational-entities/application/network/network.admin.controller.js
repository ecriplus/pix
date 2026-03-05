import { usecases } from '../../domain/usecases/index.js';
import * as networkSerializer from '../../infrastructure/serializers/jsonapi/network/network.serializer.js';

const create = async function (request) {
  const { organizationId, networkName } = networkSerializer.deserialize({
    data: request.payload.data,
  });

  return usecases.createNetwork({
    organizationId,
    networkName,
  });
};

const networkAdminController = {
  create,
};

export { networkAdminController };
