import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

function serialize(module) {
  return new Serializer('module', {
    transform(module) {
      const transformedModule = {
        id: module.id,
        slug: module.slug,
        title: module.title,
        isBeta: module.isBeta,
        version: module.version,
        details: module.details,
        sections: module.sections.map((section) => {
          return {
            id: section.id,
            type: section.type,
            grains: section.grains,
          };
        }),
      };

      if (module.redirectionUrl) {
        transformedModule.redirectionUrl = module.redirectionUrl;
      }

      return transformedModule;
    },
    attributes: ['slug', 'title', 'isBeta', 'version', 'sections', 'details', 'redirectionUrl'],
    sections: {
      ref: 'id',
      includes: true,
      attributes: ['type', 'grains'],
    },
    typeForAttribute(attribute) {
      if (attribute === 'sections') {
        return 'sections';
      }
      if (attribute === 'module') {
        return 'modules';
      }
    },
  }).serialize(module);
}

export { serialize };
