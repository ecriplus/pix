import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (attestations) {
  return new Serializer('attestation', {
    attributes: ['key'],
  }).serialize(attestations);
};

export { serialize };
