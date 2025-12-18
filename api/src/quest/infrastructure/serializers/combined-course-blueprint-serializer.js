import jsonapiSerializer from 'jsonapi-serializer';

const { Deserializer, Serializer } = jsonapiSerializer;

const serialize = function (combinedCourseBlueprint) {
  return new Serializer('combined-course-blueprints', {
    attributes: ['name', 'internalName', 'description', 'illustration', 'content', 'createdAt', 'updatedAt'],
  }).serialize(combinedCourseBlueprint);
};

const deserialize = function (payload) {
  return new Deserializer({
    keyForAttribute: 'camelCase',
  }).deserialize(payload);
};

export { deserialize, serialize };
