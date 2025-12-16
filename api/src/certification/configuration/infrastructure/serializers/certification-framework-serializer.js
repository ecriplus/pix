import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

export function serialize(frameworks) {
  return new Serializer('certification-framework', {
    attributes: ['name', 'activeVersionStartDate'],
  }).serialize(frameworks);
}
