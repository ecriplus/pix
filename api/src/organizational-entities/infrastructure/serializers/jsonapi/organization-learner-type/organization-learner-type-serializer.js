import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (organizationLearnerType) {
  return new Serializer('organization-learner-types', {
    transform(record) {
      return {
        name: record.name,
      };
    },
    attributes: ['name'],
  }).serialize(organizationLearnerType);
};

export { serialize };
