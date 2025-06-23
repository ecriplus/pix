import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (consolidatedFramework) {
  return new Serializer('certification-consolidated-framework', {
    attributes: ['complementaryCertificationKey', 'createdAt', 'tubeIds'],
  }).serialize(consolidatedFramework);
};

export { serialize };
