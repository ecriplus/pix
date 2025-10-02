import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (combinedCourse) {
  return new Serializer('combined-courses', {
    attributes: ['name', 'code', 'participationsCount', 'completedParticipationsCount'],
  }).serialize(combinedCourse);
};

export { serialize };
