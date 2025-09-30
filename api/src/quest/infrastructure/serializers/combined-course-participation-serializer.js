import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (combinedCourseParticipations) {
  return new Serializer('combined-course-participations', {
    attributes: ['firstName', 'lastName', 'status', 'createdAt', 'updatedAt'],
  }).serialize(combinedCourseParticipations);
};

export { serialize };
