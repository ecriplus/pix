import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

function serialize(module) {
  return new Serializer('module', {
    transform(module) {
      return {
        id: module.id,
        slug: module.slug,
        title: module.title,
        isBeta: module.isBeta,
        version: module.version,
        details: module.details,
        grains: module.grains.map((grain) => {
          return {
            id: grain.id,
            title: grain.title,
            type: grain.type,
            components: grain.components,
          };
        }),
      };
    },
    attributes: ['slug', 'title', 'isBeta', 'version', 'grains', 'details'],
    grains: {
      ref: 'id',
      includes: true,
      attributes: ['title', 'type', 'components'],
    },
    typeForAttribute(attribute) {
      if (attribute === 'grains') {
        return 'grains';
      }
      if (attribute === 'module') {
        return 'modules';
      }
    },
  }).serialize(module);
}

export { serialize };
