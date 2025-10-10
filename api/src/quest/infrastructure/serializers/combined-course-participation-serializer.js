import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (combinedCourseParticipations, meta) {
  return new Serializer('combined-course-participations', {
    attributes: ['firstName', 'lastName', 'status', 'createdAt', 'updatedAt'],
    meta,
  }).serialize(combinedCourseParticipations);
};

export { serialize };
