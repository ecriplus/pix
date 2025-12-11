import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;
const { Deserializer } = jsonapiSerializer;

const serialize = function (badge = {}) {
  return new Serializer('badge', {
    ref: 'id',
    attributes: ['altMessage', 'imageUrl', 'message', 'key', 'title', 'isCertifiable', 'isAlwaysVisible'],
  }).serialize(badge);
};

const deserialize = function (payload) {
  return new Deserializer({
    keyForAttribute: 'camelCase',
  })
    .deserialize(payload)
    .then((record) => {
      return {
        key: record.key,
        altMessage: record.altMessage,
        message: record.message,
        title: record.title,
        isCertifiable: record.isCertifiable,
        isAlwaysVisible: record.isAlwaysVisible,
        imageUrl: record.imageUrl.trim(),
      };
    });
};

const badgeSerializer = { deserialize, serialize };
export { badgeSerializer };
