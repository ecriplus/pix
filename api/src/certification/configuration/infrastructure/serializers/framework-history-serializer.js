import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function ({ scope, frameworkHistory }) {
  return new Serializer('framework-history', {
    id: 'scope',
    attributes: ['scope', 'history'],
  }).serialize({ scope, history: frameworkHistory });
};

export { serialize };
