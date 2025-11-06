import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (combinedCourseParticipation) {
  return new Serializer('combined-course-participation-details', {
    attributes: ['firstName', 'lastName'],
  }).serialize(combinedCourseParticipation);
};

export { serialize };
