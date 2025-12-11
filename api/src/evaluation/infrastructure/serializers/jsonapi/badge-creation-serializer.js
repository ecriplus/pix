import jsonapiSerializer from 'jsonapi-serializer';

const { Deserializer } = jsonapiSerializer;

const deserialize = function (payload) {
  return new Deserializer({
    keyForAttribute: 'camelCase',
  })
    .deserialize(payload)
    .then((record) => {
      return {
        ...record,
        imageUrl: record.imageUrl.trim(),
      };
    });
};

const badgeCreationDeserializer = { deserialize };
export { badgeCreationDeserializer };
