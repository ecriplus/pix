import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (network) {
  return new Serializer('networks', {
    attributes: ['name'],
  }).serialize(network);
};

const deserialize = function (json) {
  const attributes = json.data.attributes;

  return {
    networkName: attributes['name'],
    organizationId: attributes['organization-id'],
  };
};

export { deserialize, serialize };
