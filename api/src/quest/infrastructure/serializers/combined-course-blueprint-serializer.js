import jsonapiSerializer from 'jsonapi-serializer';

import { CombinedCourseBlueprint } from '../../domain/models/CombinedCourseBlueprint.js';

const { Deserializer, Serializer } = jsonapiSerializer;

const serialize = function (combinedCourseBlueprint) {
  return new Serializer('combined-course-blueprints', {
    attributes: ['name', 'internalName', 'description', 'illustration', 'content', 'createdAt', 'updatedAt'],
  }).serialize(combinedCourseBlueprint);
};

const deserialize = async function (payload) {
  const deserializedData = await new Deserializer({
    keyForAttribute: 'camelCase',
  }).deserialize(payload);
  return new CombinedCourseBlueprint(deserializedData);
};

export { deserialize, serialize };
