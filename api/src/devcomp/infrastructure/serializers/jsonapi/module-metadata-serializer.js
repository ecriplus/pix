import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (moduleMetadataList) {
  return new Serializer('module-metadata', {
    attributes: ['shortId', 'slug', 'title', 'isBeta', 'duration', 'image', 'link', 'visibility'],
  }).serialize(moduleMetadataList);
};

export { serialize };
