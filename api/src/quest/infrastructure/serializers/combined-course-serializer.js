import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (combinedCourse) {
  return new Serializer('combined-courses', {
    attributes: ['name', 'code', 'organizationId', 'status', 'items'],
    items: {
      ref: 'id',
      included: true,
      attributes: ['title', 'reference'],
    },
    typeForAttribute: (attribute) => {
      if (attribute === 'items') return 'combined-course-items';
      else return attribute;
    },
  }).serialize(combinedCourse);
};

export { serialize };
