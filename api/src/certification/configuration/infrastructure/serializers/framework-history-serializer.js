import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function ({ complementaryCertificationKey, frameworkHistory }) {
  return new Serializer('framework-history', {
    id: 'complementaryCertificationKey',
    attributes: ['complementaryCertificationKey', 'history'],
  }).serialize({ complementaryCertificationKey, history: frameworkHistory });
};

export { serialize };
