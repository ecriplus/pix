import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (combinedCourseBlueprint) {
  return new Serializer('combined-course-blueprints', {
    attributes: ['name', 'internalName', 'description', 'illustration', 'content', 'createdAt', 'updatedAt'],
  }).serialize(combinedCourseBlueprint);
};

export { serialize };
